# ConveyorDB

In-house Airtable replacement for Conveyor Claims.

P11: empty five cabinets (Case, Contact, Partner, Next Step, File).

## App

Next.js App Router (TypeScript) for Vercel project `conveyor-db`. It reads the live empty schema on Supabase project `conveyordb-testing` (`eskwbmtqtzqssbhyzjmv`). Do not invent schema, dollar amounts, or court names. Blanks stay blank.

The field catalog is unchanged at `docs/catalog/fields.csv`.

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
- `/cases` read-only All Cases list from `public.cases` (empty tables render an empty list)
- `/login` staff Google login stub
- `/health` lists P11 cabinets and P12 High tables and probes the live schema
