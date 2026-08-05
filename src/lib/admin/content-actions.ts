"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import type { FormState } from "../form-state";
import { createSupabaseSessionClient } from "../supabase/server";

const CATEGORIES = ["gunung", "curug", "hutan"];
const TRIP_STATUSES = ["draft", "open", "full", "closed", "completed"];
const ARTICLE_CATEGORIES = ["perlengkapan", "etika", "keselamatan", "navigasi"];
const REGISTRATION_STATUSES = ["pending", "confirmed", "waitlist", "cancelled"];

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function lines(formData: FormData, key: string) {
  return text(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // buang diakritik hasil normalisasi NFD
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function invalid(fieldErrors: Record<string, string>): FormState {
  return {
    status: "error",
    message: "Beberapa isian perlu diperbaiki sebelum disimpan.",
    fieldErrors,
  };
}

// ---------------------------------------------------------------------------
// Trip
// ---------------------------------------------------------------------------

export async function saveTrip(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const category = text(formData, "category");
  const status = text(formData, "status");
  const startDate = text(formData, "start_date");
  const endDate = text(formData, "end_date");
  const difficulty = Number(text(formData, "difficulty_level"));
  const quota = Number(text(formData, "quota"));
  const price = Number(text(formData, "price") || 0);
  const elevation = text(formData, "elevation_m");

  const fieldErrors: Record<string, string> = {};
  if (title.length < 5) fieldErrors.title = "Judul minimal 5 karakter.";
  if (!CATEGORIES.includes(category)) fieldErrors.category = "Pilih kategori.";
  if (!TRIP_STATUSES.includes(status)) fieldErrors.status = "Pilih status.";
  if (!text(formData, "location")) fieldErrors.location = "Lokasi wajib diisi.";
  if (!startDate) fieldErrors.start_date = "Tanggal mulai wajib diisi.";
  if (endDate && endDate < startDate)
    fieldErrors.end_date = "Tanggal selesai tidak boleh sebelum tanggal mulai.";
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5)
    fieldErrors.difficulty_level = "Level kesulitan harus antara 1 sampai 5.";
  if (!Number.isInteger(quota) || quota < 1)
    fieldErrors.quota = "Kuota minimal 1 peserta.";
  if (!Number.isFinite(price) || price < 0)
    fieldErrors.price = "Harga tidak boleh negatif.";
  if (!text(formData, "summary")) fieldErrors.summary = "Ringkasan wajib diisi.";
  if (!text(formData, "description"))
    fieldErrors.description = "Deskripsi wajib diisi.";

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  const payload = {
    slug: slugify(text(formData, "slug") || title),
    title,
    category,
    location: text(formData, "location"),
    province: text(formData, "province") || null,
    meeting_point: text(formData, "meeting_point") || null,
    start_date: startDate,
    end_date: endDate || null,
    difficulty_level: difficulty,
    elevation_m: elevation ? Number(elevation) : null,
    quota,
    price,
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    highlights: lines(formData, "highlights"),
    includes: lines(formData, "includes"),
    requirements: lines(formData, "requirements"),
    status,
  };

  const supabase = await createSupabaseSessionClient();
  const { error } = id
    ? await supabase.from("trips").update(payload).eq("id", id)
    : await supabase.from("trips").insert(payload);

  if (error) {
    console.error("[admin/saveTrip]", error.message);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Slug sudah dipakai trip lain. Ubah slug-nya agar unik."
          : `Gagal menyimpan: ${error.message}`,
    };
  }

  revalidatePath("/admin/trip");
  revalidatePath("/trip");
  revalidatePath("/");
  redirect("/admin/trip?pesan=tersimpan");
}

export async function deleteTrip(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.from("trips").delete().eq("id", id);

  if (error) {
    console.error("[admin/deleteTrip]", error.message);
    redirect("/admin/trip?pesan=gagal-hapus");
  }

  revalidatePath("/admin/trip");
  revalidatePath("/trip");
  revalidatePath("/");
  redirect("/admin/trip?pesan=terhapus");
}

// ---------------------------------------------------------------------------
// Artikel
// ---------------------------------------------------------------------------

