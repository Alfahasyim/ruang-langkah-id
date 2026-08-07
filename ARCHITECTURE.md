# Arsitektur & Alur Data

Dokumen teknis untuk memahami dan men-debug proyek ini. Dibuat dari audit kode
aktual, bukan rancangan di atas kertas — setiap klaim di sini bisa ditelusuri ke
berkasnya.

> **Konteks penting:** Next.js App Router mengaburkan batas frontend/backend.
> Satu berkas `.tsx` bisa berisi kode yang jalan di server (Server Component) dan
> mengimpor komponen yang jalan di browser (Client Component). Karena itu bagian
> 1 memetakan batasnya lewat **penanda `"use client"` / `"use server"`**, bukan
> lewat nama folder.

---

## 1. Pemisahan Frontend & Backend

### 1.1 Peta cepat

```
┌─────────────────────────── BROWSER ───────────────────────────┐
│  Client Components ("use client")                             │
│  • Form interaktif, slider foto, menu, popup zoom             │
│  • GalleryForm → unggah berkas LANGSUNG ke Supabase Storage   │
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTP / Server Action call
┌───────────────────────────────▼───────────────────────────────┐
│  SERVER (Vercel)                                              │
│  • proxy.ts .................... cek optimistik rute /admin   │
│  • Server Components ........... render HTML + ambil data     │
│  • lib/queries.ts, lib/gallery.ts, lib/team.ts ... baca publik│
│  • lib/admin/queries.ts ........ baca data admin              │
│  • lib/actions.ts .............. mutasi publik ("use server") │
│  • lib/admin/*-actions.ts ...... mutasi admin  ("use server") │
│  • lib/auth.ts ................. requireAdmin() ← otorisasi   │
└───────────────────────────────┬───────────────────────────────┘
                                │ PostgREST + RLS
┌───────────────────────────────▼───────────────────────────────┐
│  SUPABASE — Postgres + Auth + Storage                         │
│  Row Level Security = benteng terakhir                        │
└───────────────────────────────────────────────────────────────┘
```

### 1.2 FRONTEND

| Bagian | Lokasi | Catatan |
| --- | --- | --- |
| **Halaman publik** | `src/app/(public)/` | 8 berkas: beranda, tentang-kami, trip, trip/[slug], panduan, galeri, gabung, not-found |
| **Kerangka publik** | `src/app/(public)/layout.tsx` | Header + Footer + skip-link |
| **Halaman admin** | `src/app/admin/(dashboard)/` | 12 berkas: dasbor, trip (list/baru/[id]), artikel (list/baru/[id]), galeri, tim, pendaftar, anggota, pengaturan |
| **Kerangka admin** | `src/app/admin/(dashboard)/layout.tsx` | Sidebar + **penjaga sesi** (`requireAdmin()`) |
| **Halaman login** | `src/app/admin/login/page.tsx` | Sengaja di luar `(dashboard)` supaya tidak kena penjaga sesi |
| **Root layout** | `src/app/layout.tsx` | Hanya `<html>`, `<body>`, font, metadata global |
| **Komponen UI umum** | `src/components/ui/` | Button, Container, PageHeader, SectionHeading, Lightbox, Zoomable, SocialIcon |
| **Komponen publik** | `src/components/home/`, `trips/`, `gallery/`, `about/`, `layout/`, `forms/` | |
| **Komponen admin** | `src/components/admin/` | Sidebar, form CRUD, editor tautan sosial, unggah gambar, tabel |
| **Styling** | `src/app/globals.css` | Tailwind v4 — palet & font didefinisikan di blok `@theme`, bukan `tailwind.config.js` |

**Route group `(public)` dan `(dashboard)` tidak muncul di URL.** Keduanya hanya
alat untuk memberi dua kerangka halaman yang berbeda. `/admin/(dashboard)/tim/page.tsx`
tetap diakses sebagai `/admin/tim`.

#### Client Components (16 berkas — kode yang benar-benar jalan di browser)

