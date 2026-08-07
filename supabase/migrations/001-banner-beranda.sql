-- ============================================================================
-- 001 — Banner beranda
--
-- Perubahan selisih untuk database yang SUDAH menjalankan admin.sql versi
-- sebelumnya. Bila database masih kosong, jalankan admin.sql saja — isinya
-- sudah mencakup perubahan ini.
--
-- Aman dijalankan berulang.
-- ============================================================================

-- Gambar latar hero di beranda. NULL = memakai latar warna bawaan.
alter table public.site_settings
  add column if not exists banner_path text;

-- Kepekatan lapisan gelap di atas banner (0–90). Tanpa ini, foto terang
-- membuat teks putih di hero tidak terbaca.
alter table public.site_settings
  add column if not exists banner_overlay smallint not null default 55;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_settings_overlay_range'
  ) then
    alter table public.site_settings
      add constraint site_settings_overlay_range
      check (banner_overlay between 0 and 90);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Verifikasi — hasilnya harus menampilkan dua baris: banner_path & banner_overlay
-- ---------------------------------------------------------------------------
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'site_settings'
  and column_name like 'banner%'
order by column_name;
