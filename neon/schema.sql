-- Run this in Neon Dashboard → SQL Editor
-- https://console.neon.tech → your project → SQL Editor

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text unique not null,
  name text not null,
  email text not null,
  phone text not null,
  gender text not null,
  partner_name text not null,
  partner_email text not null,
  onboarding_completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_auth_user_id_idx on profiles (auth_user_id);

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- Love Quotient game results
create table if not exists lq_results (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null,
  score int not null,
  tier_id text not null,
  tier_label text not null,
  cat_id text not null,
  cat_verdict text not null,
  answer_scores jsonb not null,
  email_sent boolean not null default false,
  share_token text unique,
  created_at timestamptz not null default now()
);

create index if not exists lq_results_auth_user_id_idx on lq_results (auth_user_id);
create unique index if not exists lq_results_share_token_idx on lq_results (share_token);