```
src/components/admin/AdminSidebar.tsx      ← butuh usePathname untuk state aktif
src/components/admin/ArticleForm.tsx       ← useActionState
src/components/admin/DeleteForm.tsx        ← window.confirm sebelum submit
src/components/admin/GalleryForm.tsx       ← unggah langsung ke Storage
src/components/admin/ImageUploadField.tsx  ← unggah satu berkas (tim & logo)
src/components/admin/LoginForm.tsx
src/components/admin/SiteSettingsForm.tsx
src/components/admin/SocialLinksEditor.tsx ← baris tautan dinamis
src/components/admin/TeamForm.tsx
src/components/admin/TripForm.tsx
src/components/forms/MembershipForm.tsx
src/components/forms/TripRegistrationForm.tsx
src/components/gallery/GalleryTile.tsx     ← state slider
src/components/layout/Header.tsx           ← menu mobile
src/components/ui/Lightbox.tsx             ← <dialog> + navigasi keyboard
src/components/ui/Zoomable.tsx
```

Sisanya Server Component. Kalau ragu suatu komponen jalan di mana: **cari
`"use client"` di baris pertama berkasnya.**

### 1.3 BACKEND

| Peran | Berkas | Isi |
| --- | --- | --- |
| **Otorisasi (inti)** | `src/lib/auth.ts` | `getAdminSession()`, `requireAdmin()` |
| **Autentikasi (login/logout)** | `src/lib/admin/auth-actions.ts` | `signInAdmin()`, `signOutAdmin()` |
| **Pelindung rute** | `src/proxy.ts` | Cek optimistik `/admin/:path*` + penyegaran token |
| **Mutasi publik** | `src/lib/actions.ts` | `registerForTrip()`, `joinCommunity()` |
| **Mutasi admin** | `src/lib/admin/content-actions.ts` | 10 Server Action CRUD |
| **Pengaturan situs** | `src/lib/admin/settings-actions.ts` | `saveSiteSettings()`, `removeSiteLogo()` |
| **Baca publik** | `src/lib/queries.ts`, `gallery.ts`, `team.ts`, `settings.ts` | Data untuk halaman publik |
| **Baca admin** | `src/lib/admin/queries.ts` | Data untuk panel admin |
| **Skema database** | `supabase/schema.sql`, `admin.sql`, `seed.sql` | Tabel, RLS, fungsi SQL |

#### Tiga client Supabase — jangan tertukar

Ini sumber bug yang paling mudah terjadi. Salah pilih client = data bocor atau
query gagal tanpa pesan jelas.

| Client | Berkas | Identitas | Dipakai di |
| --- | --- | --- | --- |
| `createSupabaseServerClient()` | `src/lib/supabaseServer.ts` | **Anonim** | `lib/queries.ts`, `lib/gallery.ts`, `lib/team.ts`, `lib/actions.ts` |
| `createSupabaseSessionClient()` | `src/lib/supabase/server.ts` | **Admin login** (baca cookie) | `lib/auth.ts`, `lib/admin/queries.ts`, `lib/admin/content-actions.ts`, `lib/admin/auth-actions.ts` |
| `createSupabaseBrowserClient()` | `src/lib/supabaseClient.ts` | Sesi browser | `components/admin/GalleryForm.tsx`, `ImageUploadField.tsx` (khusus unggah berkas) |

> **Aturan praktis:** kalau kode Anda butuh tahu *siapa* yang sedang mengakses,
> pakai `createSupabaseSessionClient()`. Kalau hanya menampilkan data publik,
> pakai `createSupabaseServerClient()` — ia sengaja anonim supaya RLS otomatis
> menyaring data yang belum terbit.

---

## 2. Pemetaan Integrasi Database

### 2.1 Tabel di Supabase

| Tabel | Isi | Sumber SQL |
| --- | --- | --- |
| `trips` | Katalog kegiatan | `schema.sql` |
| `registrations` | Pendaftaran peserta per trip | `schema.sql` |
| `members` | Pendaftaran keanggotaan | `schema.sql` |
| `articles` | Artikel panduan | `schema.sql` |
| `gallery` | Entri galeri (satu momen) | `admin.sql` |
| `gallery_photos` | Foto milik satu entri (relasi anak) | `admin.sql` |
| `team_members` | Profil tim | `admin.sql` |
| `site_settings` | Identitas, kontak, logo, dan banner situs (baris tunggal) | `admin.sql` |
| `social_links` | Tautan sosial; `team_member_id` NULL = milik situs | `admin.sql` |
| `admins` | Daftar user yang boleh masuk panel | `admin.sql` |

**Bucket Storage:** `galeri` (foto galeri), `tim` (foto profil tim), `situs` (logo & banner). Ketiganya publik untuk dibaca.

**Fungsi SQL:** `register_trip()` (transaksi pendaftaran), `is_admin()` (dipakai
di dalam policy RLS), `set_updated_at()` (trigger).

