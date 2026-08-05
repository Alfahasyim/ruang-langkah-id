import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseSessionClient, isSupabaseConfigured } from "./supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
  fullName: string | null;
};

/**
 * Sumber kebenaran untuk otorisasi admin. Proxy hanya melakukan pengecekan
 * optimistik terhadap keberadaan cookie; fungsi inilah yang benar-benar
 * memverifikasi token ke Supabase dan memastikan user terdaftar di tabel
 * `admins`. Panggil di setiap halaman admin dan setiap Server Action.
 *
 * Dibungkus `cache()` agar satu render pass hanya sekali menembak jaringan.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseSessionClient();

  // getUser() memvalidasi token ke server Supabase — jangan pakai getSession()
  // yang hanya membaca cookie dan bisa dipalsukan.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: admin.full_name ?? null,
  };
});

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
