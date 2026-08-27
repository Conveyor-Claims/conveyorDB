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

/** Dropdown cells on All Cases that render as Airtable-like pills. */
export const ALL_CASES_PILL_KEYS = [
  "case_status",
  "department",
  "claim_state",
  "resolutions_specialist",
  "paralegal",
] as const satisfies ReadonlyArray<AllCasesColumnKey>;

export type AllCasesPillKey = (typeof ALL_CASES_PILL_KEYS)[number];

export function isAllCasesPillKey(
  key: AllCasesColumnKey,
): key is AllCasesPillKey {
  return (ALL_CASES_PILL_KEYS as readonly string[]).includes(key);
}

export type AllCasesRow = Pick<CasesRow, "id" | AllCasesColumnKey>;

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

function casesClient() {
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

export async function listAllCases(): Promise<AllCasesList> {
  const { client, missingEnv, usingServiceRole } = casesClient();

  if (!client) {
    return {
      rows: [],
      error: "Supabase client is not configured.",
      missingEnv,
      usingServiceRole: false,
    };
  }

  const { data, error } = await client
    .from("cases")
    .select(
      "id, case_number, client_name, case_status, department, claim_state, date_of_loss, sol_deadline, referred_firm, resolutions_specialist, paralegal",
    )
    .order("case_number", { ascending: true });

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
