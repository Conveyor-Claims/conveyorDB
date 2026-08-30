import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type AdminClient = SupabaseClient<Database>;
type NextStepsUpdate = Database["public"]["Tables"]["next_steps"]["Update"];
export type NextStepRow = Database["public"]["Tables"]["next_steps"]["Row"];

export const NEXT_STEP_CONFLICT_MESSAGE = "Someone else saved this next step.";

export const LOADED_UPDATED_AT_FIELD = "loadedUpdatedAt";

export type NextStepState = {
  ok: boolean;
  message: string;
  conflict?: boolean;
  updatedAt?: string;
  id?: string;
};

export function normalizeLoadedUpdatedAt(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  return value === "" ? null : value;
}

export function stampNextStepSave(patch: NextStepsUpdate): NextStepsUpdate {
  return {
    ...patch,
    updated_at: new Date().toISOString(),
  };
}

export type NextStepUpdateResult =
  | { ok: true; row: NextStepRow }
  | { ok: false; kind: "empty"; message: string }
  | { ok: false; kind: "error"; message: string }
  | { ok: false; kind: "duplicate"; message: string };

export async function findNextStepByName(
  client: AdminClient,
  caseId: string,
  name: string,
  exceptId?: string,
): Promise<{ row: NextStepRow | null; error: string | null }> {
  let query = client
    .from("next_steps")
    .select("*")
    .eq("case_id", caseId)
    .eq("name", name);

  if (exceptId) {
    query = query.neq("id", exceptId);
  }

  const { data, error } = await query
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    return { row: null, error: error.message };
  }
  return { row: data ?? null, error: null };
}

export async function updateNextStepWithConcurrency(
  client: AdminClient,
  id: string,
  patch: NextStepsUpdate,
  options: { loadedUpdatedAt: string | null; overwrite: boolean },
): Promise<NextStepUpdateResult> {
  const stamped = stampNextStepSave(patch);
  let query = client.from("next_steps").update(stamped).eq("id", id);
  if (!options.overwrite) {
    query =
      options.loadedUpdatedAt === null
        ? query.is("updated_at", null)
        : query.eq("updated_at", options.loadedUpdatedAt);
  }

  const { data, error } = await query.select("*").maybeSingle();

  if (error) {
    return { ok: false, kind: "error", message: error.message };
  }
  if (!data) {
    return { ok: false, kind: "empty", message: NEXT_STEP_CONFLICT_MESSAGE };
  }
  return { ok: true, row: data };
}

export function storedNextStepNames(
  rows: NextStepRow[],
  caseDestNames: string[] | null,
): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const name = row.name?.trim() ?? "";
    if (!name || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  for (const raw of caseDestNames ?? []) {
    const name = raw.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names;
}
