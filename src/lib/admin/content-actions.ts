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

async function uploadGalleryFile(
  supabase: Awaited<ReturnType<typeof createSupabaseSessionClient>>,
  file: File,
  caption: string,
  suffix: string,
) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${slugify(caption).slice(0, 40)}-${Date.now()}${suffix}.${extension}`;

  const { error } = await supabase.storage
    .from("galeri")
    .upload(path, file, { contentType: file.type, upsert: false });

  return { path, error };
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
  const baseSortOrder = Number(text(formData, "sort_order") || 0);

  // Input file memakai `multiple` hanya saat menambah item baru; saat
  // mengubah item lama, browser tetap boleh mengirim beberapa berkas kalau
  // markup-nya diubah manual, jadi kita batasi ke berkas pertama saja di sana.
  const uploadedFiles = (formData.getAll("image") as File[]).filter(
    (file) => file instanceof File && file.size > 0,
  );
  const files = id ? uploadedFiles.slice(0, 1) : uploadedFiles;

  const fieldErrors: Record<string, string> = {};
  if (caption.length < 5) fieldErrors.caption = "Keterangan minimal 5 karakter.";
  if (!location) fieldErrors.location = "Lokasi wajib diisi.";
  if (!CATEGORIES.includes(category)) fieldErrors.category = "Pilih kategori.";

  if (files.length > MAX_GALLERY_FILES) {
    fieldErrors.image = `Maksimal ${MAX_GALLERY_FILES} foto sekaligus.`;
  } else {
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        fieldErrors.image = "Format harus JPG, PNG, WebP, atau AVIF.";
        break;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        fieldErrors.image = "Setiap berkas maksimal 4 MB.";
        break;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  const supabase = await createSupabaseSessionClient();

  // Mengubah item lama: satu baris, foto opsional menggantikan yang lama.
  if (id) {
    let imagePath: string | undefined;

    if (files[0]) {
      const { path, error: uploadError } = await uploadGalleryFile(
        supabase,
        files[0],
        caption,
        "",
      );
      if (uploadError) {
        console.error("[admin/galleryUpload]", uploadError.message);
        return {
          status: "error",
          message: `Gagal mengunggah foto: ${uploadError.message}`,
        };
      }
      imagePath = path;
    }

    const { error } = await supabase
      .from("gallery")
      .update({
        caption,
        location,
        category,
        sort_order: baseSortOrder,
        is_published: isPublished,
        ...(imagePath ? { image_path: imagePath } : {}),
      })
      .eq("id", id);

    if (error) {
      console.error("[admin/saveGallery]", error.message);
      return { status: "error", message: `Gagal menyimpan: ${error.message}` };
    }

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    revalidatePath("/");
    redirect("/admin/galeri?pesan=tersimpan");
  }

  // Item baru: 0 berkas → satu baris tanpa foto (tampil gradien), 1+ berkas
  // → satu baris per foto, berbagi keterangan/lokasi/kategori yang sama dan
  // bisa diubah satu-satu lewat tombol Ubah setelah tersimpan.
  const entryCount = Math.max(files.length, 1);
  const rows: {
    caption: string;
    location: string;
    category: string;
    sort_order: number;
    is_published: boolean;
    image_path?: string;
  }[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    const file = files[index];
    let imagePath: string | undefined;

    if (file) {
      const { path, error: uploadError } = await uploadGalleryFile(
        supabase,
        file,
        caption,
        entryCount > 1 ? `-${index + 1}` : "",
      );
      if (uploadError) {
        console.error("[admin/galleryUpload]", uploadError.message);
        return {
          status: "error",
          message: `Gagal mengunggah ${file.name}: ${uploadError.message}`,
        };
      }
      imagePath = path;
    }

    rows.push({
      caption: entryCount > 1 ? `${caption} (${index + 1})` : caption,
      location,
      category,
      sort_order: baseSortOrder + index,
      is_published: isPublished,
      ...(imagePath ? { image_path: imagePath } : {}),
    });
  }

  const { error } = await supabase.from("gallery").insert(rows);

  if (error) {
    console.error("[admin/saveGallery]", error.message);
    return { status: "error", message: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect(
    entryCount > 1
      ? `/admin/galeri?pesan=tersimpan-banyak&jumlah=${entryCount}`
      : "/admin/galeri?pesan=tersimpan",
  );
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const imagePath = String(formData.get("image_path") ?? "");
  if (!id) return;

  const supabase = await createSupabaseSessionClient();
  await supabase.from("gallery").delete().eq("id", id);

  if (imagePath) {
    await supabase.storage.from("galeri").remove([imagePath]);
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/admin/galeri?pesan=terhapus");
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
