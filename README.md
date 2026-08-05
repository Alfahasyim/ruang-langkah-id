# Ruang Langkah Indonesia

Website Komunitas Ruang Langkah Indonesia — komunitas petualangan alam yang fokus pada
pendakian gunung, eksplorasi curug, dan penjelajahan hutan.

**Tech stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Lucide React · Supabase (PostgreSQL)

---

## 1. Menjalankan di komputer lokal

```bash
npm install
```

```bash
npm run dev
```

Buka http://localhost:3000. Situs **langsung tampil utuh tanpa Supabase** karena memakai
data contoh dari `src/lib/seed-data.ts`. Formulir baru bisa menyimpan data setelah
Supabase dihubungkan (langkah 2).

Perintah lain:

```bash
npm run build && npm start
```

```bash
npx eslint .
```

---

## 2. Menghubungkan Supabase

**a. Buat proyek** di https://supabase.com → New project.

**b. Jalankan skema database.** Buka Dashboard → SQL Editor → New query, lalu jalankan
tiga berkas ini **berurutan**:

1. [`supabase/schema.sql`](supabase/schema.sql) — tabel inti, RLS, dan RPC
2. [`supabase/admin.sql`](supabase/admin.sql) — galeri, hak akses admin, bucket Storage
3. [`supabase/seed.sql`](supabase/seed.sql) — data contoh (opsional)

**c. Isi kredensial.** Ambil URL dan anon key di Dashboard → Project Settings → Data API.

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
```

**d. Jalankan ulang** `npm run dev`. Aplikasi otomatis beralih dari data contoh ke Supabase.

> `.env.local` sudah masuk `.gitignore` — jangan pernah di-commit. Jangan pula memakai
> service role key dengan prefix `NEXT_PUBLIC_`, karena nilainya ikut terkirim ke browser.

### Isi skema database

| Tabel           | Fungsi                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| `trips`         | Katalog kegiatan: judul, kategori, lokasi, tanggal, level 1–5, kuota, harga  |
| `registrations` | Pendaftaran peserta per trip beserta kontak darurat                          |
| `members`       | Pendaftaran keanggotaan komunitas (halaman Gabung)                           |
| `articles`      | Artikel panduan & tips                                                       |
| `gallery`       | Foto galeri, menunjuk ke berkas di bucket Storage `galeri`                   |
| `team_members`  | Profil tim di halaman Tentang Kami, foto di bucket Storage `tim`             |
| `admins`        | Daftar user yang boleh masuk panel admin                                     |

Detail penting:

- `difficulty_tier` (Pemula/Menengah/Lanjutan) dan `seats_remaining` adalah **generated
  column** — dihitung otomatis oleh Postgres, tidak perlu diisi manual.
- Pendaftaran trip lewat fungsi `register_trip()` yang mengunci baris trip
  (`select … for update`) sehingga kuota tidak pernah kelebihan saat dua orang mendaftar
  bersamaan. Bila kuota habis, pendaftar otomatis berstatus `waitlist`.
- **Row Level Security aktif di semua tabel.** Publik hanya boleh membaca trip & artikel
  yang terbit, dan hanya boleh menulis (insert) pendaftaran — tidak bisa membaca data
  peserta lain.

---

## 3. Panel admin

Panel admin ada di **`/admin`** dan dipakai untuk mengelola isi situs tanpa menyentuh kode.

### Membuat akun admin

Tidak ada halaman pendaftaran admin — akun sengaja hanya bisa dibuat dari dashboard,
supaya tidak ada orang luar yang bisa mendaftarkan diri.

1. Dashboard → **Authentication → Users → Add user**. Isi email & kata sandi, centang
   **Auto Confirm User**.
2. Salin **User UID**-nya.
3. Dashboard → SQL Editor, jalankan:

```sql
insert into public.admins (user_id, full_name)
values ('PASTE-USER-UID-DI-SINI', 'Nama Anda');
```

Tanpa langkah 3, login akan ditolak meski kata sandinya benar.

### Yang bisa dikelola

| Halaman            | Kemampuan                                                          |
| ------------------ | ------------------------------------------------------------------ |
| `/admin`           | Ringkasan statistik dan pendaftaran terbaru                        |
| `/admin/trip`      | Tambah, ubah, hapus trip — termasuk status draf/dibuka/penuh       |
| `/admin/artikel`   | Tulis dan kelola artikel panduan, bisa disimpan sebagai draf       |
| `/admin/galeri`    | Unggah foto ke Supabase Storage, atur urutan, sembunyikan/hapus    |
| `/admin/tim`       | Kelola profil tim: nama, peran, bio, foto, urutan tampil           |
| `/admin/pendaftar` | Lihat data peserta & kontak darurat, ubah status pendaftaran       |
| `/admin/anggota`   | Lihat pendaftar keanggotaan komunitas                              |

Pada halaman Galeri dan Profil Tim, tombol **Ubah** di tiap kartu membuka form
penyuntingan langsung di tempat. Foto bersifat opsional — tanpa foto, galeri menampilkan
gradien bertema kategori dan kartu tim menampilkan inisial berwarna yang dihitung dari
nama (gelar seperti `dr.` diabaikan, jadi "dr. Bagas Prayoga" menjadi **BP**).

### Bagaimana aksesnya dijaga

Ada tiga lapis, dan lapis terluar sengaja **bukan** yang diandalkan:

1. **`src/proxy.ts`** — menyegarkan token dan menendang pengunjung tanpa sesi lebih awal.
   Ini hanya pengecekan optimistik terhadap cookie, bukan batas keamanan.
2. **`requireAdmin()` di [`src/lib/auth.ts`](src/lib/auth.ts)** — memverifikasi token ke
   server Supabase lewat `getUser()` (bukan `getSession()` yang cuma baca cookie) lalu
   memastikan user terdaftar di tabel `admins`. Dipanggil di setiap halaman admin, setiap
   fungsi query admin, dan setiap Server Action.
3. **Row Level Security** — bahkan bila kode aplikasi lolos, database sendiri menolak
   operasi tulis dari user yang `is_admin()`-nya `false`.

> Yang perlu diingat: kunci yang dipakai situs ini adalah **anon key**, yang memang aman
> terekspos ke browser. Yang menjaga data bukan kerahasiaan kunci itu, melainkan RLS.
> Jangan pernah menaruh service role key di variabel berawalan `NEXT_PUBLIC_`.

---

## 4. Struktur proyek

Situs publik dan panel admin dipisah lewat route group, jadi keduanya punya kerangka
halaman sendiri tanpa mengubah URL.

```
src/
├── proxy.ts                        # Penyegaran token + cek optimistik /admin
├── app/
│   ├── layout.tsx                  # Root: html, font, metadata global
│   ├── (public)/                   # ← situs publik, memakai Header & Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Homepage
│   │   ├── tentang-kami/page.tsx
│   │   ├── trip/page.tsx           # Katalog + filter kategori & level
│   │   ├── trip/[slug]/page.tsx    # Detail trip + formulir pendaftaran
│   │   ├── panduan/page.tsx
│   │   ├── galeri/page.tsx
│   │   └── gabung/page.tsx
│   └── admin/                      # ← panel admin
│       ├── login/page.tsx
│       └── (dashboard)/            # semua halaman di sini wajib lolos requireAdmin()
│           ├── layout.tsx          # Sidebar + penjaga sesi
│           ├── page.tsx            # Dasbor
│           ├── trip/               # list, baru, [id]
│           ├── artikel/            # list, baru, [id]
│           ├── galeri/page.tsx
│           ├── tim/page.tsx
│           ├── pendaftar/page.tsx
│           └── anggota/page.tsx
├── components/
│   ├── admin/                      # Sidebar, form CRUD, tabel, tombol hapus
│   ├── about/                      # TeamCard
│   ├── layout/                     # Header, Footer, Logo
│   ├── home/                       # Seksi-seksi homepage
│   ├── trips/                      # TripCard, DifficultyMeter, filter, ikon
│   ├── forms/                      # Field primitives + formulir publik
│   ├── gallery/                    # GalleryTile
│   └── ui/                         # Button, Container, SectionHeading, PageHeader
└── lib/
    ├── auth.ts                     # requireAdmin() — sumber kebenaran otorisasi
    ├── supabase/server.ts          # Client cookie-aware (sesi admin)
    ├── supabaseClient.ts           # Client browser + flag isSupabaseConfigured
    ├── supabaseServer.ts           # Client anonim untuk data publik
    ├── queries.ts                  # Pembacaan publik (fallback ke data contoh)
    ├── actions.ts                  # Server Actions publik: daftar trip & anggota
    ├── admin/
    │   ├── auth-actions.ts         # Masuk & keluar
    │   ├── content-actions.ts      # CRUD trip, artikel, galeri, status pendaftar
    │   └── queries.ts              # Pembacaan data admin
    ├── gallery.ts                  # Query galeri + URL Storage
    ├── team.ts                     # Query profil tim, inisial, URL foto
    ├── seed-data.ts                # Data contoh untuk mode tanpa Supabase
    ├── site.ts                     # Identitas situs & navigasi
    └── utils.ts                    # Format tanggal/rupiah, meta kategori & level