### 2.2 Berkas ➔ Tabel ➔ Fungsi

#### A. Baca publik (client anonim)

| Berkas | Tabel | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/lib/queries.ts` | `trips` | `getUpcomingTrips(limit?)` | **Read** — trip mendatang, status ≠ draft |
| | `trips` | `getTripsByCategory(category)` | **Read** — filter kategori |
| | `trips` | `getTripBySlug(slug)` | **Read** — detail satu trip |
| | `articles` | `getArticles()` | **Read** — artikel terbit |
| `src/lib/gallery.ts` | `gallery` + `gallery_photos` | `getGallery()` | **Read** — entri terbit beserta fotonya (nested select) |
| `src/lib/team.ts` | `team_members` + `social_links` | `getTeam()` | **Read** — profil tim terbit beserta tautannya |
| `src/lib/settings.ts` | `site_settings` + `social_links` | `getSiteSettings()` | **Read** — identitas situs, fallback ke `site.ts` |

Ketiganya punya **fallback ke data contoh** (`seed-data.ts`, `SEED_GALLERY`,
`SEED_TEAM`) bila Supabase belum terhubung atau query gagal. Karena itu situs
tetap tampil utuh tanpa `.env.local` — berguna saat debug: kalau halaman publik
tampil normal tapi datanya "itu-itu saja", kemungkinan besar koneksi Supabase-nya
yang bermasalah, bukan komponennya.

#### B. Mutasi publik (client anonim, tanpa login)

| Berkas | Tabel | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/lib/actions.ts` | `registrations` (via RPC) | `registerForTrip()` | **Insert** — lewat `rpc("register_trip")` |
| | `members` | `joinCommunity()` | **Insert** langsung |

`registerForTrip()` sengaja tidak melakukan `insert` langsung. Ia memanggil
fungsi SQL `register_trip()` yang mengunci baris trip (`select … for update`)
supaya kuota tidak kelebihan ketika dua orang mendaftar bersamaan, dan otomatis
memberi status `waitlist` bila kuota habis. **Logika bisnis kuota ada di
database, bukan di TypeScript** — kalau ada anomali kuota, periksa
`supabase/schema.sql`, bukan `lib/actions.ts`.

#### C. Baca admin (client bersesi — semua lewat `requireAdmin()`)

| Berkas | Tabel | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/lib/admin/queries.ts` | `trips` | `getAllTrips()` | **Read** — termasuk draf & arsip |
| | `trips` | `getTripById(id)` | **Read** |
| | `articles` | `getAllArticles()` | **Read** — termasuk draf |
| | `articles` | `getArticleById(id)` | **Read** |
| | `gallery` + `gallery_photos` | `getGalleryRows()` | **Read** |
| | `team_members` + `social_links` | `getTeamRows()` | **Read** |
| | `registrations` + `trips` | `getRegistrations()` | **Read** — join judul trip |
| | `members` | `getMembers()` | **Read** |
| | `trips`,`registrations`,`members`,`articles` | `getDashboardStats()` | **Read** — 5 hitungan paralel |

#### D. Mutasi admin (client bersesi — semua lewat `requireAdmin()`)

| Berkas | Tabel | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/lib/admin/content-actions.ts` | `trips` | `saveTrip()` | **Insert / Update** |
| | `trips` | `deleteTrip()` | **Delete** |
| | `articles` | `saveArticle()` | **Insert / Update** |
| | `articles` | `deleteArticle()` | **Delete** |
| | `gallery` + `gallery_photos` | `saveGalleryItem()` | **Insert / Update** entri, **Insert** foto |
| | `gallery` + Storage `galeri` | `deleteGalleryItem()` | **Delete** entri + berkas |
| | `gallery_photos` + Storage `galeri` | `deleteGalleryPhoto()` | **Delete** satu foto |
| | `team_members` + `social_links` | `saveTeamMember()` | **Insert / Update** profil, tulis ulang tautan |
| | `team_members` + Storage `tim` | `deleteTeamMember()` | **Delete** + hapus berkas |
| | `registrations` | `updateRegistrationStatus()` | **Update** status |
| `src/lib/admin/settings-actions.ts` | `site_settings` + `social_links` | `saveSiteSettings()` | **Update** identitas, tulis ulang tautan |
| | `site_settings` + Storage `situs` | `removeSiteLogo()` | **Update** + hapus berkas |
| | `site_settings` + Storage `situs` | `removeSiteBanner()` | **Update** + hapus berkas |

