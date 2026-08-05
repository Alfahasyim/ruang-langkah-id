import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Situs tetap harus bisa dirender dengan data contoh sebelum kredensial Supabase diisi,
 * sehingga pemanggil wajib mengecek flag ini alih-alih mengandalkan client yang throw.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local",
    );
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
