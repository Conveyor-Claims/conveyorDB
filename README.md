# ConveyorDB

In-house Airtable replacement for Conveyor Claims.

P11: empty five cabinets (Case, Contact, Partner, Next Step, File).

## App

Next.js App Router (TypeScript) for Vercel project `conveyor-db`. It reads the live empty schema on Supabase project `conveyordb-testing` (`eskwbmtqtzqssbhyzjmv`). Do not invent schema, dollar amounts, or court names. Blanks stay blank.

The field catalog is unchanged at `docs/catalog/fields.csv`.

### HTTP API

Intake and Coworking read and write the five cabinets through `/api` (`docs/api.md`). Every `/api/*` route requires `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`. Cookie / temporary admin login is not enough. Intake's first test is **PATCH** the existing Natalie row **C-02895** only (look up stored `case_number` `C - 02895 - Natalie Dubin`, or its uuid). Do not insert a second Natalie. `POST /api/cases` computes `case_number` / `autonum` on insert (same path as staff create). Callers omit `case_number` on writes; a supplied value is ignored. Case PATCH sends the loaded `last_modified` (JSON or `If-Match`); optional `"overwrite": true` after a 409. File upload is `POST /api/files` (multipart) with caller `slot_name`; a filled slot is 409 and the first `case-files` object stays. Next Step claim is `PATCH /api/next-steps/{id}` with the loaded `updated_at` (JSON or `If-Match`); 0 rows is 409, `"overwrite": true` skips the match. Do not insert a second `next_steps` row with the same `name` for the same case.

### Environment

Copy `.env.example` to `.env.local` (never commit secrets):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=case-files
BACKUP_SUPABASE_URL=
BACKUP_SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

Set the same names on the Vercel project. `SUPABASE_SERVICE_ROLE_KEY` is server-only. The private Storage bucket is `case-files`.

Backup replica (every 4 hours, UTC `0 */4 * * *`): `GET`/`POST` `/api/cron/backup` copies public tables from primary into conveyordb-backup. Gate with `Authorization: Bearer <CRON_SECRET>` or the Vercel Cron header. Staff UI and `/api/{cabinet}` stay on primary. See [`docs/backup.md`](docs/backup.md).

### Scripts

```bash
npm install
npm run dev
```

- `/` All Cases after login (same list as `/cases`). Signed-out home is the temporary login landing, not a pipeline chip grid.
- `/cases` All Cases list from `public.cases` (empty lists show one line, not an empty table). Grouped by Referred Firm. Toolbar search: case number or client name (resolved display name). Filters: firm, status, next step, assigned. Missing routes and missing cases keep staff chrome and a Back to All Cases link. List and case loading use a skeleton.
- `/cases/new` staff create-case form (temp admin only). Client Name only. Case Number is computed and locked (`C - {autonum zero-padded to 5} - {name}`). Case Status is stored Referral so `/new-cases` lists it. No Airtable write. Hidden from the paralegal stub.
- `/new-cases` `/referrals` `/pre-lit` `/litigation` — same list filtered to stored `case_status` Referral (New cases is the queue name for that status; `/referrals` stays), Pre-Litigation, Litigation.
- `/non-responsive` `/appraisal` `/appraisal-lit` `/re-inspection` `/settled` `/settled-paid` `/closed` — same list filtered to stored `case_status` Non-Responsive, Appraisal, Appraisal - Lit, Re-Inspection, Settled, Settled - Paid, and Closed No Service or Closed - New Claim. Settled is exact `Settled` only (other Settled * variants stay on All Cases). There is no dest value named Closed.
- Due-date boards (same All Cases chrome; filter/sort by that dest date, non-null, ascending, blanks last):
  - `/boards/cid` CID — `cid_due_date`
  - `/boards/pl` PL — `pl_due_date`
  - `/boards/litigation` Litigation due — `atty_due_date` (not the `/litigation` status pipeline)
  - `/boards/euo` EUO — `euo_date`
  - `/boards/atty-client-appt` Atty Client Appt — `atty_client_appt`
  - `/boards/rs` RS — `rs_due_date`
  - `/boards/client-comm` Client Comm — `next_client_comm_due_date` (also shows stored `recent_client_comm_date`)
  - `/boards/sol` SOL — `sol_deadline`
  - Appraisal Client is skipped (no dest column: `appraisal_client_date` / `appraisal_client_due_date` do not exist). Boards without a dest column are hidden from the sidebar and skipped at `/boards/[slug]` so they do not 404.
