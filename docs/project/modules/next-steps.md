# Next steps

Two stored places, kept in sync on write:

1. `public.cases.next_steps` — text array (dest multi-select on the case page).
2. `public.next_steps` — cabinet rows (`case_id`, `name`). One row per name per case.

## Responsibilities

- List cabinet rows for a case (staff claim UI).
- Temp admin can add a stored name (type or pick a name already on the case — do not invent names).
- Claim / update uses optimistic lock on dest `updated_at` (same idea as case `last_modified`).
- Creating a case can insert matching cabinet rows for the selected names.
- Saving the case `next_steps` array inserts any missing cabinet rows (does not delete extras).

There is **no owner column**. Do not insert a second row with the same `name` for the same case.

## Inputs / outputs

| In | Out |
| --- | --- |
| Case id | `next_steps` rows ordered by `created_at` |
| Add: typed or picked `name` | Insert, or update the existing same-name row |
| Claim: `nextStepId`, `name`, loaded `updated_at` | UPDATE `id` + `updated_at`, or 409 conflict |
| API `POST /api/next-steps` | 409 if that name already exists for the case |
| API `PATCH /api/next-steps/{id}` | `updated_at` or `If-Match`; `"overwrite": true` skips the match |

0-row UPDATE → `{ "error": "Someone else saved this next step.", "conflict": true }`. Staff UI offers Reload or Overwrite.

`GET /api/next-steps?case_id=` filters the list. Invalid uuid → 400.

## Key files

| File | Role |
| --- | --- |
| `src/lib/next-steps.ts` | List, add, claim, insert-for-new-case |
| `src/lib/next-step-concurrency.ts` | `updated_at` lock, duplicate-name find |
| `app/cases/[id]/case-next-steps.tsx`, `case-form-next-steps.tsx` | Case page UI |
| `app/cases/new/create-case-next-steps.tsx` | Create-case default name |
| `src/lib/select-options.ts` | Existing next-step option list |
| `src/lib/api/handlers.ts` | POST duplicate check + PATCH lock |

## Related

Case dest array lives in [cases.md](cases.md). API contract: [http-api.md](http-api.md).
