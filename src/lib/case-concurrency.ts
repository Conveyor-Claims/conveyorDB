import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type CasesUpdate = Database["public"]["Tables"]["cases"]["Update"];
type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

/** Temporary admin stub. Same value as comments (`admin`). Do not invent a person name. */
export const CASE_SAVE_AUTHOR = "admin";

export const CASE_CONFLICT_MESSAGE = "Someone else saved this case.";

/** Form field. Empty string means the loaded last_modified was null. */
export const LOADED_LAST_MODIFIED_FIELD = "loadedLastModified";

export const OVERWRITE_FIELD = "overwrite";

export function normalizeLoadedLastModified(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  return value === "" ? null : value;
}

export function parseIfMatch(header: string | null): string | null {
  if (!header) return null;
  let value = header.trim();
  if (value === "" || value === "*") return null;
  if (value.startsWith("W/")) value = value.slice(2).trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  return value === "" ? null : value;
}

export function stampCaseSave(patch: CasesUpdate): CasesUpdate {
  const now = new Date().toISOString();
  return {
    ...patch,
    last_modified: now,
    last_modified_by: CASE_SAVE_AUTHOR,
  };
}

export type CaseUpdateResult =
  | { ok: true; row: CasesRow }
  | { ok: false; kind: "empty"; message: string }
  | { ok: false; kind: "error"; message: string };

export async function updateCaseWithConcurrency(
  client: SupabaseClient<Database>,
  id: string,
  patch: CasesUpdate,
  options: { loadedLastModified: string | null; overwrite: boolean },
): Promise<CaseUpdateResult> {
  const stamped = stampCaseSave(patch);
  let query = client.from("cases").update(stamped).eq("id", id);
  if (!options.overwrite) {
    query =
      options.loadedLastModified === null
        ? query.is("last_modified", null)
        : query.eq("last_modified", options.loadedLastModified);
  }

  const { data, error } = await query.select("*").maybeSingle();

  if (error) {
    return { ok: false, kind: "error", message: error.message };
  }
  if (!data) {
    return { ok: false, kind: "empty", message: CASE_CONFLICT_MESSAGE };
  }
  return { ok: true, row: data };
}
