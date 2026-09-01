import type { PublicTableName } from "@/lib/schema/tables";
import { BACKUP_PUBLIC_TABLES } from "@/lib/schema/tables";

export type BackupTableName = (typeof BACKUP_PUBLIC_TABLES)[number]["name"];

export type BackupTableSpec = {
  name: BackupTableName;
  primaryKey: string;
};

/**
 * Insert parents before children. Live FKs:
 * next_steps.case_id → cases.id
 * files.case_id → cases.id
 * case_view_grants.case_id → cases.id
 * case_view_grants.role_type → role_permissions.role_type
 */
export const BACKUP_INSERT_ORDER: readonly BackupTableSpec[] = [
  { name: "contacts", primaryKey: "id" },
  { name: "partners", primaryKey: "id" },
  { name: "cases", primaryKey: "id" },
  { name: "field_map", primaryKey: "airtable_field_id" },
  { name: "referred_cases", primaryKey: "id" },
  { name: "invoices", primaryKey: "id" },
  { name: "payments", primaryKey: "id" },
  { name: "emails", primaryKey: "id" },
  { name: "client_folders", primaryKey: "id" },
  { name: "professional_partners", primaryKey: "id" },
  { name: "conveyor_users", primaryKey: "id" },
  { name: "claim_tasks", primaryKey: "id" },
  { name: "comments", primaryKey: "id" },
  { name: "users", primaryKey: "id" },
  { name: "role_permissions", primaryKey: "role_type" },
  { name: "next_steps", primaryKey: "id" },
  { name: "files", primaryKey: "id" },
  { name: "case_view_grants", primaryKey: "id" },
] as const;

export const BACKUP_DELETE_ORDER: readonly BackupTableSpec[] = [
  ...BACKUP_INSERT_ORDER,
].reverse();

const BACKUP_NAMES = new Set<PublicTableName>(
  BACKUP_PUBLIC_TABLES.map((table) => table.name),
);

export function isBackupTableName(name: string): name is BackupTableName {
  return BACKUP_NAMES.has(name as PublicTableName);
}
