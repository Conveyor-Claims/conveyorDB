# HTTP API (cabinets)

Thin service-role door for Intake and Coworking. Existing dest columns only. Full contract: [`docs/api.md`](../../api.md).

## Responsibilities

- List, read, insert, and patch the five cabinets.
- Compute `case_number` / `autonum` on `POST /api/cases` (same path as staff create).
- Enforce case and next-step optimistic concurrency.
- Accept file bytes as `POST /api/files` multipart.
- Reject unknown keys (400). Ignore caller-supplied `case_number`.

`field_map` and P12 High tables are **not** cabinet routes. `/api/cron/backup` is a different door ([backup.md](backup.md)).

## Auth

Every cabinet route calls `authorizeApiRequest`. Required header:

`Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`

Missing or wrong token → **401**. Timing-safe compare. Cookie / temporary admin login is **not** enough. Do not log or return the key.

## Inputs / outputs

Base (production): `https://conveyor-db.vercel.app/api`

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| GET | `/api/{cabinet}` | — | JSON array. `?case_id=` on `next-steps` and `files` |
| GET | `/api/{cabinet}/{id}` | — | One row or 404 |
| POST | `/api/{cabinet}` | JSON dest columns | Inserted row (201). DB assigns `id` |
| POST | `/api/files` | multipart: `case_id`, `slot_name`, `file` | File row + Storage object, or **409** if slot filled |
| PATCH | `/api/{cabinet}/{id}` | JSON dest columns | Stored row |

Cabinets: `cases`, `contacts`, `partners`, `next-steps`, `files`.

### Case PATCH (If-Match / overwrite)

Optimistic lock on dest column `last_modified`. No version column.

- Send loaded `last_modified` in JSON, or as `If-Match`.
- Empty / null / omitted (and no `If-Match`) matches stored null (`IS NULL`).
- UPDATE is `id` + `last_modified`. **0 rows → 409** `{ "error": "Someone else saved this case.", "conflict": true }`.
- Success (including overwrite) sets `last_modified` to now (ISO) and `last_modified_by` to the stub `admin`.
- `"overwrite": true` skips the `last_modified` WHERE.

### Next Step PATCH

Same idea on `updated_at`. 0 rows → 409. `"overwrite": true` skips the match. Do not POST a second row with the same `name` for the same `case_id` (409).

### File slot 409

If that `case_id` + `slot_name` already has a `storage_path`, upload is **409** and the first `case-files` object stays. No unique on `(case_id, slot_name)`. Do not UPDATE `storage_path` on a filled row.

## First test (Natalie)

**PATCH only** the existing Natalie row. Lookup `case_number` `C - 02895 - Natalie Dubin`. Do not insert a second Natalie.

## Key files

| File | Role |
| --- | --- |
| `app/api/[cabinet]/route.ts` | GET list, POST insert |
| `app/api/[cabinet]/[id]/route.ts` | GET one, PATCH |
| `src/lib/api/auth.ts` | Bearer = service role |
| `src/lib/api/cabinets.ts` | Slug → table (`next-steps` → `next_steps`) |
| `src/lib/api/handlers.ts` | List / get / insert / patch |
| `src/lib/api/parse.ts` | Dest parsing; If-Match / overwrite |
| `src/lib/api/update-columns.ts` | Allowed dest keys per cabinet |
| `src/lib/api/http.ts` | JSON + Supabase error mapping |
| `src/lib/clients/admin.ts` | Service-role Supabase client |
