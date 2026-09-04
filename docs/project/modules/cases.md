# Cases UI

Staff lists, create, the 42-section case page, status pipelines, and due-date boards. All of them read `public.cases`. Dest columns only — labels come from [`docs/catalog/fields.csv`](../../catalog/fields.csv).

## Responsibilities

- Show stored cases. Empty lists are one line, not an empty table.
- Filter All Cases by stored `case_status` (pipelines) or a non-null dest date (boards).
- Let a temporary admin create a case (Client Name + optional Next Steps).
- Let staff edit dest fields on `/cases/[id]` with two-editor save on `last_modified`.
- Resolve Client Name and Referred Firm from Contact / Partner cabinets for list display. Rec ids with no name stay blank. Case Number on lists is the number only (`C - 02895`).

## Inputs / outputs

| In | Out |
| --- | --- |
| Signed-in cookie (lists are readable; writes need admin) | Rows from `public.cases` |
| Search: case number or client display name | Filtered groups by `referred_firm` |
| Filters: firm, status, next step, assigned | Same 10 All Cases columns |
| Create form: `client_name`, next step names | Insert: computed `case_number` / `autonum`, `case_status` = `Referral` |
| Case save: dest fields + loaded `last_modified` | Update, or 409 conflict → Reload / Overwrite |

Paralegal reads use the anon key so RLS hides ungranted cases. Admin uses the service-role client (bypass).

## Routes

| Path | Behavior |
| --- | --- |
| `/` (signed in) and `/cases` | All Cases |
| `/cases/new` | Create. Hidden from paralegal. |
| `/cases/[id]` | Case page. Missing id stays in staff chrome with Back to All Cases. |
| `/new-cases` | `case_status` = `Referral` (queue name “New cases”) |
| `/referrals` | Same stored status `Referral` |
| `/pre-lit` | `Pre-Litigation` |
| `/appraisal` | `Appraisal` |
| `/appraisal-lit` | `Appraisal - Lit` |
| `/re-inspection` | `Re-Inspection` |
| `/litigation` | `Litigation` (status pipeline, not the due board) |
| `/settled` | Exact `Settled` only |
| `/settled-paid` | `Settled - Paid` |
| `/non-responsive` | `Non-Responsive` |
| `/closed` | `Closed No Service` or `Closed - New Claim` (no dest named Closed) |

Due-date boards (`/boards/[slug]`), dest column must exist:

| Slug | Dest column |
| --- | --- |
| `cid` | `cid_due_date` |
| `pl` | `pl_due_date` |
| `litigation` | `atty_due_date` |
| `euo` | `euo_date` |
| `atty-client-appt` | `atty_client_appt` |
| `rs` | `rs_due_date` |
| `client-comm` | `next_client_comm_due_date` (also shows `recent_client_comm_date`) |
| `sol` | `sol_deadline` |

Appraisal Client is listed in code so it can be **skipped** (`appraisal_client_date` / `appraisal_client_due_date` do not exist). Those slugs redirect; they are hidden from the sidebar.

## Key files

| File | Role |
| --- | --- |
| `app/cases/page.tsx`, `app/page.tsx` | All Cases |
| `app/cases/cases-list-screen.tsx`, `all-cases-table.tsx` | List chrome, frozen Case Number + Client Name |
| `app/cases/new/*` | Create form + server action |
| `app/cases/[id]/*` | Case page, sections, people, comments, files, next steps |
| `app/{pipeline}/page.tsx` | Thin wrappers around `listCases({ caseStatus })` |
| `app/boards/[slug]/page.tsx` | Due-date board |
| `src/lib/cases.ts` | All Cases columns, due-date select keys |
| `src/lib/visible-cases.ts` | List/get with paralegal RLS client |
| `src/lib/pipelines.ts` | Pipeline slugs and status filters |
| `src/lib/due-date-boards.ts` | Board catalog; skip boards with no dest column |
| `src/lib/case-page.ts` | 42 sections + file slot names per section |
| `src/lib/case-create.ts`, `case-number.ts` | Insert + computed `C - ##### - name` |
| `src/lib/case-save.ts`, `case-concurrency.ts` | Dest PATCH + `last_modified` |
| `src/lib/related-names.ts` | Resolve contact / partner display names |

## Related

Case page also hosts [contacts](contacts.md), [comments](comments.md), [files](files.md), and [next steps](next-steps.md). HTTP writes: [http-api.md](http-api.md).