export async function saveArticle(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const category = text(formData, "category");
  const readMinutes = Number(text(formData, "read_minutes") || 5);

  const fieldErrors: Record<string, string> = {};
  if (title.length < 5) fieldErrors.title = "Judul minimal 5 karakter.";
  if (!ARTICLE_CATEGORIES.includes(category))
    fieldErrors.category = "Pilih kategori.";
  if (!text(formData, "excerpt")) fieldErrors.excerpt = "Ringkasan wajib diisi.";
  if (!text(formData, "author")) fieldErrors.author = "Nama penulis wajib diisi.";
  if (!Number.isInteger(readMinutes) || readMinutes < 1)
    fieldErrors.read_minutes = "Estimasi baca minimal 1 menit.";

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  const payload = {
    slug: slugify(text(formData, "slug") || title),
    title,
    category,
    excerpt: text(formData, "excerpt"),
    body: text(formData, "body") || null,
    read_minutes: readMinutes,
    author: text(formData, "author"),
    is_published: formData.get("is_published") === "on",
    published_at: text(formData, "published_at") || new Date().toISOString().slice(0, 10),
  };

  const supabase = await createSupabaseSessionClient();
  const { error } = id
    ? await supabase.from("articles").update(payload).eq("id", id)
    : await supabase.from("articles").insert(payload);

  if (error) {
    console.error("[admin/saveArticle]", error.message);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Slug sudah dipakai artikel lain. Ubah slug-nya agar unik."
          : `Gagal menyimpan: ${error.message}`,
    };
  }

  revalidatePath("/admin/artikel");
  revalidatePath("/panduan");
  redirect("/admin/artikel?pesan=tersimpan");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseSessionClient();
  await supabase.from("articles").delete().eq("id", id);

  revalidatePath("/admin/artikel");
  revalidatePath("/panduan");
  redirect("/admin/artikel?pesan=terhapus");
}

// ---------------------------------------------------------------------------
// Galeri
// ---------------------------------------------------------------------------

const MAX_GALLERY_FILES = 10;

/**
 * Berkas foto TIDAK melewati server action ini. Browser mengunggahnya langsung
 * ke Supabase Storage lalu mengirim daftar path-nya ke sini, karena body
 * request ke serverless function Vercel dibatasi 4,5 MB dan batas itu tidak
 * bisa dinaikkan lewat konfigurasi Next.js.
 */
function parseImagePaths(formData: FormData): string[] {
  const raw = text(formData, "image_paths");
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is string => typeof entry === "string")
      // Path dibuat di browser, jadi tetap divalidasi: hanya nama berkas datar
      // di dalam bucket, tanpa "../" atau garis miring yang bisa menunjuk keluar.
      .filter((entry) => /^[a-z0-9][a-z0-9._-]*$/i.test(entry))
      .slice(0, MAX_GALLERY_FILES);
  } catch {
    return [];
  }
}

