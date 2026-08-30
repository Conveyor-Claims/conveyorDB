# ConveyorDB

In-house Airtable replacement for Conveyor Claims.

P11: empty five cabinets (Case, Contact, Partner, Next Step, File).

## App

Next.js App Router (TypeScript) for Vercel project `conveyor-db`. It reads the live empty schema on Supabase project `conveyordb-testing` (`eskwbmtqtzqssbhyzjmv`). Do not invent schema, dollar amounts, or court names. Blanks stay blank.

The field catalog is unchanged at `docs/catalog/fields.csv`.

### HTTP API

Intake and Coworking read and write the five cabinets through `/api` (`docs/api.md`). Every `/api/*` route requires `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`. Cookie / temporary admin login is not enough. Intake's first test is **PATCH** the existing Natalie row **C-02895** only (look up stored `case_number` `C - 02895 - Natalie Dubin`, or its uuid). Do not insert a second test case. `POST` insert stays in the door for later. Callers still omit `case_number` on writes.

### Environment

Copy `.env.example` to `.env.local` (never commit secrets):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=case-files
```

Set the same names on the Vercel project. `SUPABASE_SERVICE_ROLE_KEY` is server-only. The private Storage bucket is `case-files`.

### Scripts

```bash
npm install
npm run dev
```

- `/` standing-up page
- `/cases` All Cases list from `public.cases` (empty tables render an empty list). Grouped by Referred Firm. Filters: firm, status, next step, assigned.
- `/referrals` `/pre-lit` `/litigation` — same list filtered to stored `case_status` Referral, Pre-Litigation, Litigation.
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
  - Appraisal Client is skipped: there is no dest column (`appraisal_client_date` / `appraisal_client_due_date` do not exist).
- `/cases/[id]` 42-section case page from stored `public.cases` fields (C-01985 catalog). Stored dest fields are editable (P19). File slots are omitted. Case Number stays locked. Blank fields stay blank. Case comments / case chat is a right rail on `public.comments` (`case` = case row uuid). Oldest first. Author is the temporary admin stub (`admin`). `@tokens` from the body are stored on `mentioned_users` as comma-separated text. No users join, no email, no Airtable dual-write.
- `/login` temporary admin login stub (same as `/`)
- `/health` lists P11 cabinets and P12 High tables and probes the live schema

P21 look-alike (existing dest columns and catalog titles only):

- List pills on All Cases and the three pipeline pages use the live Airtable tokens already in `src/lib/airtable-choice-colors.ts` and `src/lib/select-options.ts` for Case Status, Department, Claim State, Resolutions Specialist, Paralegal, and Next Steps. The 10 All Cases columns are unchanged. Property State is not added. Claim State stays the stored dest value.
- Pipeline pages keep that same list chrome and show the stored Case Status pill next to the title. Closed shows both Closed No Service and Closed - New Claim. Nav dots use the same Case Status tokens. A case file does not keep All Cases highlighted.
- Case page header strip reads stored `date_of_loss`, `insurance_company`, and `claim_number` (catalog aliases DOL, Insurance Co., Claim No.). Blank stays blank. Insurance Company uses the same choice pill. Section titles stay the catalog / case-page names. Case-page dropdowns and pills use the same tokens. Case Number stays locked. Case comments live on the High table `public.comments`, not as a dest field on `public.cases`.
