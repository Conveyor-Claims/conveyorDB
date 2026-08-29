# ConveyorDB HTTP API

Thin service-role door for Intake and Coworking. Existing dest columns only. This PR does not copy live Airtable.

## Auth

- **Header:** `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`
- **401** if the header is missing or the token is wrong
- Cookie / temporary admin login is not enough
- Do not log or return the key

## Base

- **Production:** `https://conveyor-db.vercel.app`
- **Path prefix:** `/api`

## URLs

- **List:** `GET /api/cases`, `GET /api/contacts`, `GET /api/partners`, `GET /api/next-steps`, `GET /api/files`
- **List filter:** optional `?case_id=` on `/api/next-steps` and `/api/files`
- **One row:** `GET /api/{cabinet}/{id}`
- **Insert:** `POST /api/{cabinet}` (JSON). Database generates `id`. Returns the stored row.
- **Update:** `PATCH /api/{cabinet}/{id}` (JSON dest columns only). Returns the stored row.
- **File upload:** `POST /api/files` (multipart). Require `case_id`, `slot_name`, and `file`. Caller sends the slot string. Stores `storage_path` + `content_type` on `public.files` and the bytes in the private `case-files` bucket.

## case_number

- **Owned by ConveyorDB.** Callers omit it on POST and PATCH.
- Apps never write it. The column stays as stored. There is no formula or generator on this door.

## First test

- **PATCH** the existing Natalie row **C-02895** (look up by stored `case_number` on `GET /api/cases`, or by `id`), **or**
- **POST** a new case
- Both work. Intake chooses.

## Fields

- **Existing dest fields only.** Unknown keys are **400**. Empty string / empty array writes `null`. Blank stays blank. Never invent a dollar, court name, option, or default.
- **cases:** dest columns in [`docs/catalog/fields.csv`](catalog/fields.csv) (and `public.cases` Update keys in `src/lib/database.types.ts`)
- **contacts:** `airtable_id`, `associated_cases`, `authorized_representative_name`, `authorized_representative_title`, `best_time_to_contact`, `contact_id`, `created_at`, `email`, `first_name`, `full_name`, `id`, `last_name`, `policy_party_type`, `preferred_contact_method`, `primary_phone`, `qbo_customer_id`, `relationship_to_insured`, `secondary_phone_number`, `updated_at`
- **partners:** `additional_details`, `airtable_id`, `assigned_cases`, `attorney_name`, `bar_no`, `clg_email`, `co_counsel_start_date`, `counsel_id`, `created_at`, `domain`, `draft_letter_of_representations`, `draft_retainer_agreement_claimant`, `draft_retainer_agreement_claimant_and_spouse_or_domestic_p`, `draft_retainer_agreement_entity`, `draft_retainer_agreements`, `email`, `fax_number`, `id`, `license_states`, `mailing_address`, `managed_cases`, `mobile_number`, `of_active_cases`, `office_number`, `partner_name`, `partner_type`, `physical_address`, `referred_cases`, `rp_contact_name`, `rp_fee_percentages`, `rp_fee_percentages_2026`, `status`, `updated_at`, `users`
- **next_steps:** `airtable_id`, `case_id`, `created_at`, `id`, `name`, `updated_at`
- **files:** `airtable_id`, `case_id`, `content_type`, `created_at`, `id`, `slot_name`, `storage_path`, `updated_at`