export async function saveGalleryItem(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id");
  const caption = text(formData, "caption");
  const location = text(formData, "location");
  const category = text(formData, "category");
  const isPublished = formData.get("is_published") === "on";
  const sortOrder = Number(text(formData, "sort_order") || 0);
  const imagePaths = parseImagePaths(formData);

  const fieldErrors: Record<string, string> = {};
  if (caption.length < 5) fieldErrors.caption = "Keterangan minimal 5 karakter.";
  if (!location) fieldErrors.location = "Lokasi wajib diisi.";
  if (!CATEGORIES.includes(category)) fieldErrors.category = "Pilih kategori.";

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  const supabase = await createSupabaseSessionClient();

  const entryPayload = {
    caption,
    location,
    category,
    sort_order: sortOrder,
    is_published: isPublished,
  };

  let entryId = id;

  if (entryId) {
    const { error } = await supabase
      .from("gallery")
      .update(entryPayload)
      .eq("id", entryId);

    if (error) {
      console.error("[admin/saveGallery]", error.message);
      return { status: "error", message: `Gagal menyimpan: ${error.message}` };
    }
  } else {
    const { data, error } = await supabase
      .from("gallery")
      .insert(entryPayload)
      .select("id")
      .single();

    if (error || !data) {
      console.error("[admin/saveGallery]", error?.message);
      return {
        status: "error",
        message: `Gagal menyimpan: ${error?.message ?? "entri tidak terbuat"}`,
      };
    }
    entryId = data.id;
  }

  // Foto baru ditambahkan ke entri, tidak menggantikan yang sudah ada.
  if (imagePaths.length > 0) {
    const { data: existing } = await supabase
      .from("gallery_photos")
      .select("sort_order")
      .eq("gallery_id", entryId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const startOrder = (existing?.[0]?.sort_order ?? -1) + 1;

    const { error } = await supabase.from("gallery_photos").insert(
      imagePaths.map((path, index) => ({
        gallery_id: entryId,
        image_path: path,
        sort_order: startOrder + index,
      })),
    );

    if (error) {
      console.error("[admin/saveGalleryPhotos]", error.message);
      return {
        status: "error",
        message: `Entri tersimpan tapi foto gagal dicatat: ${error.message}`,
      };
    }
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect(
    imagePaths.length > 1
      ? `/admin/galeri?pesan=tersimpan-foto&jumlah=${imagePaths.length}`
      : "/admin/galeri?pesan=tersimpan",
  );
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseSessionClient();

  // Ambil path fotonya dulu supaya berkas di Storage ikut dibersihkan;
  // baris gallery_photos sendiri terhapus otomatis lewat on delete cascade.
  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("image_path")
    .eq("gallery_id", id);

  await supabase.from("gallery").delete().eq("id", id);

  const paths = (photos ?? []).map((photo) => photo.image_path);
  if (paths.length > 0) {
    await supabase.storage.from("galeri").remove(paths);
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/admin/galeri?pesan=terhapus");
}

export async function deleteGalleryPhoto(formData: FormData) {
  await requireAdmin();
  const photoId = String(formData.get("photo_id") ?? "");
  const imagePath = String(formData.get("image_path") ?? "");
  if (!photoId) return;

  const supabase = await createSupabaseSessionClient();
  await supabase.from("gallery_photos").delete().eq("id", photoId);

  if (imagePath) {
    await supabase.storage.from("galeri").remove([imagePath]);
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/admin/galeri?pesan=foto-terhapus");
}

// ---------------------------------------------------------------------------
// Profil tim
// ---------------------------------------------------------------------------

export async function saveTeamMember(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id");
  const fullName = text(formData, "full_name");
  const role = text(formData, "role");
  const bio = text(formData, "bio");
  const file = formData.get("photo") as File | null;

  const fieldErrors: Record<string, string> = {};
  if (fullName.length < 3) fieldErrors.full_name = "Nama minimal 3 karakter.";
  if (!role) fieldErrors.role = "Peran wajib diisi.";
  if (bio.length < 20) fieldErrors.bio = "Bio minimal 20 karakter.";

  const hasUpload = file instanceof File && file.size > 0;
  if (hasUpload) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
      fieldErrors.photo = "Format harus JPG, PNG, WebP, atau AVIF.";
    if (file.size > MAX_IMAGE_BYTES)
      fieldErrors.photo = "Ukuran berkas maksimal 4 MB.";
  }

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  const supabase = await createSupabaseSessionClient();
  let photoPath: string | undefined;

  if (hasUpload) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${slugify(fullName).slice(0, 40)}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("tim")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[admin/teamUpload]", uploadError.message);
      return {
        status: "error",
        message: `Gagal mengunggah foto: ${uploadError.message}`,
      };
    }
    photoPath = path;
  }

  const payload = {
    full_name: fullName,
    role,
    bio,
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: formData.get("is_published") === "on",
    ...(photoPath ? { photo_path: photoPath } : {}),
  };

  const { error } = id
    ? await supabase.from("team_members").update(payload).eq("id", id)
    : await supabase.from("team_members").insert(payload);

  if (error) {
    console.error("[admin/saveTeamMember]", error.message);
    return { status: "error", message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath("/admin/tim");
  revalidatePath("/tentang-kami");
  redirect("/admin/tim?pesan=tersimpan");
}

export async function deleteTeamMember(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const photoPath = String(formData.get("photo_path") ?? "");
  if (!id) return;

  const supabase = await createSupabaseSessionClient();
  await supabase.from("team_members").delete().eq("id", id);

  if (photoPath) {
    await supabase.storage.from("tim").remove([photoPath]);
  }

  revalidatePath("/admin/tim");
  revalidatePath("/tentang-kami");
  redirect("/admin/tim?pesan=terhapus");
}

// ---------------------------------------------------------------------------
// Status pendaftar
// ---------------------------------------------------------------------------

export async function updateRegistrationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !REGISTRATION_STATUSES.includes(status)) return;

  const supabase = await createSupabaseSessionClient();
  await supabase.from("registrations").update({ status }).eq("id", id);

  revalidatePath("/admin/pendaftar");
}
