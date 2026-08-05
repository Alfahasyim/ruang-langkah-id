"use server";

import { redirect } from "next/navigation";
import type { FormState } from "../form-state";
import { createSupabaseSessionClient, isSupabaseConfigured } from "../supabase/server";

export async function signInAdmin(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("lanjut") ?? "/admin");

  if (!email || !password) {
    return { status: "error", message: "Email dan kata sandi wajib diisi." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message:
        "Supabase belum terhubung. Isi .env.local lalu jalankan ulang server sebelum login.",
    };
  }

  const supabase = await createSupabaseSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    // Pesan sengaja tidak membedakan "email tidak ada" dan "sandi salah",
    // supaya tidak bisa dipakai menebak akun mana yang terdaftar.
    return { status: "error", message: "Email atau kata sandi salah." };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message:
        "Akun ini belum terdaftar sebagai admin. Tambahkan user_id-nya ke tabel admins lewat SQL Editor.",
    };
  }

  // Hanya izinkan tujuan internal agar tidak bisa dipakai sebagai open redirect.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAdmin() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
