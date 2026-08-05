import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabaseClient";

export { isSupabaseConfigured };

export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
