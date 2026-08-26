-- P12 empty High tables copied from supabase_migrations.schema_migrations on conveyordb-testing.
-- Repo copy only. Do not apply to production. No invented fields. No field_map inserts.
-- Inline comments are the live Airtable field ids from the applied SQL.
-- Attachment / file-slot fields omitted; PDFs live in files. Formulas are nullable text.

create table if not exists public.referred_cases (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  client_name text, -- fld7WNhxkIkeSvpNN Client Name
  create_managed_case boolean, -- fld9Z1vGSMgkRK2pG Create Managed Case
  associated_case text, -- fldM11FDP7sdkFy7w Associated Case
  cases_copy text, -- fldj3UXN1pqTtFWBF Cases copy
  claim_state text[], -- fldAXR6iHz3hmQUL0 Claim State
  property_type text, -- fldt68Dq6b0jPnrCn Property Type
  insurance_company text, -- fldgDe3J956swG3QH Insurance Company
  cause_of_loss text[], -- fldR065qfU0oWQJjd Cause of Loss
  address text, -- fldgOmGrNi3Nwefgh Address
  contractor text, -- fldD5orLL7QWDfv4g Contractor
  claim_type text[], -- fldmvlnJe05YizTBl Claim Type
  client_phone_number text, -- fldNmD0vxYHOxSudc Client Phone Number
  email text, -- fldFrpnuCf5azxCHU Email
  estimate_amount numeric, -- fldGbwVLtbMSYGDiY Estimate Amount
  date_of_loss date, -- fldKMh0VNSzhsGvLa Date of Loss
  policy_number text, -- fldgkQaHaRJjFTrwK Policy Number
  claim_number text, -- fldH1GWKlU6UJgJ08 Claim Number
  claim_summary_for_litigation text, -- fldC2vbxHIp083oHa Claim Summary for Litigation
  ic_adjuster_contact_info text, -- flduE9fyPCOgBYEzr IC Adjuster Contact Info
  opposing_appraiser text, -- fldGmY9b59QQlel3T Opposing Appraiser
  appraiser text, -- fld1oH9nVf3vPI5KL Appraiser
  create_date timestamptz, -- fldn7OhuxgN6I82Wh Create Date
  fail_test_a text, -- fldJDudNhiLE0UdFO Fail Test A
  referred_attorney text[], -- fldKxzsj9zDkbpjvg Referred Attorney
  first_name text, -- fldjFTn5GJ76VUMe4 First Name
  last_name text, -- fldtxYloxuNndFxx8 Last Name
  client_phone_number_2 text, -- fldmkQg8Kl0IZiozn Client Phone Number 2
  companycam_link text, -- fldhWFClXWFa1KbZO CompanyCam Link
  damage_overview_slides_link text, -- fldwi68f0E3WJqpUo Damage Overview Slides Link
  sync_source text, -- fldKHTn0Tx98gPMFp Sync Source
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  invoice_number text, -- fld0nIrFLyL2LfDeZ Invoice Number
  reference_number text, -- fldBF0pLEC4ZQ35R8 Reference Number
  amount numeric, -- fld4IV51nYuWFN08Y Amount
  invoice_status text, -- flddcHu6A7P3tSo2e Invoice Status
  qbo_id text, -- fld2wOGsv3vsjRzlV QBO ID
  associated_case text, -- fldLIoY0KLyFTIyJ7 Associated Case
  associated_payments text, -- fldo2cQyiMg5sKMk0 Associated Payments
  sent_date date, -- fldxmBbvjiTg2rD42 Sent Date
  create_date timestamptz, -- fld2kRi5jZA104J9I Create Date
  invoice_id text, -- fldFPbugVuuMOVXGl Invoice ID
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  payment_index text, -- fldDD6nvQAbixlAJI Payment Index
  payment_notes text, -- fldj32RZWiE03jll7 Payment Notes
  payment_date date, -- flduq5beO7M40XHrW Payment Date
  payment_amount numeric, -- fld15MVawrlDOzjY7 Payment Amount
  payment_type text, -- fldBFjwUHxnRJHfCA Payment Type
  associated_invoice text, -- fldzfRrAktnw6w1SA Associated Invoice
  payment_id text, -- fldv2pl5l89hdk31U Payment ID
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  email_subject text, -- fld1MGfAGQFi5tmtc Email Subject
  body text, -- fldcrhGR5bW6dOgRs Body
  received_date date, -- fldNSJ4htg7h1RH7x Received Date
  associated_case text, -- fldf3cv4qFuwwS3qO Associated Case
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_folders (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  folder_name text, -- fldKLyKhdTpjDYMja Folder Name
  folder_status text, -- fldKruQk2qQhcAll4 Folder Status
  folder_id text, -- fldyuVt3AsFGgNcjC Folder ID
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_partners (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  company_and_contact text, -- fldODXWX8UMx9DgOY Company & Contact
  status text, -- fldlHEIhNI8yaEmS8 Status
  professional_partner_role text, -- fldUgIW9lXpW3T8Hq Professional Partner Role
  company text, -- fldNbevNqA3rm2gtF Company
  contact text, -- fldbVP3tmzwbsUZT8 Contact
  email text, -- fldqynJQmYFHTWgWS Email
  ring_central_direct_dial text, -- fldVVBzjrh5i5zLrq Ring Central Direct Dial
  office_number text, -- fldhsg2FpjSadpQkY Office Number
  mobile_number text, -- fldGiqiYQ7QsQ3UuL Mobile Number
  fax_number text, -- fld9jVWBUDm0V9J2e Fax Number
  physical_address text, -- fldhVn4XTcaJRBDeY Physical Address
  mailing_address text, -- fldSEDVYyfb8FmsbH Mailing Address
  additional_details text, -- fldBsVg0MXcT4iPHM Additional Details
  claim_threshold text, -- fldYR54SYqM8cES5e Claim $ Threshold
  states_of_operation text[], -- fldAbjY1BWeT419N8 State(s) of Operation
  requires_client_agreement text, -- fldY0lXNvGsbc6ANh Requires Client Agreement
  managed_cases text, -- fldAr4UHxHDotyo9d Managed Cases
  managed_cases_2 text, -- flda6OGRGl6MbnOby Managed Cases 2
  appraiser_type text, -- fld9RvxBC4mBQoLeA Appraiser Type
  managed_cases_3 text, -- fld9oyBD7Yp20PaA8 Managed Cases 3
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conveyor_users (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  conveyor_user_groups text, -- fldGQVnfdXHSiyPqS Conveyor User Groups
  conveyor_user_type text[], -- fldj4ftLnxPp0qECA Conveyor User Type
  clg_resolutions_specialist text[], -- fldYRAfCWDjnlUNGs CLG Resolutions Specialist
  clg_paralegal text[], -- fldpAjEdQo3TeNtBm CLG Paralegal
  clg_accounting text[], -- fldOU0KgaVz0Gm0aU CLG Accounting
  clg_leadership text[], -- fldEyAyfeQymUIZ8n CLG Leadership
  clg_staff text, -- fldyADG5eDKLLsDcQ CLG Staff
  attorney_and_staff text, -- flduXcrm0ndtrNVcf Attorney & Staff
  associate_counsel text, -- fldfxbKa7HQFrhu0n Associate Counsel
  clg_demo_staff text, -- fldRdYHSp6DtPvxez CLG Demo Staff
  appraisers text, -- fldjKMJYHwvclUaSD Appraisers
  appraiser_email text, -- flddKwQ888Ya8YGop Appraiser Email
  referral_partner text, -- fldwNcY64xpdc78zt Referral Partner
  building_consultant text, -- fld8jyGu0jnWXFUmI Building Consultant
  building_consultant_email text, -- fldpCnRXgl2wgqUvk Building Consultant Email
  engineer_expert text, -- fldypi9zyTxKROtu1 Engineer/Expert
  engineer_expert_email text, -- fldhDcn8r9v6yqFG2 Engineer/Expert Email
  managed_cases_rf text, -- fld89DLsa94YVjj2w Managed Cases (RF)
  managed_cases_app text, -- fldJzC4dxfR3PulkF Managed Cases (App)
  managed_cases_bc text, -- fldZSNdOIsICBW554 Managed Cases (BC)
  managed_cases_ee text, -- fldpdLVsyl8baz653 Managed Cases (EE)
  managed_cases_rp text, -- fldZfIDrzoaUkQAGX Managed Cases (RP)
  managed_cases_ac text, -- fldOMX5yjJ3Rv2Kre Managed Cases (AC)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claim_tasks (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  task_name text, -- fldU9FAHLaF7TQUZs Task Name
  task_type text, -- fldRHD8ctGc1zO2sT Task Type
  task_manager text, -- fldLhrkXL10Wojrap Task Manager
  case_number text, -- flddfRD9W2mpxLRji Case Number
  assigned_to text, -- fldjrBNX7Y3mrpfHO Assigned To
  owner_role text, -- fldzvqdtLJJf8B7yn Owner Role
  task_status text, -- fldi1xpHeSJ6v5axC Task Status
  assigned_date date, -- fldmc7zeBoPldvlg4 Assigned Date
  due_date date, -- flduKc5T4PBumRKcz Due Date
  completed_date date, -- fldQ9KttKnuK2rkHR Completed Date
  priority text, -- fldthqJ70N0PnsO0x Priority
  case_status text, -- flduDTANgk7ZEDRH7 Case Status
  next_steps text, -- fldzjFHuYifEWuZ7Z Next Steps
  resolutions_specialist text, -- fldH2oanOEaXYIR2U Resolutions Specialist
  paralegal text, -- fldcAUa0pjmbBVQv4 Paralegal
  referred_firm text, -- fldZCR7rrxvOS6gEF Referred Firm
  task_notes text, -- fldggpAkdVHQjTeQ0 Task Notes
  related_links text, -- fld4dKPxgauG2A5p3 Related Links
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  "comment" text, -- fldaJExTV4Bpg0vf6 Comment
  "case" text, -- fldVf6inNnQjKMgot Case
  author text, -- fldMPCNzc4iZcax5k Author
  created_time timestamptz, -- fld1im46yfTPtdEY3 Created Time
  mentioned_users text, -- fldipjBEzPNZYWGdZ Mentioned Users
  parent_comment text, -- fldIBDv4wk4yuNl1T Parent Comment
  replies text, -- flduZYG72sphUMu43 Replies
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  full_name text, -- fldsc8HG9l3GpS0pP Full Name
  first_name text, -- fldPG6gFIhK53ZeOM First Name
  last_name text, -- fldoQ2bX0MJHZ0GKR Last Name
  email_address text, -- fldnJeMDqNts4Tczp Email Address
  direct_number text, -- fldVePW3smDwXyIUn Direct Number
  alternative_number text, -- fld5lKicpXIBs2Z4q Alternative Number
  associated_partner text, -- fld1VPEHuBqEpv5SZ Associated Partner
  partner_name_lookup text, -- fldLPXdkYGX5mEg8k Partner Name-lookup
  partner_type text, -- fldZ9TbSOHdcR5ldv Partner Type
  partner_id text, -- fld9BzvM2pHe9pPBn Partner ID
  create_date timestamptz, -- fld0llG1YaiC44dBj Create Date
  conveyor_id text, -- flds9q1zElMNriYfk Conveyor ID
  user_id text, -- fldZTsPyPr9tWmU40 User ID
  managed_cases text, -- fldJG8jmYNneuWYXk Managed Cases
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists referred_cases_airtable_id_idx on public.referred_cases (airtable_id);
create index if not exists invoices_airtable_id_idx on public.invoices (airtable_id);
create index if not exists payments_airtable_id_idx on public.payments (airtable_id);
create index if not exists emails_airtable_id_idx on public.emails (airtable_id);
create index if not exists client_folders_airtable_id_idx on public.client_folders (airtable_id);
create index if not exists professional_partners_airtable_id_idx on public.professional_partners (airtable_id);
create index if not exists conveyor_users_airtable_id_idx on public.conveyor_users (airtable_id);
create index if not exists claim_tasks_airtable_id_idx on public.claim_tasks (airtable_id);
create index if not exists comments_airtable_id_idx on public.comments (airtable_id);
create index if not exists users_airtable_id_idx on public.users (airtable_id);

alter table public.referred_cases enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.emails enable row level security;
alter table public.client_folders enable row level security;
alter table public.professional_partners enable row level security;
alter table public.conveyor_users enable row level security;
alter table public.claim_tasks enable row level security;
alter table public.comments enable row level security;
alter table public.users enable row level security;
