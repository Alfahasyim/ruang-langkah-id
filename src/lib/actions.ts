"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "./form-state";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

const DEMO_MODE_MESSAGE =
  "Supabase belum terhubung. Isi .env.local dengan kredensial proyekmu, lalu jalankan ulang server.";

export async function registerForTrip(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const payload = {
    trip_id: text(formData, "trip_id"),
    full_name: text(formData, "full_name"),
    email: text(formData, "email").toLowerCase(),
    phone: text(formData, "phone"),
    birth_date: text(formData, "birth_date") || null,
    emergency_contact_name: text(formData, "emergency_contact_name"),
    emergency_contact_phone: text(formData, "emergency_contact_phone"),
    experience_level: text(formData, "experience_level"),
    medical_notes: text(formData, "medical_notes") || null,
    notes: text(formData, "notes") || null,
  };

  const fieldErrors: Record<string, string> = {};
  if (payload.full_name.length < 3) fieldErrors.full_name = "Tulis nama lengkap sesuai identitas.";
  if (!EMAIL_PATTERN.test(payload.email)) fieldErrors.email = "Format email belum benar.";
  if (!PHONE_PATTERN.test(payload.phone.replace(/[\s-]/g, "")))
    fieldErrors.phone = "Gunakan nomor WhatsApp aktif, contoh 081234567890.";
  if (payload.emergency_contact_name.length < 3)
    fieldErrors.emergency_contact_name = "Nama kontak darurat wajib diisi.";
  if (!PHONE_PATTERN.test(payload.emergency_contact_phone.replace(/[\s-]/g, "")))
    fieldErrors.emergency_contact_phone = "Nomor kontak darurat belum valid.";
  if (!payload.experience_level) fieldErrors.experience_level = "Pilih level pengalamanmu.";
  if (formData.get("agreement") !== "on")
    fieldErrors.agreement = "Kamu perlu menyetujui pakta keselamatan dan Leave No Trace.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Beberapa isian perlu diperbaiki sebelum dikirim.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { status: "error", message: DEMO_MODE_MESSAGE };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("register_trip", {
    p_trip_id: payload.trip_id,
    p_full_name: payload.full_name,
    p_email: payload.email,
    p_phone: payload.phone,
    p_birth_date: payload.birth_date,
    p_emergency_contact_name: payload.emergency_contact_name,
    p_emergency_contact_phone: payload.emergency_contact_phone,
    p_experience_level: payload.experience_level,
    p_medical_notes: payload.medical_notes,
    p_notes: payload.notes,
  });

  if (error) {
    console.error("[registrations] gagal menyimpan:", error.message);
    return {
      status: "error",
      message:
        error.message.includes("sudah terdaftar")
          ? "Email ini sudah terdaftar pada trip tersebut."
          : "Pendaftaran gagal tersimpan. Coba lagi atau hubungi kami di WhatsApp.",
    };
  }

  revalidatePath("/trip");

  const seatsLeft = (data as { seats_remaining?: number } | null)?.seats_remaining;
  return {
    status: "success",
    message:
      typeof seatsLeft === "number"
        ? `Pendaftaran diterima. Sisa ${seatsLeft} kursi. Tim kami menghubungimu lewat WhatsApp dalam 1x24 jam.`
        : "Pendaftaran diterima. Tim kami menghubungimu lewat WhatsApp dalam 1x24 jam.",
  };
}

export async function joinCommunity(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const payload = {
    full_name: text(formData, "full_name"),
    email: text(formData, "email").toLowerCase(),
    phone: text(formData, "phone"),
    city: text(formData, "city"),
    birth_date: text(formData, "birth_date") || null,
    experience_level: text(formData, "experience_level"),
    interests: formData.getAll("interests").map(String),
    motivation: text(formData, "motivation"),
  };

  const fieldErrors: Record<string, string> = {};
  if (payload.full_name.length < 3) fieldErrors.full_name = "Tulis nama lengkapmu.";
  if (!EMAIL_PATTERN.test(payload.email)) fieldErrors.email = "Format email belum benar.";
  if (!PHONE_PATTERN.test(payload.phone.replace(/[\s-]/g, "")))
    fieldErrors.phone = "Gunakan nomor WhatsApp aktif.";
  if (!payload.city) fieldErrors.city = "Domisili membantu kami mengelompokkan chapter daerah.";
  if (!payload.experience_level) fieldErrors.experience_level = "Pilih level pengalamanmu.";
  if (payload.interests.length === 0)
    fieldErrors.interests = "Pilih minimal satu minat kegiatan.";
  if (payload.motivation.length < 20)
    fieldErrors.motivation = "Ceritakan motivasimu minimal 20 karakter.";
  if (formData.get("agreement") !== "on")
    fieldErrors.agreement = "Kamu perlu menyetujui kode etik komunitas.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Beberapa isian perlu diperbaiki sebelum dikirim.",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured) {
    return { status: "error", message: DEMO_MODE_MESSAGE };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("members").insert(payload);

  if (error) {
    console.error("[members] gagal menyimpan:", error.message);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Email ini sudah terdaftar sebagai anggota. Cek inbox untuk undangan grup."
          : "Pendaftaran gagal tersimpan. Coba beberapa saat lagi.",
    };
  }

  return {
    status: "success",
    message:
      "Selamat bergabung! Cek emailmu untuk tautan grup WhatsApp dan agenda kopdar terdekat.",
  };
}
