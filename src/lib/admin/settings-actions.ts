"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import type { FormState } from "../form-state";
import { parseSocialLinks } from "../social";
import { createSupabaseSessionClient } from "../supabase/server";

/** Path logo dibuat di browser, jadi tetap disaring: nama berkas datar saja. */
const SAFE_PATH = /^[a-z0-9][a-z0-9._-]*$/i;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function saveSiteSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const name = text(formData, "name");
  const shortName = text(formData, "short_name");
  const tagline = text(formData, "tagline");
  const logoPath = text(formData, "logo_path");
  const bannerPath = text(formData, "banner_path");
  const bannerOverlay = Number(text(formData, "banner_overlay") || 55);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 3) fieldErrors.name = "Nama komunitas minimal 3 karakter.";
  if (shortName.length < 2) fieldErrors.short_name = "Nama pendek minimal 2 karakter.";
  if (tagline.length < 10) fieldErrors.tagline = "Tagline minimal 10 karakter.";
  if (logoPath && !SAFE_PATH.test(logoPath))
    fieldErrors.logo = "Nama berkas logo tidak valid.";
  if (bannerPath && !SAFE_PATH.test(bannerPath))
    fieldErrors.banner = "Nama berkas banner tidak valid.";
  if (!Number.isInteger(bannerOverlay) || bannerOverlay < 0 || bannerOverlay > 90)
    fieldErrors.banner_overlay = "Kepekatan harus antara 0 sampai 90.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Beberapa isian perlu diperbaiki sebelum disimpan.",
      fieldErrors,
    };
  }

  const supabase = await createSupabaseSessionClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      name,
      short_name: shortName,
      tagline,
      email: text(formData, "email") || null,
      phone: text(formData, "phone") || null,
      address: text(formData, "address") || null,
      banner_overlay: bannerOverlay,
      updated_at: new Date().toISOString(),
      // Logo & banner hanya ditimpa bila admin mengunggah yang baru; berkas
      // lama dilepas lewat tombol hapus tersendiri.
      ...(logoPath ? { logo_path: logoPath } : {}),
      ...(bannerPath ? { banner_path: bannerPath } : {}),
    })
    .eq("id", 1);

  if (error) {
    console.error("[admin/saveSiteSettings]", error.message);

    // Kolom baru ditambahkan lewat migrasi; tanpa itu seluruh update gagal.
    // Pesan mentah PostgREST tidak memberi tahu apa yang harus dilakukan.
    const missingColumn = /column .* does not exist/i.test(error.message);

    return {
      status: "error",
      message: missingColumn
        ? "Struktur database belum diperbarui. Jalankan ulang supabase/admin.sql di SQL Editor Supabase, lalu coba simpan lagi."
        : `Gagal menyimpan: ${error.message}`,
    };
  }

  // Tautan situs ditulis ulang seluruhnya: hapus yang lama lalu masukkan yang
  // baru. Lebih sederhana daripada melacak perubahan per baris, dan jumlahnya
  // memang sedikit.
  const socials = parseSocialLinks(text(formData, "socials"));

  const { error: deleteError } = await supabase
    .from("social_links")
    .delete()
    .is("team_member_id", null);

  if (deleteError) {
    console.error("[admin/saveSiteSettings/social]", deleteError.message);
    return {
      status: "error",
      message: `Pengaturan tersimpan tapi tautan gagal diperbarui: ${deleteError.message}`,
    };
  }

  if (socials.length > 0) {
    const { error: insertError } = await supabase.from("social_links").insert(
      socials.map((social, index) => ({
        team_member_id: null,
        platform: social.platform,
        label: social.label,
        url: social.url,
        sort_order: index,
      })),
    );

    if (insertError) {
      console.error("[admin/saveSiteSettings/social]", insertError.message);
      return {
        status: "error",
        message: `Pengaturan tersimpan tapi tautan gagal dicatat: ${insertError.message}`,
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin/pengaturan?pesan=tersimpan");
}

export async function removeSiteLogo() {
  await requireAdmin();

  const supabase = await createSupabaseSessionClient();

  const { data } = await supabase
    .from("site_settings")
    .select("logo_path")
    .eq("id", 1)
    .maybeSingle();

  await supabase.from("site_settings").update({ logo_path: null }).eq("id", 1);

  if (data?.logo_path) {
    await supabase.storage.from("situs").remove([data.logo_path]);
  }

  revalidatePath("/", "layout");
  redirect("/admin/pengaturan?pesan=logo-dihapus");
}

/** Mengembalikan beranda ke latar warna bawaan. */
export async function removeSiteBanner() {
  await requireAdmin();

  const supabase = await createSupabaseSessionClient();

  const { data } = await supabase
    .from("site_settings")
    .select("banner_path")
    .eq("id", 1)
    .maybeSingle();

  await supabase.from("site_settings").update({ banner_path: null }).eq("id", 1);

  if (data?.banner_path) {
    await supabase.storage.from("situs").remove([data.banner_path]);
  }

  revalidatePath("/", "layout");
  redirect("/admin/pengaturan?pesan=banner-dihapus");
}
