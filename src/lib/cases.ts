import { createAdminClient } from "@/lib/clients/admin";
import { createAnonServerClient } from "@/lib/clients/server";
import type { Database } from "@/lib/database.types";
import { missingEnvNames, readAppEnv } from "@/lib/env";

type CasesRow = Database["public"]["Tables"]["cases"]["Row"];

/**
 * Columns that exist on public.cases and are shown on All Cases.
 * Labels match docs/catalog/fields.csv (not invented).
 */
export const ALL_CASES_COLUMNS = [
  { key: "case_number", label: "Case Number" },
  { key: "client_name", label: "Client Name" },
  { key: "case_status", label: "Case Status" },
  { key: "department", label: "Department" },
  { key: "claim_state", label: "Claim State" },
  { key: "date_of_loss", label: "Date of Loss" },
  { key: "sol_deadline", label: "SOL Deadline" },
  { key: "referred_firm", label: "Referred Firm" },
  { key: "resolutions_specialist", label: "Resolutions Specialist" },
  { key: "paralegal", label: "Paralegal" },
] as const satisfies ReadonlyArray<{
  key: keyof CasesRow;
  label: string;
}>;

export type AllCasesColumnKey = (typeof ALL_CASES_COLUMNS)[number]["key"];

/**
 * Identity columns stay on screen while the rest of the wide list
 * scrolls horizontally. They are already the first two All Cases columns.
 */
export const FROZEN_ALL_CASES_COLUMN_KEYS = [
  "case_number",
  "client_name",
] as const satisfies ReadonlyArray<AllCasesColumnKey>;

export type FrozenAllCasesColumnKey =
  (typeof FROZEN_ALL_CASES_COLUMN_KEYS)[number];

export function isFrozenAllCasesColumn(
  key: string,
): key is FrozenAllCasesColumnKey {
  return (FROZEN_ALL_CASES_COLUMN_KEYS as readonly string[]).includes(key);
}

/**
 * Sticky-left slot for a list cell. `#` is always 0; then visible
 * Case Number / Client Name in list order. Other columns are not frozen.
 */
export function frozenAllCasesSlot(
  key: "row_number" | string,
  visibleKeys: readonly string[],
): number | null {
  if (key === "row_number") return 0;
  if (!isFrozenAllCasesColumn(key) || !visibleKeys.includes(key)) return null;
  return visibleKeys.filter(isFrozenAllCasesColumn).indexOf(key) + 1;
}

/**
 * Dest date columns used by P23 due-date boards.
 * Selected on the list query; not added to the default 10 All Cases columns.
 * sol_deadline is already one of those 10.
 */
export const DUE_DATE_SELECT_KEYS = [
  "cid_due_date",
  "pl_due_date",
  "atty_due_date",
  "euo_date",
  "atty_client_appt",
  "rs_due_date",
  "next_client_comm_due_date",
  "recent_client_comm_date",
] as const satisfies ReadonlyArray<keyof CasesRow>;

export type DueDateSelectKey = (typeof DUE_DATE_SELECT_KEYS)[number];

export type DueDateFilterKey = DueDateSelectKey | "sol_deadline";

/** Dropdown cells on All Cases that render as Airtable-like pills. */
export const ALL_CASES_PILL_KEYS = [
  "case_status",
  "department",
  "resolutions_specialist",
  "paralegal",
] as const satisfies ReadonlyArray<AllCasesColumnKey>;

export type AllCasesPillKey = (typeof ALL_CASES_PILL_KEYS)[number];

export function isAllCasesPillKey(key: string): key is AllCasesPillKey {
  return (ALL_CASES_PILL_KEYS as readonly string[]).includes(key);
}

export type AllCasesRow = Pick<
  CasesRow,
  "id" | AllCasesColumnKey | "next_steps" | DueDateSelectKey
>;

export type AllCasesList = {
  rows: AllCasesRow[];
  error: string | null;
  missingEnv: string[];
  usingServiceRole: boolean;
};

export type CaseById = {
  row: CasesRow | null;
  error: string | null;
  missingEnv: string[];
  usingServiceRole: boolean;
};

const CASE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isCaseId(id: string): boolean {
  return CASE_ID_RE.test(id);
}

export function casesClient() {
  const env = readAppEnv();
  const missingEnv = missingEnvNames(env);
  const admin = createAdminClient();
  const anon = createAnonServerClient();
  return {
    client: admin ?? anon,
    missingEnv,
    usingServiceRole: Boolean(admin),
  };
}

/** Stored values only. Null/empty stay blank — no placeholders. */
export function displayCaseValue(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) {
    return value.length === 0 ? "" : value.map(String).join(", ");
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}
