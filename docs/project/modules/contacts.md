# Contacts (people on a case)

Contact is a P11 cabinet (`public.contacts`) and a block on the case page. There is **no** `/contacts` staff list.

## Responsibilities

- List people whose `associated_cases` is the case row uuid (text, not an Airtable rec id).
- Temp admin can insert a contact for the open case.
- HTTP API lists / inserts / patches the cabinet for Intake / Coworking.
- List pages resolve Client Name from contact ids when the stored case field is a rec id or uuid ([`related-names.ts`](../../../src/lib/related-names.ts)).

No join table. No copied relationship / party-type option lists. No Airtable dual-write.

## Inputs / outputs

Staff add-person:

| Required | Optional dest | Always null on insert |
| --- | --- | --- |
| Full Name, **or** First Name and Last Name (blank Full Name is filled from those two) | Relationship to Insured, Policy Party Type, Email, phones, preferred method, best time, authorized representative name/title | `qbo_customer_id`, `airtable_id`, `contact_id` |

Empty optional dest fields write `null`. `associated_cases` is set to the case uuid.

API dest keys are listed in [`docs/api.md`](../../api.md). Unknown keys → 400.

## Key files

| File | Role |
| --- | --- |
| `src/lib/contacts.ts` | List for case, add-person |
| `src/lib/contact-fields.ts` | Link match, labels, optional keys |
| `app/cases/[id]/case-people.tsx` | Case page list + form |
| `src/lib/related-names.ts` | Display-name maps for lists |
| `supabase/migrations/20260826043800_p11_empty_cabinets.sql` | `contacts` columns |

Partner cabinet (`public.partners`) has the same API shape and is used to resolve Referred Firm. There is no Partners staff page.
