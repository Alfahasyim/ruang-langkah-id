-- ============================================================================
-- Ruang Langkah Indonesia — Admin, Galeri, dan Hak Akses
-- Jalankan SETELAH schema.sql. Berkas ini menambahkan:
--   1. Tabel gallery (galeri dipindah dari kode ke database)
--   2. Tabel admins + fungsi is_admin()
--   3. Policy RLS agar admin boleh menulis, publik tetap hanya membaca
--   4. Bucket Storage untuk foto galeri
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tabel gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery (
  id           uuid primary key default gen_random_uuid(),
  caption      text not null,
  location     text not null,
  category     trip_category not null,
  image_path   text,                 -- path di bucket 'galeri', mis. 'prau-2026.jpg'
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists gallery_sort_idx on public.gallery (sort_order, created_at desc);

-- ---------------------------------------------------------------------------
-- 2. Tabel admins + helper is_admin()
--
-- Akun dibuat manual di Dashboard > Authentication > Users (tidak ada
-- pendaftaran admin lewat website), lalu user_id-nya didaftarkan di sini.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

-- security definer + search_path terkunci: dipanggil dari dalam policy RLS,
-- jadi tidak boleh ikut terkena RLS tabel admins itu sendiri.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.gallery enable row level security;
alter table public.admins enable row level security;

-- Admin boleh melihat barisnya sendiri (dipakai untuk verifikasi sesi)
drop policy if exists "admins_read_self" on public.admins;
create policy "admins_read_self" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. Policy RLS untuk admin
-- ---------------------------------------------------------------------------

-- Galeri: publik membaca yang terbit, admin mengelola penuh
drop policy if exists "gallery_public_read" on public.gallery;
create policy "gallery_public_read" on public.gallery
  for select to anon, authenticated
  using (is_published = true);

drop policy if exists "gallery_admin_all" on public.gallery;
create policy "gallery_admin_all" on public.gallery
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Trips: admin boleh tambah/ubah/hapus (policy baca publik sudah ada di schema.sql)
drop policy if exists "trips_admin_all" on public.trips;
create policy "trips_admin_all" on public.trips
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Articles: sama
drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Registrations & members: admin boleh membaca dan mengubah status.
-- Publik tetap hanya boleh insert (policy dari schema.sql), tidak bisa membaca.
drop policy if exists "registrations_admin_read" on public.registrations;
create policy "registrations_admin_read" on public.registrations
  for select to authenticated
  using (public.is_admin());

drop policy if exists "registrations_admin_write" on public.registrations;
create policy "registrations_admin_write" on public.registrations
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "registrations_admin_delete" on public.registrations;
create policy "registrations_admin_delete" on public.registrations
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "members_admin_read" on public.members;
create policy "members_admin_read" on public.members
  for select to authenticated
  using (public.is_admin());

drop policy if exists "members_admin_write" on public.members;
create policy "members_admin_write" on public.members
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "members_admin_delete" on public.members;
create policy "members_admin_delete" on public.members
  for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Storage: bucket foto galeri
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do update set public = true;

drop policy if exists "galeri_public_read" on storage.objects;
create policy "galeri_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'galeri');

drop policy if exists "galeri_admin_write" on storage.objects;
create policy "galeri_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'galeri' and public.is_admin());

drop policy if exists "galeri_admin_delete" on storage.objects;
create policy "galeri_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'galeri' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Data contoh galeri (tanpa foto — tampil sebagai gradien sampai diunggah)
-- ---------------------------------------------------------------------------
insert into public.gallery (caption, location, category, sort_order) values
  ('Menunggu kabut buyar di Bukit Teletubbies', 'Gunung Prau, Dieng', 'gunung', 1),
  ('Kolam zamrud yang dingin menusuk', 'Leuwi Hejo, Sentul', 'curug', 2),
  ('Canopy trail di antara pohon rasamala', 'Halimun Salak, Bogor', 'hutan', 3),
  ('Sarapan bersama sebelum turun gunung', 'Suryakencana, Gunung Gede', 'gunung', 4),
  ('Tiga tirai air yang jatuh berbarengan', 'Curug Cikaso, Sukabumi', 'curug', 5),
  ('Membawa turun 14 kg sampah dari jalur', 'Aksi bersih gunung, Papandayan', 'gunung', 6),
  ('Belajar mengenali jejak satwa bersama ranger', 'Citalahab, Halimun Salak', 'hutan', 7),
  ('Langit merah di tepi Segara Anak', 'Gunung Rinjani, Lombok', 'gunung', 8)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 6. LANGKAH TERAKHIR — daftarkan akun admin
--
-- a. Dashboard > Authentication > Users > Add user (isi email & password,
--    centang "Auto Confirm User").
-- b. Salin User UID-nya, lalu jalankan perintah di bawah ini:
--
--      insert into public.admins (user_id, full_name)
--      values ('PASTE-USER-UID-DI-SINI', 'Nama Anda');
--
-- Tanpa langkah ini, login akan ditolak meski password benar.
-- ---------------------------------------------------------------------------
