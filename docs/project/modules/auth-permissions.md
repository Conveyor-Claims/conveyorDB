# Auth stubs and permissions

Temporary staff login and per-case paralegal grants. This is not real identity (no passwords, no Google, no users join).

## Staff session (cookie)

Cookie name: `conveyordb_session`. Values: `admin` or `paralegal`. HttpOnly, SameSite=lax, Secure in production.

| Stub | Can see | Can write |
| --- | --- | --- |
| Temporary admin | Every stored case | Create case, edit dest fields, upload files, claim next steps, add people, post comments, grant/revoke cases |
| Temporary paralegal | Only granted cases, and only if the type-level toggle is on | None of the write actions above. Create case and Permissions stay hidden. |

Signed-out `/` is the login landing. `/login` explains the stubs. `/preferences` is a no-op stub.

**Cookie is not API auth.** `/api/*` cabinet routes require the service-role Bearer ([http-api.md](http-api.md)).

## Paralegal grants (P25)

Tables (see [schema.md](schema.md)):

- `role_permissions` — `role_type` primary key. Today: `paralegal` with `can_view_granted_cases`.
- `case_view_grants` — unique `(role_type, case_id)`. Per case, not by firm.

RLS on `public.cases`: anon/authenticated SELECT only when the paralegal toggle is true **and** a grant row exists. Service role bypasses (admin UI + `/api`).

`/permissions` is admin-only. It toggles viewing and grant/revokes Managed Cases for the paralegal type.

Staff paralegal **reads** go through the anon key (`visibleCasesClient`) so RLS applies. Admin lists use the service-role client.

## Inputs / outputs

| In | Out |
| --- | --- |
| Login button | Set cookie, redirect `/` |
| Sign out | Delete cookie, redirect `/` |
| Permissions toggle | UPDATE `role_permissions.can_view_granted_cases` |
| Grant / revoke | INSERT / DELETE `case_view_grants` |

## Key files

| File | Role |
| --- | --- |
| `src/lib/session.ts`, `session-cookie.ts`, `session-actions.ts` | Cookie stubs |
| `app/login/page.tsx` | How-to + two buttons |
| `src/lib/permissions.ts` | Admin-gated grant helpers |
| `app/permissions/*` | Admin form |
| `src/lib/visible-cases.ts` | Paralegal → anon client |
| `src/lib/clients/server.ts` | Anon server client |
| `src/lib/api/auth.ts` | API Bearer (separate from cookies) |
| `supabase/migrations/20260831170000_p25_paralegal_case_grants.sql` | Tables + RLS |