#### E. Autentikasi

| Berkas | Tabel | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/lib/admin/auth-actions.ts` | `auth.users` + `admins` | `signInAdmin()` | **Read** — verifikasi sandi lalu cek keanggotaan admin |
| | — | `signOutAdmin()` | Hapus sesi |
| `src/lib/auth.ts` | `auth.users` + `admins` | `getAdminSession()` | **Read** — validasi token + cek tabel `admins` |
| `src/proxy.ts` | `auth.users` | `proxy()` | **Read** — `getUser()` untuk cek optimistik |

#### F. Unggah berkas dari browser

| Berkas | Target | Fungsi | Operasi |
| --- | --- | --- | --- |
| `src/components/admin/GalleryForm.tsx` | Storage bucket `galeri` | `handleFiles()` | **Upload** banyak berkas dari browser |
| | Storage bucket `galeri` | `removeStaged()` | **Delete** berkas batal |
| `src/components/admin/ImageUploadField.tsx` | Bucket `tim` / `situs` | `handleFile()` | **Upload** satu berkas dari browser |

**Kenapa tidak lewat Server Action?** Serverless function di Vercel membatasi
body request ke **4,5 MB** — batas platform yang tidak bisa ditembus dengan
menaikkan `serverActions.bodySizeLimit` di `next.config.ts`. Karena itu byte
gambar naik langsung ke Storage dari browser, dan Server Action hanya menerima
daftar *path* berupa teks yang divalidasi ulang di server. **Seluruh** unggahan
gambar memakai jalur ini: galeri, foto tim, dan logo situs.

### 2.3 Alur data lengkap — tiga contoh

**① Pengunjung membuka `/trip`**
```
(public)/trip/page.tsx  [Server Component, revalidate 300]
   └→ lib/queries.ts :: getTripsByCategory()
        └→ createSupabaseServerClient()   ← anonim
             └→ RLS "trips_public_read"   ← draf otomatis tersaring
                  └→ render TripCard (Server) + TripFilterBar (Client)
```

**② Pengunjung mendaftar trip**
```
TripRegistrationForm.tsx  [Client] → useActionState
   └→ lib/actions.ts :: registerForTrip()   ["use server"]
        └→ rpc("register_trip")             ← kunci baris, hitung kuota
             └→ insert registrations        ← status confirmed / waitlist
                  └→ revalidatePath("/trip")
```

**③ Admin menambah entri galeri dengan 5 foto**
```
GalleryForm.tsx  [Client]
   ├─ 1. handleFiles()  → upload 5 berkas LANGSUNG ke Storage
   │                      (RLS "galeri_admin_write" + is_admin())
   ├─ 2. simpan path ke <input type="hidden" name="image_paths">
   └─ 3. submit form
        └→ content-actions.ts :: saveGalleryItem()   ["use server"]
             ├─ requireAdmin()          ← GERBANG OTORISASI
             ├─ parseImagePaths()       ← validasi ulang path dari browser
             ├─ insert gallery          → dapat entryId
             ├─ insert gallery_photos   ← 5 baris, sort_order berurutan
             └─ revalidatePath("/galeri") + redirect
```

---

## 3. Analisis Keamanan Logika

### 3.1 Tiga lapis, dan yang terluar sengaja bukan andalan

| Lapis | Berkas | Perannya | Batas keamanan? |
| --- | --- | --- | --- |
| 1 | `src/proxy.ts` | Cek optimistik cookie, tendang lebih awal, segarkan token | ❌ **Bukan** |
| 2 | `src/lib/auth.ts` → `requireAdmin()` | Validasi token ke server Supabase + cek tabel `admins` | ✅ **Ya** |
| 3 | RLS di Postgres | Menolak operasi bila `is_admin()` = false | ✅ **Ya** (terakhir) |

Dokumentasi Next.js sendiri menyatakan proxy/middleware **tidak boleh** jadi satu-satunya
otorisasi: ia berjalan pada rute yang di-*prefetch* juga, sehingga hanya cocok untuk
pengecekan murah berbasis cookie. Karena itu `proxy.ts` di proyek ini hanya
mempercepat penolakan; yang benar-benar menjaga adalah lapis 2 dan 3.

**Bukti lapis 2 berdiri sendiri:** ketika Supabase belum dikonfigurasi, `proxy.ts`
langsung `return` tanpa memeriksa apa pun — namun seluruh rute `/admin` tetap
membalas redirect ke `/admin/login`, karena penolakan datang dari `requireAdmin()`.

### 3.2 Isi `requireAdmin()` — gerbang sesungguhnya

Berkas: **`src/lib/auth.ts`**

```
getAdminSession()  [dibungkus React cache() — satu render = satu panggilan jaringan]
   ├─ 1. isSupabaseConfigured?          → tidak: null
   ├─ 2. supabase.auth.getUser()        → VALIDASI TOKEN KE SERVER SUPABASE
   ├─ 3. user ada?                      → tidak: null
   ├─ 4. select dari tabel `admins`     → CEK KEANGGOTAAN ADMIN
   └─ 5. terdaftar?                     → tidak: null

