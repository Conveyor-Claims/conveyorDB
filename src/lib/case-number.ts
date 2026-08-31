import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type CasesInsert = Database["public"]["Tables"]["cases"]["Insert"];

/**
 * ConveyorDB-owned case_number.
 * Live stored example (do not clone): C-02895 is `C - 02895 - Natalie Dubin`.
 * Format: `C - {autonum zero-padded to 5} - {name}`.
 * Name is the client / display name supplied on insert.
 */
export function formatCaseNumber(autonum: number, name: string): string {
  const padded = String(autonum).padStart(5, "0");
  return `C - ${padded} - ${name.trim()}`;
}

/** Next autonum is max(existing autonum)+1. Empty / all-null starts at 1. */
export function nextAutonum(maxExisting: number | null | undefined): number {
  if (typeof maxExisting !== "number" || !Number.isFinite(maxExisting)) {
    return 1;
  }
  return Math.trunc(maxExisting) + 1;
}

export function displayNameForCaseNumber(clientName: unknown): string {
  return typeof clientName === "string" ? clientName.trim() : "";
}

export async function maxStoredAutonum(
  client: SupabaseClient<Database>,
): Promise<
  { ok: true; max: number | null } | { ok: false; message: string }
> {
  const { data, error } = await client
    .from("cases")
    .select("autonum")
    .not("autonum", "is", null)
    .order("autonum", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { ok: false, message: error.message };

  const raw = data?.autonum;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return { ok: true, max: null };
  }
  return { ok: true, max: raw };
}

export async function computedCaseNumberFields(
  client: SupabaseClient<Database>,
  clientName: unknown,
): Promise<
  | { ok: true; autonum: number; case_number: string }
  | { ok: false; message: string }
> {
  const max = await maxStoredAutonum(client);
  if (!max.ok) return max;
  const autonum = nextAutonum(max.max);
  return {
    ok: true,
    autonum,
    case_number: formatCaseNumber(
      autonum,
      displayNameForCaseNumber(clientName),
    ),
  };
}

/**
 * Shared insert assigner for staff create and POST /api/cases.
 * Strips any caller-supplied case_number / autonum and writes computed values.
 */
export async function withComputedCaseNumber<T extends CasesInsert>(
  client: SupabaseClient<Database>,
  patch: T,
): Promise<{ ok: true; patch: T } | { ok: false; message: string }> {
  const computed = await computedCaseNumberFields(client, patch.client_name);
  if (!computed.ok) return computed;
  return {
    ok: true,
    patch: {
      ...patch,
      autonum: computed.autonum,
      case_number: computed.case_number,
    },
  };
}
