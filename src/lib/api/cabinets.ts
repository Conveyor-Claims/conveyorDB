import type { ApiTable } from "@/lib/api/update-columns";
import { P11_CABINETS } from "@/lib/schema/tables";

export const CABINET_SLUGS = [
  "cases",
  "contacts",
  "partners",
  "next-steps",
  "files",
] as const;

export type CabinetSlug = (typeof CABINET_SLUGS)[number];

/** P11 cabinets except field_map (out of scope). */
const API_TABLES = new Set(
  P11_CABINETS.map((table) => table.name).filter(
    (name): name is ApiTable => name !== "field_map",
  ),
);

const SLUG_TO_TABLE = {
  cases: "cases",
  contacts: "contacts",
  partners: "partners",
  "next-steps": "next_steps",
  files: "files",
} as const satisfies Record<CabinetSlug, ApiTable>;

export function resolveCabinet(slug: string): ApiTable | null {
  if (!(CABINET_SLUGS as readonly string[]).includes(slug)) return null;
  const table = SLUG_TO_TABLE[slug as CabinetSlug];
  return API_TABLES.has(table) ? table : null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}
