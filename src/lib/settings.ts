import { SITE } from "./site";
import type { SocialLink } from "./social";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";

export type SiteSettings = {
  name: string;
  short_name: string;
  tagline: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  logo_path: string | null;
  socials: SocialLink[];
};

/**
 * Nilai bawaan dari src/lib/site.ts. Situs harus tetap tampil utuh sebelum
 * Supabase terhubung, jadi database berperan sebagai penimpa — bukan
 * satu-satunya sumber.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  name: SITE.name,
  short_name: SITE.shortName,
  tagline: SITE.tagline,
  email: SITE.email,
  phone: SITE.whatsapp,
  address: SITE.basecamp,
  logo_path: null,
  socials: [],
};

export function siteAssetUrl(path: string | null): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/situs/${path}`;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;

  const supabase = createSupabaseServerClient();

  const [settingsResult, socialsResult] = await Promise.all([
    supabase
      .from("site_settings")
      .select("name, short_name, tagline, email, phone, address, logo_path")
      .eq("id", 1)
      .maybeSingle(),
    supabase
      .from("social_links")
      .select("id, platform, label, url, sort_order")
      .is("team_member_id", null)
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsResult.error) {
    console.error("[settings] gagal memuat:", settingsResult.error.message);
    return DEFAULT_SETTINGS;
  }

  const row = settingsResult.data;

  return {
    name: row?.name || DEFAULT_SETTINGS.name,
    short_name: row?.short_name || DEFAULT_SETTINGS.short_name,
    tagline: row?.tagline || DEFAULT_SETTINGS.tagline,
    email: row?.email ?? DEFAULT_SETTINGS.email,
    phone: row?.phone ?? DEFAULT_SETTINGS.phone,
    address: row?.address ?? DEFAULT_SETTINGS.address,
    logo_path: row?.logo_path ?? null,
    socials: (socialsResult.data ?? []) as SocialLink[],
  };
}
