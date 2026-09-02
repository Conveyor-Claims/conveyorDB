import { displayContactName } from "@/lib/contact-fields";

/** Airtable record id: `rec` + 14 alphanumeric. Never show these. */
const AIRTABLE_REC_RE = /^rec[a-zA-Z0-9]{14}$/;
const LOOSE_REC_RE = /^rec[a-zA-Z0-9]{6,}$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CASE_NUMBER_PREFIX_RE = /^C\s*-\s*(\d+)/i;

export function isAirtableRecId(value: string): boolean {
  return AIRTABLE_REC_RE.test(value.trim());
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/** Stored value is an Airtable rec id or a cabinet row uuid. */
export function isRecordRef(value: string): boolean {
  const text = value.trim();
  return isAirtableRecId(text) || isUuid(text);
}

export function splitStoredRefs(value: string): string[] {
  return value.split(/[,;]+/).map((part) => part.trim()).filter(Boolean);
}

function looksLikeRecToken(value: string): boolean {
  return LOOSE_REC_RE.test(value.trim());
}

export type RelatedNameMaps = {
  contacts: ReadonlyMap<string, string>;
  partners: ReadonlyMap<string, string>;
};

function addName(
  map: Map<string, string>,
  key: string | null | undefined,
  name: string,
): void {
  const id = key?.trim() ?? "";
  if (!id || !name) return;
  if (!map.has(id)) map.set(id, name);
}

export function contactNameMaps(
  rows: Array<{
    id: string;
    airtable_id: string | null;
    contact_id: string | null;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
  }>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    const name = displayContactName(row);
    if (!name) continue;
    addName(map, row.id, name);
    addName(map, row.airtable_id, name);
    addName(map, row.contact_id, name);
  }
  return map;
}

export function partnerNameMaps(
  rows: Array<{
    id: string;
    airtable_id: string | null;
    counsel_id: string | null;
    partner_name: string | null;
  }>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    const name = row.partner_name?.trim() ?? "";
    if (!name) continue;
    addName(map, row.id, name);
    addName(map, row.airtable_id, name);
    addName(map, row.counsel_id, name);
  }
  return map;
}

/**
 * Look up a stored case link against a cabinet name map.
 * Display names stay. Rec/uuid with no name → blank. Never returns rec….
 */
export function resolveRelatedName(
  stored: string | null | undefined,
  names: ReadonlyMap<string, string>,
): string {
  const text = stored?.trim() ?? "";
  if (!text) return "";
  if (looksLikeRecToken(text) || isUuid(text)) {
    return names.get(text)?.trim() ?? "";
  }

  const parts = splitStoredRefs(text);
  const hasRef = parts.some((part) => isRecordRef(part) || looksLikeRecToken(part));
  if (!hasRef) return text;

  return parts
    .map((part) => {
      if (isRecordRef(part) || looksLikeRecToken(part)) {
        return names.get(part)?.trim() ?? "";
      }
      return part;
    })
    .filter(Boolean)
    .join(", ");
}

/**
 * List Case Number is the locked computed number only (`C - 02439`).
 * Do not append the client name. Unparseable / rec / uuid → blank.
 */
export function displayCaseNumberOnly(
  stored: string | null | undefined,
): string {
  const text = stored?.trim() ?? "";
  if (!text) return "";
  if (looksLikeRecToken(text) || isUuid(text)) return "";
  const match = text.match(CASE_NUMBER_PREFIX_RE);
  if (!match) return "";
  return `C - ${match[1].padStart(5, "0")}`;
}

export type ListNameFields = {
  case_number: string | null;
  client_name: string | null;
  referred_firm: string | null;
};

/** Apply list display rules. Does not invent names. Does not write back. */
export function applyListRelatedNames<T extends ListNameFields>(
  row: T,
  maps: RelatedNameMaps,
): T {
  const clientName = resolveRelatedName(row.client_name, maps.contacts);
  const referredFirm = resolveRelatedName(row.referred_firm, maps.partners);
  const caseNumber = displayCaseNumberOnly(row.case_number);
  return {
    ...row,
    client_name: clientName === "" ? null : clientName,
    referred_firm: referredFirm === "" ? null : referredFirm,
    case_number: caseNumber === "" ? null : caseNumber,
  };
}

export function emptyRelatedNameMaps(): RelatedNameMaps {
  return { contacts: new Map(), partners: new Map() };
}

/** Last-line list display: never render a leftover rec… or uuid. */
export function hideRecordRefDisplay(value: string): string {
  const text = value.trim();
  if (!text) return "";
  if (looksLikeRecToken(text) || isUuid(text)) return "";
  const parts = splitStoredRefs(text);
  if (parts.some((part) => isRecordRef(part) || looksLikeRecToken(part))) {
    return parts
      .filter((part) => !isRecordRef(part) && !looksLikeRecToken(part))
      .join(", ");
  }
  return text;
}
