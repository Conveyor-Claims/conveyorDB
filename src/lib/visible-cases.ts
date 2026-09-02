import { cache } from "react";
import { connection } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAnonServerClient } from "@/lib/clients/server";
import {
  casesClient,
  isCaseId,
  type AllCasesList,
  type AllCasesRow,
  type CaseById,
  type DueDateFilterKey,
} from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import { missingEnvNames, readAppEnv } from "@/lib/env";
import {
  applyListRelatedNames,
  contactNameMaps,
  emptyRelatedNameMaps,
  partnerNameMaps,
  type RelatedNameMaps,
} from "@/lib/related-names";
import { getSession, isParalegal } from "@/lib/session";

/**
 * Paralegal staff reads use the anon key so RLS hides ungranted cases.
 * Admin and the service-role API door keep the current bypass.
 * Lives in a server-only module so session/cookies never enter client lists.
 */
export async function visibleCasesClient() {
  if (isParalegal(await getSession())) {
    const env = readAppEnv();
    return {
      client: createAnonServerClient(),
      missingEnv: missingEnvNames(env),
      usingServiceRole: false,
    };
  }
  return casesClient();
}

const ALL_CASES_SELECT =
  "id, case_number, client_name, case_status, department, claim_state, date_of_loss, sol_deadline, referred_firm, resolutions_specialist, paralegal, next_steps, cid_due_date, pl_due_date, atty_due_date, euo_date, atty_client_appt, rs_due_date, next_client_comm_due_date, recent_client_comm_date";

const CONTACT_NAME_SELECT =
  "id, airtable_id, contact_id, full_name, first_name, last_name";
const PARTNER_NAME_SELECT = "id, airtable_id, counsel_id, partner_name";

async function loadRelatedNameMaps(
  client: SupabaseClient<Database>,
): Promise<RelatedNameMaps> {
  const [contacts, partners] = await Promise.all([
    client.from("contacts").select(CONTACT_NAME_SELECT),
    client.from("partners").select(PARTNER_NAME_SELECT),
  ]);

  if (contacts.error && partners.error) {
    return emptyRelatedNameMaps();
  }

  return {
    contacts: contactNameMaps(contacts.data ?? []),
    partners: partnerNameMaps(partners.data ?? []),
  };
}

function withListRelatedNames(
  rows: AllCasesRow[],
  maps: RelatedNameMaps,
): AllCasesRow[] {
  return rows.map((row) => applyListRelatedNames(row, maps));
}

export async function listCases(options?: {
  caseStatus?: string | readonly string[];
  dueDateColumn?: DueDateFilterKey;
}): Promise<AllCasesList> {
  await connection();
  const { client, missingEnv, usingServiceRole } = await visibleCasesClient();

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

  const [{ data, error }, maps] = await Promise.all([
    query,
    loadRelatedNameMaps(client),
  ]);

  if (error) {
    return {
      rows: [],
      error: error.message,
      missingEnv,
      usingServiceRole,
    };
  }

  return {
    rows: withListRelatedNames(data ?? [], maps),
    error: null,
    missingEnv,
    usingServiceRole,
  };
}

export async function listAllCases(): Promise<AllCasesList> {
  return listCases();
}

export const getCaseById = cache(async (id: string): Promise<CaseById> => {
  await connection();
  const { client, missingEnv, usingServiceRole } = await visibleCasesClient();

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
