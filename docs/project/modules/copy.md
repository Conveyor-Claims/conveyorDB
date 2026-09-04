# Airtable copy scripts (dry-run)

`scripts/copy/` documents how dest columns would be filled from Airtable. **Default and only mode is dry-run.** The scripts refuse write flags (`--apply`, `--write`, `--commit`, `--upsert`, `--insert`). They never write to Supabase or Airtable.

This is not an in-app sync. The Next.js app does not dual-write to Airtable.

## Copy-last (as-is) rule

Copy Airtable’s **current stored value** into the mapped dest column. Do not invent dollars, court names, options, or false blanks. Empty / missing → `null`. Formulas stay nullable (not filled). File/attachment fields are not dest columns (they belong on `files` later).

Match key: `airtable_id` = Airtable record id.

## Scripts and maps

| Script | Map | Dest table |
| --- | --- | --- |
| `dry_run_managed_cases.py` | `p13-case-copy-map.csv` | `public.cases` |
| `dry_run_contacts.py` | `p14-contact-copy-map.csv` | `public.contacts` |
| `dry_run_partners.py` | `p14-partner-copy-map.csv` | `public.partners` |

Maps must list dest columns that already exist. Contact/partner scripts check the dest list against P11 columns.

## Inputs / outputs

| In | Out |
| --- | --- |
| Optional Airtable + Supabase env (read-only) | Printed map stats and what a copy would do |
| `--map-only` | Counts only; no network |

Env names the scripts read (never commit values): `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Key files

| File | Role |
| --- | --- |
| `scripts/copy/dry_run_*.py` | Dry-run printers |
| `scripts/copy/*.csv` | Field id → dest_column maps |