- `/cases/[id]` 42-section case page from stored `public.cases` fields (C-01985 catalog). Stored dest fields are editable (P19). File slots are the on-screen catalog file fields, stored on `public.files` (`slot_name` is the catalog field name; caller sends it). Upload uses the same rules as `POST /api/files`: private `case-files` bucket, refuse if that slot already has a `storage_path`, never overwrite or delete the first object, no unique on `(case_id, slot_name)`. Next Step claim lists `public.next_steps` for the case. Temp admin can add or update a stored name (type or pick a name already on the case — do not invent names). Claim/update is `UPDATE … WHERE id = ? AND updated_at = <loaded>`; 0 rows is a conflict — someone else saved — with **Reload** or **Overwrite** (overwrite skips the `updated_at` match). Same idea as case `last_modified`. Do not insert a second next step with the same `name` for the same case. No owner column. Case Number stays locked. Blank fields stay blank. Two-editor save compares `last_modified` (no version column, no live collab). A stale save is a conflict — someone else saved — with **Reload** (discard local) or **Overwrite** (save anyway). On success, `last_modified` is now ISO and `last_modified_by` is the temporary admin stub (`admin`). Same check on `PATCH /api/cases/{id}` (`docs/api.md`). Case comments / case chat is a right rail on `public.comments` (`case` = case row uuid). Oldest first. Author is the temporary admin stub (`admin`). `@tokens` from the body are stored on `mentioned_users` as comma-separated text. No users join, no email, no Airtable dual-write. Add a person: staff (temp admin session) inserts a `public.contacts` row with `associated_cases` set to the case row uuid (text, not an Airtable rec id). The case page lists people linked that way (Full Name, Relationship to Insured, Primary Phone, Email). Required: Full Name, or First Name and Last Name (blank Full Name is filled from those two stored names). Empty optional dest fields write null. `qbo_customer_id`, `airtable_id`, and `contact_id` stay null. No join table, no copied relationship/party-type option lists, no Airtable dual-write.
- `/login` two temporary login stubs (admin and paralegal). How-to is on that page. No passwords.
- `/permissions` admin-only. Toggle Paralegal viewing and grant/revoke which Managed Cases that type can view. Per case, not by firm.
- `/health` lists P11 cabinets and P12 High tables and probes the live schema

P21 look-alike (existing dest columns and catalog titles only):

- List pills on All Cases and the three pipeline pages use the live Airtable tokens already in `src/lib/airtable-choice-colors.ts` and `src/lib/select-options.ts` for Case Status, Department, Claim State, Resolutions Specialist, Paralegal, and Next Steps. The 10 All Cases columns are unchanged. Property State is not added. Claim State stays the stored dest value.
- Pipeline pages keep that same list chrome and show the stored Case Status pill next to the title. Closed shows both Closed No Service and Closed - New Claim. Nav dots use the same Case Status tokens. A case file does not keep All Cases highlighted.
- Case page header strip reads stored `date_of_loss`, `insurance_company`, and `claim_number` (catalog aliases DOL, Insurance Co., Claim No.). Blank stays blank. Insurance Company uses the same choice pill. Section titles stay the catalog / case-page names. Case-page dropdowns and pills use the same tokens. Case Number stays locked. Case comments live on the High table `public.comments`, not as a dest field on `public.cases`.
