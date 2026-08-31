-- P25: type-level permission toggles + per-case view grants.
-- Minimum new tables. No case fields, no extra user types, no Airtable ids.

create table if not exists public.role_permissions (
  role_type text primary key,
  can_view_granted_cases boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_view_grants (
  id uuid primary key default gen_random_uuid(),
  role_type text not null references public.role_permissions (role_type),
  case_id uuid not null references public.cases (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint case_view_grants_role_case unique (role_type, case_id)
);

create index if not exists case_view_grants_case_id_idx
  on public.case_view_grants (case_id);

create index if not exists case_view_grants_role_type_idx
  on public.case_view_grants (role_type);

insert into public.role_permissions (role_type, can_view_granted_cases)
values ('paralegal', true)
on conflict (role_type) do nothing;

alter table public.role_permissions enable row level security;
alter table public.case_view_grants enable row level security;

-- Staff paralegal client uses the anon key. These SELECT policies let the
-- cases policy see the toggle and grants. Writes stay service-role only.
create policy role_permissions_select_staff
  on public.role_permissions
  for select
  to anon, authenticated
  using (true);

create policy case_view_grants_select_staff
  on public.case_view_grants
  for select
  to anon, authenticated
  using (true);

-- Paralegal staff reads go through anon. Service-role (admin UI + /api) bypasses RLS.
create policy cases_select_granted_paralegal
  on public.cases
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.role_permissions p
      where p.role_type = 'paralegal'
        and p.can_view_granted_cases = true
    )
    and exists (
      select 1
      from public.case_view_grants g
      where g.role_type = 'paralegal'
        and g.case_id = cases.id
    )
  );

grant select, insert, update, delete on table public.role_permissions
  to anon, authenticated, service_role;
grant select, insert, update, delete on table public.case_view_grants
  to anon, authenticated, service_role;
