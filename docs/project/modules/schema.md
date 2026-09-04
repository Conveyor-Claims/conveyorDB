# Supabase schema and migrations

Repo SQL is a **copy of the empty schema already applied** on `conveyordb-testing` (`eskwbmtqtzqssbhyzjmv`). Do not apply these files to production. Do not invent columns. Typed source of truth for app code: `src/lib/database.types.ts`.

Backup schema on `conveyordb-backup` is applied separately. The cron job does not run SQL.

## Migration files

| File | Tables (do not invent extras) |
| --- | --- |
| `supabase/migrations/20260826043800_p11_empty_cabinets.sql` | `contacts`, `partners`, `cases` (374 cols from live applied SQL), `next_steps`, `files`, `field_map` |
| `supabase/migrations/20260826044808_p12_empty_high_tables.sql` | `referred_cases`, `invoices`, `payments`, `emails`, `client_folders`, `professional_partners`, `conveyor_users`, `claim_tasks`, `comments`, `users` |
| `supabase/migrations/20260831170000_p25_paralegal_case_grants.sql` | `role_permissions`, `case_view_grants` + RLS for paralegal SELECT |

Notes from the repo copy:

- Tables start empty. RLS is enabled. `airtable_id` is unique on data tables.
- File / attachment slots are omitted from `cases` and High tables; PDFs live in `files`.
- Formulas are nullable `text`. No `field_map` rows are inserted.

Folder intro: [`supabase/README.md`](../../../supabase/README.md).

## What the app treats as “cabinets” vs “High”

`src/lib/schema/tables.ts` groups live public tables and records **column counts from information_schema**, not guesses:

- P11 cabinets: `cases` 374, `contacts` 19, `partners` 34, `next_steps` 6, `files` 8, `field_map` 6.
- P12 High: listed above (used in UI: `comments` only).
- P25 grants: `role_permissions` 4, `case_view_grants` 4.
- Backup copies P11 + P12 + P25.

HTTP API exposes the five cabinets except `field_map`.

## Catalog (UI labels, not a second schema)

[`docs/catalog/fields.csv`](../../catalog/fields.csv) is the field catalog (C-01985 screen). Case page sections and All Cases column labels come from dest keys that **already exist** on `public.cases`. File catalog fields have no dest column; they become slot names on `public.files`.

`/health` probes P11 + P12 tables and the `case-files` bucket against the live project.

## Key files

| File | Role |
| --- | --- |
| `supabase/migrations/*.sql` | Repo copy of applied SQL |
| `supabase/README.md` | Do-not-apply warning |
| `src/lib/database.types.ts` | Generated / typed dest columns |
| `src/lib/schema/tables.ts` | Cabinet / High / backup lists |
| `src/lib/health.ts`, `app/health/page.tsx` | Live probe |
| `docs/catalog/fields.csv` | Catalog titles and types |
