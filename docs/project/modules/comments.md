# Comments (case chat)

Case comments live on the P12 High table `public.comments`, not as a dest field on `public.cases`. They render as a right rail on `/cases/[id]`.

## Responsibilities

- List comments for a case (`"case"` column = case row uuid). Oldest first.
- Temp admin can post. Author is the stub `admin` (same stub as `last_modified_by`).
- `@tokens` in the body are stored on `mentioned_users` as comma-separated text (no `@`, skip `user@host`).
- Optional parent comment must already belong to the same case.

No users join, no email, no Airtable dual-write. Replies column exists on the table; the UI posts `parent_comment` when set.

## Inputs / outputs

| In | Out |
| --- | --- |
| Case uuid | Rows: `comment`, `author`, `created_time`, `mentioned_users`, `parent_comment` |
| Form: `comment`, `caseRowId`, optional `parentCommentId` | Insert; blank comment is a no-op success |

`comments` is **not** an HTTP cabinet. Intake cannot post chat through `/api/comments`.

## Key files

| File | Role |
| --- | --- |
| `src/lib/comments.ts` | List, parse mentions, insert |
| `app/cases/[id]/case-comments.tsx` | Rail UI |
| `app/cases/[id]/page.tsx` | Passes rail into staff chrome |
| `supabase/migrations/20260826044808_p12_empty_high_tables.sql` | `comments` columns |
