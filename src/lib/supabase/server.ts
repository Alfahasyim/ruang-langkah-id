import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export { isSupabaseConfigured };

/**
 * Client Supabase yang membaca & menulis cookie sesi. Dipakai untuk semua hal
 * yang butuh identitas admin — berbeda dari `supabaseServer.ts` yang anonim
 * dan hanya untuk membaca data publik.
 */
export async function createSupabaseSessionClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component tidak boleh menulis cookie. Penyegaran token
            // tetap terjadi di proxy.ts, jadi aman diabaikan di sini.
          }
        },
      },
    },
  );
}
