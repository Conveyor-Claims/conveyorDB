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

export type AllCasesRow = Pick<CasesRow, "id" | AllCasesColumnKey>;

export type AllCasesList = {
  rows: AllCasesRow[];
  error: string | null;
  missingEnv: string[];
  usingServiceRole: boolean;
};

export async function listAllCases(): Promise<AllCasesList> {
  const env = readAppEnv();
  const missingEnv = missingEnvNames(env);
  const admin = createAdminClient();
  const anon = createAnonServerClient();
  const client = admin ?? anon;

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
      usingServiceRole: Boolean(admin),
    };
  }

  return {
    rows: data ?? [],
    error: null,
    missingEnv,
    usingServiceRole: Boolean(admin),
  };
}

/** Stored values only. Null/empty stay blank — no placeholders. */
export function displayCaseValue(
  value: AllCasesRow[AllCasesColumnKey],
): string {
  if (value == null) return "";
  return value;
}
