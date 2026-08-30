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
- `/referrals` `/pre-lit` `/litigation` — same list filtered to stored `case_status` Referral, Pre-Litigation, Litigation. Extra stages stay later.
- `/cases/[id]` 42-section case page from stored `public.cases` fields (C-01985 catalog). Stored dest fields are editable (P19). File slots are omitted. Case Number stays locked. Blank fields stay blank.
- `/login` temporary admin login stub (same as `/`)
- `/health` lists P11 cabinets and P12 High tables and probes the live schema
