import { casesClient } from "@/lib/cases";
import { withComputedCaseNumber } from "@/lib/case-number";
import type { Database } from "@/lib/database.types";
import { CASE_PIPELINES } from "@/lib/pipelines";
import { getSession, isAdmin } from "@/lib/session";

type CasesInsert = Database["public"]["Tables"]["cases"]["Insert"];

/** Stored dest option. New cases is the queue name for Referral. Do not invent New. */
const REFERRAL_STATUS = CASE_PIPELINES["new-cases"].caseStatus;

export type CreateCaseState = {
  ok: boolean;
  message: string;
  id?: string;
  case_number?: string | null;
};

function submittedString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function caseInsertFromForm(
  formData: FormData,
): { ok: true; row: CasesInsert } | { ok: false; message: string } {
  const clientName = blankToNull(submittedString(formData, "client_name"));
  if (!clientName) {
    return {
      ok: false,
      message: "Could not create case: enter Client Name.",
    };
  }

  const row: CasesInsert = {
    client_name: clientName,
    case_status: REFERRAL_STATUS,
    airtable_id: null,
  };

  return { ok: true, row };
}

export async function createCaseFromForm(
  formData: FormData,
): Promise<CreateCaseState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return {
      ok: false,
      message: "Temporary login required to create a case.",
    };
  }

  const parsed = caseInsertFromForm(formData);
  if (!parsed.ok) return parsed;

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  const assigned = await withComputedCaseNumber(client, parsed.row);
  if (!assigned.ok) return assigned;

  const { data, error } = await client
    .from("cases")
    .insert(assigned.patch)
    .select("id, case_number")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Could not create case: row was not saved." };
  }

  return {
    ok: true,
    message: "Case created.",
    id: data.id,
    case_number: data.case_number,
  };
}
