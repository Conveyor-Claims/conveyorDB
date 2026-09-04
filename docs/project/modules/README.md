# Modules

Each page maps to code that exists today (`app/`, `src/lib/`, `supabase/`, `docs/`). Responsibilities, inputs/outputs, and key files — no invented columns or screens.

| Page | Maps to |
| --- | --- |
| [cases.md](cases.md) | `app/cases`, pipeline routes, `app/boards`, `src/lib/cases.ts`, `pipelines.ts` |
| [http-api.md](http-api.md) | `app/api/[cabinet]`, `src/lib/api`, [`docs/api.md`](../../api.md) |
| [auth-permissions.md](auth-permissions.md) | `src/lib/session.ts`, `permissions.ts`, `src/lib/api/auth.ts` |
| [files.md](files.md) | `src/lib/files.ts`, `file-slots.ts`, `app/cases/[id]/case-file-slots.tsx` |
| [next-steps.md](next-steps.md) | `src/lib/next-steps.ts`, `next-step-concurrency.ts` |
| [contacts.md](contacts.md) | `src/lib/contacts.ts`, case people UI |
| [comments.md](comments.md) | `src/lib/comments.ts`, case rail |
| [schema.md](schema.md) | `supabase/migrations`, `src/lib/database.types.ts`, `docs/catalog/fields.csv` |
| [backup.md](backup.md) | `app/api/cron/backup`, `src/lib/backup` |
| [staff-chrome.md](staff-chrome.md) | `app/staff-*.tsx`, `src/lib/staff-nav.ts`, choice pills |
| [copy.md](copy.md) | `scripts/copy/` dry-run Airtable maps |

Umbrella: [../README.md](../README.md). Diagrams: [../architecture.md](../architecture.md).
