import { cache } from "react";
import { casesClient, isCaseId } from "@/lib/cases";
import type { Database } from "@/lib/database.types";
import { getSession, isAdmin } from "@/lib/session";

export type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];

export type CaseContact = Pick<
  ContactRow,
  | "id"
  | "full_name"
  | "first_name"
  | "last_name"
  | "relationship_to_insured"
  | "primary_phone"
  | "email"
  | "associated_cases"
>;

export type ContactsForCase = {
  rows: CaseContact[];
  error: string | null;
};

export type AddPersonState = {
  ok: boolean;
  message: string;
  id?: string;
};

/** Catalog titles for dest columns shown on the case page list. */
export const CONTACT_LIST_LABELS = {
  name: "Full Name",
  relationship: "Relationship to Insured",
  phone: "Primary Phone",
  email: "Email",
} as const;

/**
 * Optional dest columns staff may fill on add-person.
 * No copied option lists exist for these, so the form is plain text.
 * qbo_customer_id / airtable_id / contact_id are never submitted.
 */
export const ADD_PERSON_OPTIONAL_FIELDS = [
  {
    key: "relationship_to_insured",
    label: "Relationship to Insured",
    inputType: "text",
  },
  { key: "policy_party_type", label: "Policy Party Type", inputType: "text" },
  { key: "email", label: "Email", inputType: "email" },
  { key: "primary_phone", label: "Primary Phone", inputType: "tel" },
  {
    key: "secondary_phone_number",
    label: "Secondary Phone Number",
    inputType: "tel",
  },
  {
    key: "preferred_contact_method",
    label: "Preferred Contact Method",
    inputType: "text",
  },
  {
    key: "best_time_to_contact",
    label: "Best Time to Contact",
    inputType: "text",
  },
  {
    key: "authorized_representative_name",
    label: "Authorized Representative Name",
    inputType: "text",
  },
  {
    key: "authorized_representative_title",
    label: "Authorized Representative Title",
    inputType: "text",
  },
] as const;

export type AddPersonOptionalKey =
  (typeof ADD_PERSON_OPTIONAL_FIELDS)[number]["key"];

const CONTACT_SELECT =
  "id, full_name, first_name, last_name, relationship_to_insured, primary_phone, email, associated_cases";

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function submittedString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : "";
}

/** Stored dest name: full_name, else first + last, else whichever part exists. */
export function displayContactName(row: {
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
}): string {
  const full = row.full_name?.trim() ?? "";
  if (full) return full;
  const first = row.first_name?.trim() ?? "";
  const last = row.last_name?.trim() ?? "";
  return [first, last].filter(Boolean).join(" ");
}

/**
 * `associated_cases` is text holding the case row uuid.
 * Exact match, or contains the uuid when values are appended.
 */
export function contactLinkedToCase(
  associatedCases: string | null,
  caseId: string,
): boolean {
  if (!associatedCases || !isCaseId(caseId)) return false;
  const text = associatedCases.trim();
  if (text === caseId) return true;
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (parts.includes(caseId)) return true;
  return text.includes(caseId);
}

export const listContactsForCase = cache(
  async (caseId: string): Promise<ContactsForCase> => {
    const { client } = casesClient();
    if (!client) {
      return { rows: [], error: "Supabase client is not configured." };
    }
    if (!isCaseId(caseId)) {
      return { rows: [], error: null };
    }

    const { data, error } = await client
      .from("contacts")
      .select(CONTACT_SELECT)
      .or(`associated_cases.eq.${caseId},associated_cases.ilike.%${caseId}%`)
      .order("created_at", { ascending: true });

    if (error) {
      return { rows: [], error: error.message };
    }

    const rows = (data ?? []).filter((row) =>
      contactLinkedToCase(row.associated_cases, caseId),
    );
    return { rows, error: null };
  },
);

export function personInsertFromForm(
  formData: FormData,
):
  | { ok: true; caseId: string; row: ContactInsert }
  | { ok: false; message: string } {
  const caseIdRaw = formData.get("caseRowId");
  const caseId = typeof caseIdRaw === "string" ? caseIdRaw : "";
  if (!isCaseId(caseId)) {
    return { ok: false, message: "Could not add person: invalid case id." };
  }

  const firstName = blankToNull(submittedString(formData, "first_name"));
  const lastName = blankToNull(submittedString(formData, "last_name"));
  let fullName = blankToNull(submittedString(formData, "full_name"));

  if (!fullName && firstName && lastName) {
    fullName = `${firstName} ${lastName}`;
  }

  if (!fullName && !(firstName && lastName)) {
    return {
      ok: false,
      message:
        "Could not add person: enter Full Name, or First Name and Last Name.",
    };
  }

  const optional: Partial<
    Record<AddPersonOptionalKey, string | null>
  > = {};
  for (const field of ADD_PERSON_OPTIONAL_FIELDS) {
    optional[field.key] = blankToNull(submittedString(formData, field.key));
  }

  const row: ContactInsert = {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    relationship_to_insured: optional.relationship_to_insured ?? null,
    policy_party_type: optional.policy_party_type ?? null,
    email: optional.email ?? null,
    primary_phone: optional.primary_phone ?? null,
    secondary_phone_number: optional.secondary_phone_number ?? null,
    preferred_contact_method: optional.preferred_contact_method ?? null,
    best_time_to_contact: optional.best_time_to_contact ?? null,
    authorized_representative_name:
      optional.authorized_representative_name ?? null,
    authorized_representative_title:
      optional.authorized_representative_title ?? null,
    associated_cases: caseId,
    airtable_id: null,
    qbo_customer_id: null,
    contact_id: null,
  };

  return { ok: true, caseId, row };
}

export async function addPersonFromForm(
  formData: FormData,
): Promise<AddPersonState> {
  const session = await getSession();
  if (!isAdmin(session)) {
    return {
      ok: false,
      message: "Temporary login required to add a person.",
    };
  }

  const parsed = personInsertFromForm(formData);
  if (!parsed.ok) return parsed;

  const { client } = casesClient();
  if (!client) {
    return { ok: false, message: "Supabase client is not configured." };
  }

  const { data, error } = await client
    .from("contacts")
    .insert(parsed.row)
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }
  if (!data) {
    return { ok: false, message: "Could not add person: contact was not saved." };
  }

  return { ok: true, message: "Person added.", id: data.id };
}
