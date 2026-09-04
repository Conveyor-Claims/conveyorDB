# Files / case-files slots

Catalog file fields are **not** columns on `public.cases`. Each upload is a `public.files` row plus an object in the private Storage bucket `case-files`.

## Responsibilities

- Show on-screen catalog file slots on the case page (slot name = catalog field name).
- Upload from staff (temp admin) or `POST /api/files` (multipart).
- Refuse a second object for a filled slot. Keep the first Storage object.
- Sign paths for display (1 hour). Do not make the bucket public.

## Inputs / outputs

| In | Out |
| --- | --- |
| `case_id` (uuid), `slot_name` (catalog string), one `file` | `public.files` row: `storage_path`, `content_type` |
| Staff: `caseRowId`, `slot_name`, `file` on the case form | Same upload helper as the API |

Storage path shape: `{caseId}/{fileRowId}/{safeFileName}`. Upload uses `upsert: false`.

### 409 if the slot is filled

A slot is filled when a row already exists for that `case_id` + `slot_name` **and** `storage_path` is non-empty.

- Upload returns **409** (`filled: true`). Message: `Slot "{name}" is already filled for this case. The existing file was not replaced.`
- The existing object is not replaced or deleted.
- There is **no** unique constraint on `(case_id, slot_name)`. Do not add one.
- JSON `PATCH /api/files/{id}` that would change a filled `storage_path` is also 409.
- Failed Storage upload deletes the just-inserted row (no orphan empty slot from that attempt).

`allowAnother` exists on the helper for tests; staff and `/api` do not pass it.

## What is not here

- Backup copies `public.files` rows, not the `case-files` objects ([backup.md](backup.md)).
- Airtable attachment fields were omitted from `cases`; copy scripts skip them ([copy.md](copy.md)).

## Key files

| File | Role |
| --- | --- |
| `src/lib/file-slots.ts` | `uploadFileToSlot`, filled-slot check |
| `src/lib/file-slot-display.ts` | Path helpers, 409 message |
| `src/lib/files.ts` | List + sign URLs; staff upload gate |
| `src/lib/case-page.ts` | `CASE_PAGE_FILE_SLOTS` per section |
| `app/cases/[id]/case-file-slots.tsx` | On-page slots |
| `app/cases/[id]/actions.ts` | `uploadFileAction` |
| `src/lib/api/handlers.ts` | Multipart POST + refuse-if-filled |
| `src/lib/schema/tables.ts` | `DEFAULT_STORAGE_BUCKET = "case-files"` |
