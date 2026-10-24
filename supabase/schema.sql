-- Veltro Talent Solutions production database
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  title text not null,
  company text not null,
  sector text not null,
  location text not null,
  region text,
  type text not null,
  work text not null,
  salary text,
  salary_min numeric default 0,
  level text,
  hours text,
  deadline date,
  duration text,
  ir35 text,
  recruiter text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','closed')),
  description text not null,
  responsibilities text[] not null default '{}',
  skills text[] not null default '{}',
  qualifications text[] not null default '{}',
  benefits text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  reason text,
  message text not null,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','in_progress','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.vacancy_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  job_title text not null,
  recruitment_type text,
  sector text,
  salary text,
  location text,
  description text not null,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.candidate_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  sector text,
  job_type text,
  message text,
  cv_path text,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','screening','qualified','rejected','placed')),
  created_at timestamptz not null default now()
);

create index if not exists jobs_status_created_idx on public.jobs(status, created_at desc);
create index if not exists jobs_sector_idx on public.jobs(sector);
create index if not exists contact_created_idx on public.contact_enquiries(created_at desc);
create index if not exists vacancy_created_idx on public.vacancy_requests(created_at desc);
create index if not exists candidate_created_idx on public.candidate_submissions(created_at desc);

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.vacancy_requests enable row level security;
alter table public.candidate_submissions enable row level security;

create policy "users can read own profile" on public.profiles
for select using (id = auth.uid());

-- Public users can only see published vacancies.
create policy "public can read published jobs" on public.jobs
for select using (status = 'published');

-- Admins can manage all vacancies.
create policy "admins manage jobs" on public.jobs
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- Public forms can create submissions. No public read access.
create policy "public can submit contact" on public.contact_enquiries
for insert with check (true);

create policy "admins read contact" on public.contact_enquiries
for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

create policy "admins update contact" on public.contact_enquiries
for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

create policy "public can submit vacancy" on public.vacancy_requests
for insert with check (true);

create policy "admins manage vacancy requests" on public.vacancy_requests
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

create policy "public can submit candidate" on public.candidate_submissions
for insert with check (true);

create policy "admins manage candidates" on public.candidate_submissions
for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- Private CV bucket. Admins can read/download; public users may upload only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('candidate-cvs', 'candidate-cvs', false, 10485760, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public=false, file_size_limit=10485760;

create policy "public can upload CVs" on storage.objects
for insert with check (bucket_id = 'candidate-cvs');

create policy "admins can read CVs" on storage.objects
for select using (
  bucket_id = 'candidate-cvs' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

create policy "admins can delete CVs" on storage.objects
for delete using (
  bucket_id = 'candidate-cvs' and
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at before update on public.jobs
for each row execute procedure public.set_updated_at();
