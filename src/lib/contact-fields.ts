import type { Database } from "@/lib/database.types";

const CASE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isCaseUuid(id: string): boolean {
  return CASE_ID_RE.test(id);
}

export type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];

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

export function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
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
  if (!associatedCases || !isCaseUuid(caseId)) return false;
  const text = associatedCases.trim();
  if (text === caseId) return true;
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (parts.includes(caseId)) return true;
  return text.includes(caseId);
}
