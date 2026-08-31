import {
  CASE_CONFLICT_MESSAGE,
  LOADED_LAST_MODIFIED_FIELD,
  OVERWRITE_FIELD,
  normalizeLoadedLastModified,
  updateCaseWithConcurrency,
} from "@/lib/case-concurrency";
import { listCasePageDestFields, type CasePageField } from "@/lib/case-page";
import { casesClient, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import { insertNextStepRowsForCase } from "@/lib/next-steps";
import { nextStepNamesFromFormData } from "@/lib/select-options";

type CasesUpdate = Database["public"]["Tables"]["cases"]["Update"];

export type UpdateCaseState = {
  ok: boolean;
  message: string;
  conflict?: boolean;
  lastModified?: string | null;
};

const IDENTITY_KEYS = new Set(["id"]);

function destFieldsByKey(): Map<string, CasePageField> {
  const fields = new Map<string, CasePageField>();
  for (const field of listCasePageDestFields()) {
    if (!IDENTITY_KEYS.has(field.key)) {
      fields.set(field.key, field);
    }
  }
  return fields;
}

function submittedString(formData: FormData, key: string): string | undefined {
  if (!formData.has(key)) return undefined;
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseNumberOrNull(
  raw: string,
  label: string,
): { ok: true; value: number | null } | { ok: false; message: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return {
      ok: false,
      message: `Could not save ${label}: enter a number or leave blank.`,
    };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) {
    return {
      ok: false,
      message: `Could not save ${label}: enter a number or leave blank.`,
    };
  }
  return { ok: true, value };
}

function parseSubmittedField(
  field: CasePageField,
  formData: FormData,
):
  | { ok: true; skip: true }
  | { ok: true; skip: false; value: CasesUpdate[keyof CasesUpdate] }
  | { ok: false; message: string } {
  if (field.fieldType === "checkbox") {
    if (!formData.has(field.key)) return { ok: true, skip: true };
    const checked = formData
      .getAll(field.key)
      .some((value) => value === "true" || value === "on");
    return { ok: true, skip: false, value: checked ? true : null };
  }

  if (field.key === "next_steps") {
    const parsed = nextStepNamesFromFormData(formData);
    if (!parsed.ok) {
      return { ok: false, message: `Could not save: ${parsed.message}` };
    }
    return {
      ok: true,
      skip: false,
      value: parsed.names,
    };
  }

  const raw = submittedString(formData, field.key);
  if (raw === undefined) return { ok: true, skip: true };

  if (field.fieldType === "multi dropdown") {
    const values = formData
      .getAll(field.key)
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    return {
      ok: true,
      skip: false,
      value: values.length === 0 ? null : values,
    };
  }

  if (field.fieldType === "money" || field.fieldType === "percent") {
    const parsed = parseNumberOrNull(raw, field.label);
    if (!parsed.ok) return parsed;
    return { ok: true, skip: false, value: parsed.value };
  }

  return { ok: true, skip: false, value: blankToNull(raw) };
}

export function casePatchFromFormData(
  formData: FormData,
):
  | { ok: true; id: string; patch: CasesUpdate }
  | { ok: false; message: string } {
  const idRaw = formData.get("caseRowId");
  const id = typeof idRaw === "string" ? idRaw : "";
  if (!isCaseId(id)) {
    return { ok: false, message: "Could not save: invalid case id." };
  }

  const patch: CasesUpdate = {};
  let submitted = 0;

  for (const field of destFieldsByKey().values()) {
    const parsed = parseSubmittedField(field, formData);
    if (!parsed.ok) return parsed;
    if (parsed.skip) continue;
    submitted += 1;
    Object.assign(patch, { [field.key]: parsed.value });
  }

  if (submitted === 0) {
    return { ok: false, message: "Could not save: no stored fields submitted." };
  }

  delete patch.last_modified;
  delete patch.last_modified_by;

  return { ok: true, id, patch };
}

function overwriteFromForm(formData: FormData): boolean {
  return (
    formData.get(OVERWRITE_FIELD) === "true" ||
    formData.getAll(OVERWRITE_FIELD).includes("true")
  );
}

export async function updateCaseFromForm(
  formData: FormData,
): Promise<UpdateCaseState> {
  const parsed = casePatchFromFormData(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  const result = await updateCaseWithConcurrency(client, parsed.id, parsed.patch, {
    loadedLastModified: normalizeLoadedLastModified(
      formData.get(LOADED_LAST_MODIFIED_FIELD),
    ),
    overwrite: overwriteFromForm(formData),
  });

  if (!result.ok) {
    if (result.kind === "empty") {
      return {
        ok: false,
        conflict: true,
        message: CASE_CONFLICT_MESSAGE,
      };
    }
    return { ok: false, message: result.message };
  }

  const nextSteps = parsed.patch.next_steps;
  if (Array.isArray(nextSteps) && nextSteps.length > 0) {
    const cabinet = await insertNextStepRowsForCase(client, parsed.id, nextSteps);
    if (!cabinet.ok) {
      return {
        ok: true,
        message: `Saved case fields, but a Next Steps row was not saved: ${cabinet.message}`,
        lastModified: result.row.last_modified,
      };
    }
  }

  return {
    ok: true,
    message: "Saved.",
    lastModified: result.row.last_modified,
  };
}
