import { listCasePageDestFields, type CasePageField } from "@/lib/case-page";
import { casesClient, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";

type CasesUpdate = Database["public"]["Tables"]["cases"]["Update"];

export type UpdateCaseState = {
  ok: boolean;
  message: string;
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

  return { ok: true, id, patch };
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

  const { data, error } = await client
    .from("cases")
    .update(parsed.patch)
    .eq("id", parsed.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data) {
    return { ok: false, message: "Could not save: case was not updated." };
  }

  return { ok: true, message: "Saved." };
}
