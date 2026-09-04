# Backup cron

Replica of **public table rows** from primary `conveyordb-testing` into `conveyordb-backup`. Users never write to backup. Staff UI and `/api/{cabinet}` stay on primary.

Operational runbook (env names, curl): [`docs/backup.md`](../../backup.md).

## Responsibilities

- Run every 4 hours UTC (`vercel.json`: `0 */4 * * *` → `GET /api/cron/backup`).
- Also accept `POST` behind the same gate (manual trigger).
- Upsert primary rows by primary key, then delete backup rows whose keys are gone on primary.
- Fail if a required table is missing on either side (`missingTables`). Do not create tables. Do not invent SQL.
- Log table names, counts, duration, project refs. Never log row contents, JWTs, or env values.

## Auth

Authorized if:

- `Authorization: Bearer <CRON_SECRET>`, or
- Vercel Cron header `x-vercel-cron: 1` (or `true`)

Otherwise **401**. This is **not** the cabinet service-role key.

## What is copied

Insert order (parents before FK children) from `src/lib/backup/tables.ts`:

`contacts`, `partners`, `cases`, `field_map`, `referred_cases`, `invoices`, `payments`, `emails`, `client_folders`, `professional_partners`, `conveyor_users`, `claim_tasks`, `comments`, `users`, `role_permissions`, then `next_steps`, `files`, `case_view_grants`.

`public.files` rows (including `storage_path`) are copied. Objects in `case-files` are **not** copied (v1 follow-up).

## Inputs / outputs

| In | Out |
| --- | --- |
| Cron header or `CRON_SECRET` | JSON: `ok`, project refs, `durationMs`, per-table counts |
| Missing backup env | 503 + `missingEnv` |
| Missing table | 500 + `missingTables` (`primary.*` / `backup.*`) |

Env (names only, never values): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BACKUP_SUPABASE_URL`, `BACKUP_SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`. Do not point the public URL at backup.

## Key files

| File | Role |
| --- | --- |
| `vercel.json` | Cron schedule |
| `app/api/cron/backup/route.ts` | GET/POST, 300s max |
| `src/lib/backup/auth.ts` | Secret / cron header |
| `src/lib/backup/refresh.ts` | Copy algorithm |
| `src/lib/backup/tables.ts` | Insert / delete order |
| `src/lib/backup/env.ts`, `clients.ts` | Backup vs primary clients |
| `src/lib/backup/refresh.test.ts` | Unit tests |
