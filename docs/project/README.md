# ConveyorDB

ConveyorDB is Conveyor Claims’ in-house replacement for Airtable. Staff work cases in a Next.js app on Vercel (`conveyor-db` / [conveyor-db.vercel.app](https://conveyor-db.vercel.app)). Sister apps (Intake, Coworking) read and write the same rows through a service-role HTTP API.

This page is the one-page map of the **current** repo. It does not invent screens, tables, or columns. Deeper pages live under [modules/](modules/README.md). The picture is in [architecture.md](architecture.md).

## What it stores (five cabinets)

P11 cabinets are the product surface. Each is a `public` table on Supabase project `conveyordb-testing`:

| Cabinet | Table | What it is |
| --- | --- | --- |
| Case | `public.cases` | One claim file. ~374 dest columns from the live schema. |
| Contact | `public.contacts` | People. Linked to a case by `associated_cases` (case uuid text). |
| Partner | `public.partners` | Firms / counsel. Used to resolve Referred Firm names on lists. |
| Next Step | `public.next_steps` | Named steps on a case (`case_id` + `name`). |
| File | `public.files` | One slot row per upload. Bytes live in the private `case-files` bucket. |

There is also a `field_map` table (Airtable field ids). It is **not** on the HTTP API.

P12 “High” tables exist in the schema (`comments`, `invoices`, `payments`, and others). Staff UI today uses **`comments` only**. The rest have no staff screens.

P25 tables (`role_permissions`, `case_view_grants`) control which cases a temporary paralegal may see.

## Two doors into the same database

```
Staff browser  --cookie stub-->  Staff pages  --Supabase client-->  primary DB
Intake / Coworking  --Bearer service role-->  /api/{cabinet}  --admin client-->  primary DB
```

- **Staff UI** — temporary login cookie (`admin` or `paralegal`). No passwords. Cookie login is **not** enough for `/api`.
- **HTTP API** — every `/api/{cabinet}` call needs `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`. Contract: [`docs/api.md`](../api.md).

Staff pages and `/api/{cabinet}` always use the **primary** project. Backup is a replica (see below).

## How work gets into the database (validated against this repo)

Intended story: someone submits intake (or staff types a case) and ConveyorDB stores it.

**What this repo actually does:**

| Path | What exists | What does not |
| --- | --- | --- |
| Staff create | `/cases/new` — Client Name (required), optional Next Steps. Status is stored `Referral`. Case Number is computed. | No Airtable write. Hidden from the paralegal stub. |
| Staff edit | `/cases/[id]` — dest fields, people, comments, file slots, next-step claim | No live collab. Two editors use `last_modified`. |
| Intake / Coworking | `GET`/`POST`/`PATCH` `/api/cases`, `/api/contacts`, `/api/partners`, `/api/next-steps`, `/api/files` | **No Intake form, no `intake_submissions` table, no webhook** in this repo. Intake is a sister app. It must call `/api`. |
| Airtable copy | Dry-run scripts under `scripts/copy/` (read maps, print what a copy would do) | Scripts **never write**. There is no in-app Airtable sync. |

If a walkthrough says “manual submission + intake inputs → store in ConveyorDB,” the accurate wiring today is: Intake keeps its own submissions until a caller **PATCHes or POSTs** a cabinet row here. Staff can also create and edit rows directly.

## Testing constraint (Natalie C-02895)

Intake’s first write test is **PATCH only** on the existing Natalie row.

- Look up stored `case_number` **`C - 02895 - Natalie Dubin`** (`GET /api/cases`), or use its uuid.
- Do **not** `POST` a second Natalie / second test case.
- Omit `case_number` on writes. ConveyorDB owns it. A supplied value is ignored.
- Send the loaded `last_modified` (JSON or `If-Match`). On 409, reload or send `"overwrite": true`.

## Copy-last (as-is) rule

Dest columns keep the **last stored value as-is**. Nothing in this repo invents a dollar, court name, option, or default.

- Staff and `/api` write only existing dest keys. Unknown keys are 400. Empty string / empty array becomes `null`. Blank stays blank.
- Airtable copy scripts (`scripts/copy/`) copy the current Airtable value into the mapped dest column. Formulas and file/attachment fields are skipped. Default mode is dry-run; they do not write.
- Case Number format is `C - {autonum zero-padded to 5} - {name}`. Live example (do not clone): `C - 02895 - Natalie Dubin`.

## Backup (high level)

Every 4 hours (UTC `0 */4 * * *`) Vercel Cron hits `GET /api/cron/backup`. The job copies **public table rows** from primary into project `conveyordb-backup`. Users never write to backup. `case-files` Storage objects are **not** copied yet (`public.files` rows are). Gate is `Authorization: Bearer <CRON_SECRET>` or the Vercel Cron header. Details: [modules/backup.md](modules/backup.md) and [`docs/backup.md`](../backup.md).

## Staff UI that exists

| Route | Role |
| --- | --- |
| `/` | Signed-in: All Cases. Signed-out: login landing. |
| `/login` | Temporary admin and paralegal stubs. No passwords. |
| `/cases` | All Cases list (`public.cases`). Grouped by Referred Firm. |
| `/cases/new` | Create case (temp admin). |
| `/cases/[id]` | 42-section case page (catalog C-01985 dest fields). |
| `/new-cases` `/referrals` `/pre-lit` `/litigation` `/non-responsive` `/appraisal` `/appraisal-lit` `/re-inspection` `/settled` `/settled-paid` `/closed` | Same list, filtered by stored `case_status`. |
| `/boards/{slug}` | Due-date boards (non-null dest date, ascending). Appraisal Client is skipped (no dest column). |
| `/permissions` | Admin: toggle paralegal viewing; grant/revoke cases. |
| `/health` | Probe live P11 + P12 tables and `case-files`. |
| `/preferences` | Stub. Nothing stored. |

There is **no** staff list page for Contacts, Partners, Next Steps, or Files as cabinets. Those appear on the case page and/or `/api`.

## Module index

| Module | Responsibility |
| --- | --- |
| [Cases UI](modules/cases.md) | Lists, create, case page, pipelines, due-date boards |
| [HTTP API](modules/http-api.md) | Service-role cabinet door for Intake / Coworking |
| [Auth and permissions](modules/auth-permissions.md) | Cookie stubs, paralegal grants, API Bearer |
| [Files](modules/files.md) | Slot uploads, 409 if filled, `case-files` bucket |
| [Next steps](modules/next-steps.md) | Cabinet rows + case `next_steps` array |
| [Contacts](modules/contacts.md) | People on a case; Contact cabinet |
| [Comments](modules/comments.md) | Case chat rail on `public.comments` |
| [Schema](modules/schema.md) | Migrations, types, catalog — point to files |
| [Backup](modules/backup.md) | 4-hour replica job |
| [Staff chrome](modules/staff-chrome.md) | Shell, nav, Airtable-like pills |
| [Copy scripts](modules/copy.md) | Dry-run Airtable → dest maps |

## Hard rules (do not drift)

- Do not invent schema, dollar amounts, or court names.
- Do not apply `supabase/migrations/` to production (repo copy of already-applied SQL).
- Never commit secrets. Cookie login ≠ API auth.
- Do not add a unique constraint on `files(case_id, slot_name)`.
- Do not insert a second `next_steps` row with the same `name` for the same case.