```

## 5. Identitas visual

Palet dan token didefinisikan di `src/app/globals.css` melalui `@theme` (Tailwind v4 —
tidak ada `tailwind.config.js`).

| Token        | Peran                                     |
| ------------ | ----------------------------------------- |
| `forest`     | Warna utama, kanopi hutan hujan tropis    |
| `moss`       | Aksen hijau lumut                         |
| `terracotta` | Aksi/CTA, tanah merah jalur pendakian     |
| `gold`       | Sorotan, cahaya matahari terbit di puncak |
| `granite`    | Teks sekunder, abu batuan gunung          |
| `sand`       | Latar hangat pengganti putih steril       |

Tipografi: **Fraunces** untuk judul, **Plus Jakarta Sans** untuk teks isi.

> **Foto galeri.** Saat ini kartu galeri memakai gradien + ikon kategori sebagai
> placeholder. Untuk memasang foto asli: taruh berkas di `public/galeri/`, lalu isi
> properti `src` pada item di `src/lib/gallery.ts` (mis. `src: "/galeri/prau-sunrise.jpg"`).

---

## 6. Git & GitHub

Repositori ini sudah terhubung ke `origin`. Alur kerja harian:

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "feat: deskripsi perubahan"
```

```bash
git push origin development
```

<details>
<summary>Bila memulai dari repositori kosong (referensi)</summary>

```bash
git init
```

```bash
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
```

```bash
git add . && git commit -m "chore: initial commit"
```

```bash
git branch -M main && git push -u origin main
```

</details>

Sebelum `git add .`, pastikan `git status` **tidak** memuat `.env.local`.
