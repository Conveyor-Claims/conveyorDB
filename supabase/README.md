# Supabase schema (repo copy)

These migrations document the **empty** public schema already applied on **conveyordb-testing**. They are a repo copy only.

- Do **not** apply them to primary / production (`conveyordb-testing`).
- They **may** be applied once to the backup project (`conveyordb-backup`) if that public schema is empty. The 4-hour backup job does not run SQL; it fails if backup tables are missing. See [`docs/backup.md`](../docs/backup.md).
- Tables are empty. RLS is enabled. `airtable_id` is unique on data tables.
- File / attachment slots are omitted from `cases` and High tables; PDFs live in `files`.
- Formulas are nullable `text`. No `field_map` rows are inserted.

| File | Tables |
| --- | --- |
| `migrations/20260826043800_p11_empty_cabinets.sql` | `contacts`, `partners`, `cases` (374 cols from live applied SQL), `next_steps`, `files`, `field_map` |
| `migrations/20260826044808_p12_empty_high_tables.sql` | `referred_cases`, `invoices`, `payments`, `emails`, `client_folders`, `professional_partners`, `conveyor_users`, `claim_tasks`, `comments`, `users` |
| `migrations/20260831170000_p25_paralegal_case_grants.sql` | `role_permissions` (type-level toggles), `case_view_grants` (role/type + case_id). RLS: anon/authenticated SELECT granted cases only. Service-role bypasses. |
