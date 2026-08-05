-- ============================================================================
-- Ruang Langkah Indonesia — Skema Database
-- Jalankan seluruh isi berkas ini di Supabase Dashboard > SQL Editor > New query
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Tipe enum
-- ---------------------------------------------------------------------------
do $$ begin
  create type trip_category as enum ('gunung', 'curug', 'hutan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type trip_status as enum ('draft', 'open', 'full', 'closed', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_status as enum ('pending', 'confirmed', 'waitlist', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type article_category as enum ('perlengkapan', 'etika', 'keselamatan', 'navigasi');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Tabel trips — katalog kegiatan alam
-- ---------------------------------------------------------------------------
create table if not exists public.trips (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  category          trip_category not null,
  location          text not null,
  province          text,
  meeting_point     text,
  start_date        date not null,
  end_date          date,
  difficulty_level  smallint not null check (difficulty_level between 1 and 5),
  elevation_m       integer,
  quota             integer not null check (quota > 0),
  seats_taken       integer not null default 0 check (seats_taken >= 0),
  price             numeric(12, 2) not null default 0 check (price >= 0),
  summary           text not null,
  description       text not null,
  highlights        text[] not null default '{}',
  includes          text[] not null default '{}',
  requirements      text[] not null default '{}',
  image_url         text,
  status            trip_status not null default 'open',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Skala 1–5 dipetakan otomatis ke label Pemula / Menengah / Lanjutan
  difficulty_tier text generated always as (
    case
      when difficulty_level <= 2 then 'Pemula'
      when difficulty_level = 3 then 'Menengah'
      else 'Lanjutan'
    end
  ) stored,

  seats_remaining integer generated always as (greatest(quota - seats_taken, 0)) stored,

  constraint trips_end_after_start check (end_date is null or end_date >= start_date),
  constraint trips_quota_not_exceeded check (seats_taken <= quota)
);

create index if not exists trips_start_date_idx on public.trips (start_date);
create index if not exists trips_category_idx on public.trips (category);
create index if not exists trips_status_idx on public.trips (status);

-- ---------------------------------------------------------------------------
-- 3. Tabel registrations — pendaftaran peserta trip
-- ---------------------------------------------------------------------------
create table if not exists public.registrations (
  id                       uuid primary key default gen_random_uuid(),
  trip_id                  uuid not null references public.trips (id) on delete cascade,
  full_name                text not null check (char_length(full_name) between 3 and 120),
  email                    text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  phone                    text not null check (char_length(phone) between 8 and 20),
  birth_date               date,
  emergency_contact_name   text not null,
  emergency_contact_phone  text not null,
  experience_level         text not null,
  medical_notes            text,
  notes                    text,
  status                   registration_status not null default 'pending',
  created_at               timestamptz not null default now()
);

-- Satu email hanya boleh mendaftar sekali per trip
create unique index if not exists registrations_trip_email_key
  on public.registrations (trip_id, lower(email));

create index if not exists registrations_trip_idx on public.registrations (trip_id);

-- ---------------------------------------------------------------------------
-- 4. Tabel members — keanggotaan komunitas (halaman Gabung)
-- ---------------------------------------------------------------------------
create table if not exists public.members (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  email            text not null,
  phone            text not null,
  city             text not null,
  birth_date       date,
  experience_level text not null,
  interests        text[] not null default '{}',
  motivation       text not null,
  is_verified      boolean not null default false,
  created_at       timestamptz not null default now()
);

create unique index if not exists members_email_key on public.members (lower(email));

-- ---------------------------------------------------------------------------
-- 5. Tabel articles — panduan & tips
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  category      article_category not null,
  excerpt       text not null,
  body          text,
  read_minutes  integer not null default 5,
  author        text not null,
  is_published  boolean not null default true,
  published_at  date not null default current_date,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. Trigger updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. RPC register_trip — pendaftaran atomik agar kuota tidak pernah kelebihan
-- ---------------------------------------------------------------------------
create or replace function public.register_trip(
  p_trip_id                 uuid,
  p_full_name               text,
  p_email                   text,
  p_phone                   text,
  p_birth_date              date,
  p_emergency_contact_name  text,
  p_emergency_contact_phone text,
  p_experience_level        text,
  p_medical_notes           text default null,
  p_notes                   text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trip   public.trips%rowtype;
  v_status registration_status;
begin
  -- Kunci baris trip supaya dua pendaftaran bersamaan tidak melampaui kuota
  select * into v_trip from public.trips where id = p_trip_id for update;

  if not found then
    raise exception 'Trip tidak ditemukan.';
  end if;

  if v_trip.status not in ('open', 'full') then
    raise exception 'Pendaftaran untuk trip ini sudah ditutup.';
  end if;

  if v_trip.start_date < current_date then
    raise exception 'Trip ini sudah berlalu.';
  end if;

  if exists (
    select 1 from public.registrations
    where trip_id = p_trip_id and lower(email) = lower(p_email)
  ) then
    raise exception 'Email sudah terdaftar pada trip ini.';
  end if;

  v_status := case when v_trip.seats_taken >= v_trip.quota then 'waitlist' else 'pending' end;

  insert into public.registrations (
    trip_id, full_name, email, phone, birth_date,
    emergency_contact_name, emergency_contact_phone,
    experience_level, medical_notes, notes, status
  ) values (
    p_trip_id, p_full_name, lower(p_email), p_phone, p_birth_date,
    p_emergency_contact_name, p_emergency_contact_phone,
    p_experience_level, p_medical_notes, p_notes, v_status
  );

  if v_status = 'pending' then
    update public.trips
       set seats_taken = seats_taken + 1,
           status = case when seats_taken + 1 >= quota then 'full'::trip_status else status end
     where id = p_trip_id
     returning * into v_trip;
  end if;

  return json_build_object(
    'registration_status', v_status,
    'seats_remaining', greatest(v_trip.quota - v_trip.seats_taken, 0)
  );
end;
$$;

revoke all on function public.register_trip from public;
grant execute on function public.register_trip to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 8. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.trips enable row level security;
alter table public.registrations enable row level security;
alter table public.members enable row level security;
alter table public.articles enable row level security;

-- Trips: publik boleh membaca yang sudah terbit, tulis hanya lewat dashboard/service role
drop policy if exists "trips_public_read" on public.trips;
create policy "trips_public_read" on public.trips
  for select to anon, authenticated
  using (status <> 'draft');

-- Registrations: publik boleh mendaftar, tapi tidak boleh membaca data peserta lain.
-- Insert langsung diperbolehkan sebagai cadangan; jalur utama tetap lewat register_trip().
drop policy if exists "registrations_public_insert" on public.registrations;
create policy "registrations_public_insert" on public.registrations
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.trips t
      where t.id = trip_id
        and t.status in ('open', 'full')
        and t.start_date >= current_date
    )
  );

-- Members: publik boleh mendaftar anggota, tidak boleh membaca daftar anggota
drop policy if exists "members_public_insert" on public.members;
create policy "members_public_insert" on public.members
  for insert to anon, authenticated
  with check (true);

-- Articles: publik hanya membaca artikel terbit
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select to anon, authenticated
  using (is_published = true);
