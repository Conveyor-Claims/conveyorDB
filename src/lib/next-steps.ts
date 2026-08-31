import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { OVERWRITE_FIELD } from "@/lib/case-concurrency";
import { casesClient, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import {
  findNextStepByName,
  LOADED_UPDATED_AT_FIELD,
  NEXT_STEP_CONFLICT_MESSAGE,
  normalizeLoadedUpdatedAt,
  type NextStepRow,
  type NextStepState,
  updateNextStepWithConcurrency,
} from "@/lib/next-step-concurrency";
import { getSession, isAdmin } from "@/lib/session";

export type { NextStepRow, NextStepState } from "@/lib/next-step-concurrency";
export {
  findNextStepByName,
  LOADED_UPDATED_AT_FIELD,
  NEXT_STEP_CONFLICT_MESSAGE,
  normalizeLoadedUpdatedAt,
  storedNextStepNames,
  updateNextStepWithConcurrency,
} from "@/lib/next-step-concurrency";

export type NextStepsForCase = {
  rows: NextStepRow[];
  error: string | null;
};

export const listNextStepsForCase = cache(
  async (caseId: string): Promise<NextStepsForCase> => {
    const { client } = casesClient();
    if (!client) {
      return { rows: [], error: "Supabase client is not configured." };
    }
    if (!isCaseId(caseId)) {
      return { rows: [], error: null };
    }

    const { data, error } = await client
      .from("next_steps")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true });

    if (error) {
      return { rows: [], error: error.message };
    }

    return { rows: data ?? [], error: null };
  },
);

function submittedString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

function overwriteFromForm(formData: FormData): boolean {
  return (
    formData.get(OVERWRITE_FIELD) === "true" ||
    formData.getAll(OVERWRITE_FIELD).includes("true")
  );
}

export async function claimNextStepFromForm(
  formData: FormData,
): Promise<NextStepState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return {
      ok: false,
      message: "Temporary login required to claim a next step.",
    };
  }

  const caseId = submittedString(formData, "caseRowId");
  if (!isCaseId(caseId)) {
    return { ok: false, message: "Could not save: invalid case id." };
  }

  const id = submittedString(formData, "nextStepId");
  if (!isCaseId(id)) {
    return { ok: false, message: "Could not save: invalid next step id." };
  }

  const name = submittedString(formData, "name").trim();
  if (name === "") {
    return { ok: false, message: "Name is stored text. Type or pick a name." };
  }

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  const existing = await client
    .from("next_steps")
    .select("id, case_id, name")
    .eq("id", id)
    .maybeSingle();
  if (existing.error) {
    return { ok: false, message: existing.error.message };
  }
  if (!existing.data || existing.data.case_id !== caseId) {
    return { ok: false, message: "Could not save: next step is not on this case." };
  }

  const duplicate = await findNextStepByName(client, caseId, name, id);
  if (duplicate.error) {
    return { ok: false, message: duplicate.error };
  }
  if (duplicate.row) {
    return {
      ok: false,
      message: `A next step named "${name}" already exists for this case.`,
    };
  }

  const result = await updateNextStepWithConcurrency(
    client,
    id,
    { name },
    {
      loadedUpdatedAt: normalizeLoadedUpdatedAt(
        formData.get(LOADED_UPDATED_AT_FIELD),
      ),
      overwrite: overwriteFromForm(formData),
    },
  );

  if (!result.ok) {
    if (result.kind === "empty") {
      return {
        ok: false,
        conflict: true,
        message: NEXT_STEP_CONFLICT_MESSAGE,
      };
    }
    return { ok: false, message: result.message };
  }

  return {
    ok: true,
    message: "Saved.",
    id: result.row.id,
    updatedAt: result.row.updated_at,
  };
}

export async function addNextStepFromForm(
  formData: FormData,
): Promise<NextStepState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return {
      ok: false,
      message: "Temporary login required to add a next step.",
    };
  }

  const caseId = submittedString(formData, "caseRowId");
  if (!isCaseId(caseId)) {
    return { ok: false, message: "Could not add: invalid case id." };
  }

  const typed = submittedString(formData, "name").trim();
  const picked = submittedString(formData, "storedName").trim();
  const name = typed || picked;
  if (name === "") {
    return { ok: false, message: "Name is stored text. Type or pick a name." };
  }

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  const existing = await findNextStepByName(client, caseId, name);
  if (existing.error) {
    return { ok: false, message: existing.error };
  }

  if (existing.row) {
    const result = await updateNextStepWithConcurrency(
      client,
      existing.row.id,
      { name },
      {
        loadedUpdatedAt: existing.row.updated_at,
        overwrite: overwriteFromForm(formData),
      },
    );
    if (!result.ok) {
      if (result.kind === "empty") {
        return {
          ok: false,
          conflict: true,
          message: NEXT_STEP_CONFLICT_MESSAGE,
        };
      }
      return { ok: false, message: result.message };
    }
    return {
      ok: true,
      message: "Updated the existing next step with that name.",
      id: result.row.id,
      updatedAt: result.row.updated_at,
    };
  }

  const inserted = await client
    .from("next_steps")
    .insert({ case_id: caseId, name })
    .select("*")
    .maybeSingle();

  if (inserted.error) {
    return { ok: false, message: inserted.error.message };
  }
  if (!inserted.data) {
    return { ok: false, message: "Could not add: next step was not saved." };
  }

  return {
    ok: true,
    message: "Added.",
    id: inserted.data.id,
    updatedAt: inserted.data.updated_at,
  };
}

/**
 * Insert public.next_steps rows for a new case.
 * Writes case_id + name only. Skips a name that already exists for the case.
 */
export async function insertNextStepRowsForCase(
  client: SupabaseClient<Database>,
  caseId: string,
  names: readonly string[],
): Promise<{ ok: true } | { ok: false; message: string }> {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const name = raw.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    unique.push(name);
  }
  if (unique.length === 0) return { ok: true };

  for (const name of unique) {
    const existing = await findNextStepByName(client, caseId, name);
    if (existing.error) return { ok: false, message: existing.error };
    if (existing.row) continue;

    const inserted = await client
      .from("next_steps")
      .insert({ case_id: caseId, name })
      .select("id")
      .maybeSingle();
    if (inserted.error) {
      return { ok: false, message: inserted.error.message };
    }
    if (!inserted.data) {
      return { ok: false, message: "Could not add: next step was not saved." };
    }
  }

  return { ok: true };
}
