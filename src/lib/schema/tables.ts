import type { Database } from "@/lib/database.types";

export type PublicTableName = keyof Database["public"]["Tables"];

export type SchemaTable = {
  name: PublicTableName;
  columnCount: number;
};

/**
 * Live public tables on conveyordb-testing.
 * Column counts are from the existing schema (information_schema), not invented.
 */
export const P11_CABINETS: readonly SchemaTable[] = [
  { name: "cases", columnCount: 374 },
  { name: "contacts", columnCount: 19 },
  { name: "partners", columnCount: 34 },
  { name: "next_steps", columnCount: 6 },
  { name: "files", columnCount: 8 },
  { name: "field_map", columnCount: 6 },
] as const;

export const P12_HIGH_TABLES: readonly SchemaTable[] = [
  { name: "referred_cases", columnCount: 34 },
  { name: "invoices", columnCount: 14 },
  { name: "payments", columnCount: 11 },
  { name: "emails", columnCount: 8 },
  { name: "client_folders", columnCount: 7 },
  { name: "professional_partners", columnCount: 24 },
  { name: "conveyor_users", columnCount: 27 },
  { name: "claim_tasks", columnCount: 22 },
  { name: "comments", columnCount: 11 },
  { name: "users", columnCount: 18 },
] as const;

export const ALL_PUBLIC_TABLES: readonly SchemaTable[] = [
  ...P11_CABINETS,
  ...P12_HIGH_TABLES,
];

export const DEFAULT_STORAGE_BUCKET = "case-files";
