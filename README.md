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

**b. Jalankan skema database.** Buka Dashboard → SQL Editor → New query, tempel seluruh isi
[`supabase/schema.sql`](supabase/schema.sql), lalu Run. Ulangi dengan
[`supabase/seed.sql`](supabase/seed.sql) untuk mengisi data contoh.

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

## 3. Struktur proyek

```
src/
├── app/
│   ├── layout.tsx              # Root layout: font, metadata, Header, Footer
│   ├── page.tsx                # Homepage
│   ├── tentang-kami/page.tsx   # Cerita, visi & misi, profil tim
│   ├── trip/page.tsx           # Katalog open trip + filter kategori & level
│   ├── trip/[slug]/page.tsx    # Detail trip + formulir pendaftaran
│   ├── panduan/page.tsx        # Artikel edukasi + checklist keselamatan
│   ├── galeri/page.tsx         # Galeri perjalanan
│   ├── gabung/page.tsx         # Syarat, keuntungan, formulir anggota
│   └── not-found.tsx
├── components/
│   ├── layout/                 # Header, Footer, Logo
│   ├── home/                   # Seksi-seksi homepage
│   ├── trips/                  # TripCard, DifficultyMeter, filter, ikon kategori
│   ├── forms/                  # Field primitives + dua formulir
│   ├── gallery/                # GalleryTile
│   └── ui/                     # Button, Container, SectionHeading, PageHeader
└── lib/
    ├── supabaseClient.ts       # Client browser + flag isSupabaseConfigured
    ├── supabaseServer.ts       # Client server
    ├── queries.ts              # Pembacaan data (fallback ke data contoh)
    ├── actions.ts              # Server Actions: daftar trip & gabung anggota
    ├── seed-data.ts            # Data contoh untuk mode tanpa Supabase
    ├── site.ts                 # Identitas situs & navigasi
    └── utils.ts                # Format tanggal/rupiah, meta kategori & level
```

## 4. Identitas visual

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

## 5. Git & GitHub

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
