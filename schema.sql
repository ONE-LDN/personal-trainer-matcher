-- ONE LDN PT Matcher — Database Schema v3
-- Supabase project must be in EU region (West Europe / eu-west-2)
-- Run this in Supabase SQL Editor before seed.sql

create extension if not exists "uuid-ossp";

-- ============================================================
-- pt_roster
-- ============================================================
create table if not exists pt_roster (
  id            serial primary key,
  name          text not null,
  role          text not null,
  specialisms   jsonb not null default '[]',
  populations   jsonb not null default '[]',
  best_for      text,
  tier          text check (tier in ('SENIOR','SPECIALIST','ASSOCIATE')),
  capacity      int  not null default 0,
  current_load  int  not null default 0,
  rate          int,
  initials      text,
  gender        text check (gender in ('male','female')),
  active        boolean not null default true,
  created_at    timestamptz default now()
);

alter table pt_roster enable row level security;
create policy "Public read pt_roster" on pt_roster for select using (true);

-- ============================================================
-- leads — member intake form submissions
-- ============================================================
create table if not exists leads (
  id            uuid primary key default uuid_generate_v4(),
  first_name    text not null,
  last_name     text,
  email         text not null,
  phone         text,
  age           text,
  gender        text check (gender in ('male','female','prefer_not',null)),
  pt_gender_pref text check (pt_gender_pref in ('male','female','no_preference',null)),  -- explicit PT gender preference
  goal          text,        -- performance | play | consistency | longevity | aesthetics | mindset | other
  goal_detail   text,        -- open-ended follow-up
  freq          text,        -- never | 1_2 | 3_4 | 5_6 | 7plus
  injuries      text,        -- open-ended injury/medical notes (blank = none)
  anything_else text,        -- open-ended catch-all
  status        text not null default 'new'
                  check (status in ('new','assigned','contacted')),
  matched_pts   jsonb,       -- top 3 PT ids from matching algorithm
  assigned_pt_id int references pt_roster(id),
  notes         text,
  created_at    timestamptz default now()
);

alter table leads enable row level security;
create policy "Anon insert leads"  on leads for insert with check (true);
create policy "Service read leads" on leads for select using (auth.role() = 'service_role');
create policy "Service update leads" on leads for update using (auth.role() = 'service_role');

-- ============================================================
-- lead_assignments — audit trail for admin assignment actions
-- ============================================================
create table if not exists lead_assignments (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid references leads(id) on delete cascade,
  pt_id       int  references pt_roster(id),
  assigned_by text,
  assigned_at timestamptz default now(),
  status      text default 'active'
);

alter table lead_assignments enable row level security;
create policy "Service manage assignments" on lead_assignments
  using (auth.role() = 'service_role');

-- ============================================================
-- pt_availability — PT intro session availability slots
-- Separate table (not JSONB on pt_roster) to allow easy updates
-- as PT schedules fluctuate. day_of_week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
-- ============================================================
create table if not exists pt_availability (
  id            serial primary key,
  pt_id         int  references pt_roster(id) on delete cascade,
  day_of_week   int  not null check (day_of_week between 0 and 6),
  start_time    time not null,
  end_time      time not null,
  notes         text,
  updated_at    timestamptz default now()
);

alter table pt_availability enable row level security;
create policy "Public read pt_availability" on pt_availability for select using (true);
create policy "Service manage pt_availability" on pt_availability
  for all using (auth.role() = 'service_role');
