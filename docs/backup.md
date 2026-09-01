# Backup replica (conveyordb-backup)

Every 4 hours the production Next.js app copies live **public** rows from primary `conveyordb-testing` into the backup Supabase project. Backup is a replica. Users never write to it. Staff pages and `/api/{cabinet}` stay on primary.

## Vercel env (exact names)

Set these on Vercel project `conveyor-db` (Production). Do not commit values.

| Name | Role |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Primary (already set). `https://eskwbmtqtzqssbhyzjmv.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Primary service role (already set). Server-only. |
| `BACKUP_SUPABASE_URL` | Backup project URL: `https://tjndmefytlesqlbfqbvk.supabase.co` |
| `BACKUP_SUPABASE_SERVICE_ROLE_KEY` | Backup service role. Server-only. |
| `CRON_SECRET` | Shared secret. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Same header for a manual trigger. |

Do not add `NEXT_PUBLIC_` backup keys. Do not point `NEXT_PUBLIC_SUPABASE_URL` at backup.

## Schedule

`vercel.json` cron: `0 */4 * * *` (UTC) → `GET /api/cron/backup`.

The route also accepts `POST /api/cron/backup` behind the same gate (manual trigger).

Authorized if:

- `Authorization: Bearer <CRON_SECRET>`, or
- Vercel Cron header `x-vercel-cron: 1`

Unauthenticated calls are `401`.

## One-time schema on backup

The job does **not** run SQL migrations. It fails clearly if a required public table is missing (`backup.<table>` in `missingTables`).

conveyordb-backup (`tjndmefytlesqlbfqbvk`) already has the public tables from this repo. If a new backup project is empty, apply these files **in order** in the Supabase SQL editor or via Supabase MCP (`apply_migration` / `execute_sql`). Do **not** apply them to primary.

1. `supabase/migrations/20260826043800_p11_empty_cabinets.sql`
2. `supabase/migrations/20260826044808_p12_empty_high_tables.sql`
3. `supabase/migrations/20260831170000_p25_paralegal_case_grants.sql`

## What is copied

All public application tables, including empty High tables and P25 grant tables:

`contacts`, `partners`, `cases`, `field_map`, `referred_cases`, `invoices`, `payments`, `emails`, `client_folders`, `professional_partners`, `conveyor_users`, `claim_tasks`, `comments`, `users`, `role_permissions`, then FK children `next_steps`, `files`, `case_view_grants`.

Each run upserts primary rows by primary key, then deletes backup rows whose keys are no longer on primary. A second run refreshes; it does not duplicate.

## Storage / PDFs (follow-up)

`public.files` rows (including `storage_path`) are copied. Objects in the private `case-files` bucket are **not** copied in v1.

## Logs

Success and failure logs include table names, row counts, duration, and project refs. They never include row contents, JWTs, or env values.

## Manual trigger

```bash
curl -X POST "https://conveyor-db.vercel.app/api/cron/backup" \
  -H "Authorization: Bearer $CRON_SECRET"
```
