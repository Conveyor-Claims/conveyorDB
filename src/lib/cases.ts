import { cache } from "react";
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

const ALL_CASES_SELECT =
  "id, case_number, client_name, case_status, department, claim_state, date_of_loss, sol_deadline, referred_firm, resolutions_specialist, paralegal, next_steps, cid_due_date, pl_due_date, atty_due_date, euo_date, atty_client_appt, rs_due_date, next_client_comm_due_date, recent_client_comm_date";

export async function listCases(options?: {
  caseStatus?: string | readonly string[];
  dueDateColumn?: DueDateFilterKey;
}): Promise<AllCasesList> {
  const { client, missingEnv, usingServiceRole } = casesClient();

  if (!client) {
    return {
      rows: [],
      error: "Supabase client is not configured.",
      missingEnv,
      usingServiceRole: false,
    };
  }

  let query = client.from("cases").select(ALL_CASES_SELECT);

  if (options?.caseStatus != null) {
    const statuses =
      typeof options.caseStatus === "string"
        ? [options.caseStatus]
        : [...options.caseStatus];
    if (statuses.length === 1) {
      query = query.eq("case_status", statuses[0]);
    } else if (statuses.length > 1) {
      query = query.in("case_status", statuses);
    }
  }

  if (options?.dueDateColumn) {
    query = query
      .not(options.dueDateColumn, "is", null)
      .order(options.dueDateColumn, { ascending: true, nullsFirst: false })
      .order("case_number", { ascending: true });
  } else {
    query = query.order("case_number", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    return {
      rows: [],
      error: error.message,
      missingEnv,
      usingServiceRole,
    };
  }

  return {
    rows: data ?? [],
    error: null,
    missingEnv,
    usingServiceRole,
  };
}

export async function listAllCases(): Promise<AllCasesList> {
  return listCases();
}

export const getCaseById = cache(async (id: string): Promise<CaseById> => {
  const { client, missingEnv, usingServiceRole } = casesClient();

  if (!client) {
    return {
      row: null,
      error: "Supabase client is not configured.",
      missingEnv,
      usingServiceRole: false,
    };
  }

  if (!isCaseId(id)) {
    return {
      row: null,
      error: null,
      missingEnv,
      usingServiceRole,
    };
  }

  const { data, error } = await client
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return {
      row: null,
      error: error.message,
      missingEnv,
      usingServiceRole,
    };
  }

  return {
    row: data,
    error: null,
    missingEnv,
    usingServiceRole,
  };
});

/** Stored values only. Null/empty stay blank — no placeholders. */
export function displayCaseValue(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) {
    return value.length === 0 ? "" : value.map(String).join(", ");
  }
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}