requireAdmin()
   └─ session null → redirect("/admin/login")
```

Dua keputusan penting di sini:

1. **`getUser()`, bukan `getSession()`.** `getSession()` hanya membaca cookie dan
   isinya bisa dipalsukan; `getUser()` memverifikasi token ke server Supabase.
2. **Login saja tidak cukup.** User yang berhasil autentikasi tetap ditolak bila
   `user_id`-nya tidak ada di tabel `admins`. Tidak ada halaman pendaftaran admin —
   akun hanya bisa dibuat manual dari Supabase Dashboard.

### 3.3 Di mana otorisasi dipasang (hasil audit)

**Semua 13 Server Action admin memanggil `requireAdmin()` sebagai baris pertama** (10 di `content-actions.ts`, 3 di `settings-actions.ts`):

| Server Action | Guard |
| --- | --- |
| `saveTrip` | ✅ |
| `deleteTrip` | ✅ |
| `saveArticle` | ✅ |
| `deleteArticle` | ✅ |
| `saveGalleryItem` | ✅ |
| `deleteGalleryItem` | ✅ |
| `deleteGalleryPhoto` | ✅ |
| `saveTeamMember` | ✅ |
| `deleteTeamMember` | ✅ |
| `updateRegistrationStatus` | ✅ |
| `saveSiteSettings` | ✅ |
| `removeSiteLogo` | ✅ |
| `removeSiteBanner` | ✅ |

**Semua fungsi baca admin dijaga terpusat.** `src/lib/admin/queries.ts` punya
helper privat:

```ts
async function adminClient() {
  await requireAdmin();               // ← gerbang
  return createSupabaseSessionClient();
}
```

Kesembilan fungsi query memanggilnya, sehingga **halaman admin yang lupa memasang
penjaga tetap tidak akan membocorkan data.**

**Lapis halaman:** `src/app/admin/(dashboard)/layout.tsx` memanggil `requireAdmin()`,
melindungi seluruh 11 halaman di bawahnya sekaligus. Dua halaman yang tidak
melakukan query apa pun (`trip/baru`, `artikel/baru`) memanggilnya lagi secara
eksplisit.

> **Kenapa penjagaan berlapis-lapis begini?** Karena masing-masing menutup celah
> yang berbeda. Layout melindungi *tampilan*; tapi Server Action bisa dipanggil
> langsung lewat HTTP tanpa membuka halamannya sama sekali, jadi ia butuh
> penjaganya sendiri. Fungsi query dijaga terpusat supaya kelalaian di satu
> halaman baru tidak berubah jadi kebocoran data.

### 3.4 Row Level Security — benteng terakhir

| Tabel | Publik (anon) | Admin |
| --- | --- | --- |
| `trips` | SELECT (bukan draf) | ALL |
| `articles` | SELECT (terbit) | ALL |
| `gallery` | SELECT (terbit) | ALL |
| `gallery_photos` | SELECT (induk terbit) | ALL |
| `team_members` | SELECT (terbit) | ALL |
| `registrations` | **INSERT saja** | SELECT / UPDATE / DELETE |
| `members` | **INSERT saja** | SELECT / UPDATE / DELETE |
| `site_settings` | SELECT | UPDATE |
| `social_links` | SELECT | ALL |
| `admins` | — | SELECT baris sendiri |
| Storage `galeri`, `tim`, `situs` | SELECT | INSERT / DELETE |

Yang paling penting: **publik bisa menulis pendaftaran tapi tidak bisa membacanya.**
Data peserta beserta kontak daruratnya tidak akan terbaca oleh siapa pun yang
tidak terdaftar sebagai admin — bahkan jika kode aplikasi punya bug.

Fungsi `is_admin()` dibuat `security definer` dengan `search_path` terkunci,
karena ia dipanggil dari dalam policy RLS dan tidak boleh ikut terkena RLS tabel
`admins` itu sendiri.

### 3.5 Catatan tentang anon key

`NEXT_PUBLIC_SUPABASE_ANON_KEY` **memang dirancang untuk terekspos ke browser**;
itu bukan kebocoran. Yang menjaga data bukan kerahasiaan kunci itu, melainkan RLS.

Konsekuensinya: **jangan pernah menaruh service role key di variabel berawalan
`NEXT_PUBLIC_`**, karena kunci itu menembus seluruh RLS. Saat ini proyek tidak
memakai service role key sama sekali.

### 3.6 Titik yang perlu diperhatikan saat mengembangkan

Ini bukan kerentanan yang aktif, tapi hal-hal yang mudah berubah jadi masalah
kalau kode dikembangkan tanpa menyadarinya:

1. **Berkas yatim di Storage.** Bila admin mengunggah foto lalu menutup tab tanpa
   menyimpan, berkasnya sudah telanjur ada di bucket. `removeStaged()` menangani
   pembatalan eksplisit, tapi tidak menangani tab yang ditutup paksa. Dampaknya
   hanya penumpukan penyimpanan, bukan kebocoran data.
2. **Path dari browser wajib divalidasi.** `parseImagePaths()` memfilter dengan
   regex `^[a-z0-9][a-z0-9._-]*$` supaya tidak ada `../` atau garis miring.
   **Jangan longgarkan regex ini** tanpa memikirkan ulang dampaknya.
3. **Pesan login sengaja kabur.** `signInAdmin()` menjawab "Email atau kata sandi
   salah" tanpa membedakan mana yang keliru, supaya tidak bisa dipakai menebak
   email mana yang terdaftar. Jangan diperjelas demi "UX yang lebih baik".
4. **`site_settings` dibaca dengan `select("*")`, bukan daftar kolom.** Tabel ini
   bertambah kolom setiap ada fitur baru. Menyebut kolom yang belum ada membuat
   PostgREST membalas **HTTP 400** dan *seluruh* baris gagal terbaca — artinya
   nama, kontak, dan logo yang sudah tersimpan ikut hilang sampai migrasi
   dijalankan. Dengan `*`, kolom yang belum ada tinggal jatuh ke nilai bawaan.
   **Jangan ubah kembali menjadi daftar kolom.**
5. **Halaman admin wajib dinamis.** `export const dynamic = "force-dynamic"` ada
   di layout admin dan tiap halamannya. Tanpa ini, halaman yang tidak menyentuh
   cookie bisa ter-*prerender* statis saat build, sehingga hasil pengecekan admin
   ikut ter-cache. Ini pernah benar-benar terjadi di proyek ini dan tertangkap
   saat build.

---

## 4. Referensi cepat untuk debugging

| Gejala | Periksa di sini |
| --- | --- |
| Halaman publik menampilkan data lama | `revalidate` di berkas halaman (300 detik untuk kebanyakan, 3600 untuk `/panduan`) |
| Data yang diedit di admin tidak muncul di situs | `revalidatePath()` di Server Action terkait |
| Situs menampilkan data contoh, bukan data asli | `isSupabaseConfigured` — cek `.env.local`, lalu jalankan ulang dev server |
| Login ditolak padahal sandi benar | `user_id` belum ada di tabel `admins` |
| Query admin mengembalikan array kosong | RLS — pastikan `is_admin()` mengembalikan true untuk user tersebut |
| Unggah foto gagal di produksi | Batas body 4,5 MB Vercel; pastikan unggahan lewat browser, bukan Server Action |
| Kuota trip tidak sesuai | Fungsi SQL `register_trip()` di `supabase/schema.sql` |
| Rute admin bisa diakses tanpa login | `requireAdmin()` di berkasnya — jangan andalkan `proxy.ts` |

### Perintah verifikasi

Audit apakah setiap Server Action admin punya penjaga otorisasi:

```bash
grep -c "await requireAdmin()" src/lib/admin/content-actions.ts
```

Hasilnya harus sama dengan jumlah `export async function` di berkas itu:

```bash
grep -c "^export async function" src/lib/admin/content-actions.ts
```

Lihat semua tabel yang disentuh tiap berkas:

```bash
grep -rn '\.from("' src --include="*.ts" --include="*.tsx"
```
