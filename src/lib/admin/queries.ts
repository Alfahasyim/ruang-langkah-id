import { requireAdmin } from "../auth";
import { createSupabaseSessionClient } from "../supabase/server";
import type { Article, Trip } from "../types";

export type GalleryRow = {
  id: string;
  caption: string;
  location: string;
  category: "gunung" | "curug" | "hutan";
  sort_order: number;
  is_published: boolean;
  photos: { id: string; image_path: string; sort_order: number }[];
};

export type TeamMemberRow = {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  photo_path: string | null;
  sort_order: number;
  is_published: boolean;
};

export type RegistrationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  experience_level: string;
  medical_notes: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "waitlist" | "cancelled";
  created_at: string;
  trips: { title: string; slug: string; start_date: string } | null;
};

export type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  experience_level: string;
  interests: string[];
  motivation: string;
  created_at: string;
};

const TRIP_COLUMNS =
  "id, slug, title, category, location, province, meeting_point, start_date, end_date, difficulty_level, difficulty_tier, elevation_m, quota, seats_taken, seats_remaining, price, summary, description, highlights, includes, requirements, image_url, status";

/** Semua fungsi di sini memanggil requireAdmin() lebih dulu — halaman yang lupa
 *  memeriksa sesi tetap tidak akan kebocoran data. */
async function adminClient() {
  await requireAdmin();
  return createSupabaseSessionClient();
}

export async function getAllTrips(): Promise<Trip[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_COLUMNS)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("[admin/trips]", error.message);
    return [];
  }
  return (data ?? []) as Trip[];
}

export async function getTripById(id: string): Promise<Trip | null> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/trip]", error.message);
    return null;
  }
  return (data as Trip) ?? null;
}

export async function getAllArticles(): Promise<(Article & { is_published: boolean })[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, category, excerpt, body, read_minutes, author, published_at, is_published",
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[admin/articles]", error.message);
    return [];
  }
  return (data ?? []) as (Article & { is_published: boolean })[];
}

export async function getArticleById(id: string) {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, category, excerpt, body, read_minutes, author, published_at, is_published",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/article]", error.message);
    return null;
  }
  return data;
}

export async function getGalleryRows(): Promise<GalleryRow[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("gallery")
    .select(
      "id, caption, location, category, sort_order, is_published, photos:gallery_photos(id, image_path, sort_order)",
    )
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "gallery_photos", ascending: true });

  if (error) {
    console.error("[admin/gallery]", error.message);
    return [];
  }
  return (data ?? []) as GalleryRow[];
}

export async function getTeamRows(): Promise<TeamMemberRow[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, full_name, role, bio, photo_path, sort_order, is_published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[admin/team]", error.message);
    return [];
  }
  return (data ?? []) as TeamMemberRow[];
}

export async function getRegistrations(): Promise<RegistrationRow[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, full_name, email, phone, emergency_contact_name, emergency_contact_phone, experience_level, medical_notes, notes, status, created_at, trips(title, slug, start_date)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/registrations]", error.message);
    return [];
  }
  return (data ?? []) as unknown as RegistrationRow[];
}

export async function getMembers(): Promise<MemberRow[]> {
  const supabase = await adminClient();
  const { data, error } = await supabase
    .from("members")
    .select(
      "id, full_name, email, phone, city, experience_level, interests, motivation, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/members]", error.message);
    return [];
  }
  return (data ?? []) as MemberRow[];
}

export async function getDashboardStats() {
  const supabase = await adminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [trips, upcoming, registrations, members, articles] = await Promise.all([
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .gte("start_date", today)
      .neq("status", "draft"),
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
  ]);

  return {
    trips: trips.count ?? 0,
    upcomingTrips: upcoming.count ?? 0,
    registrations: registrations.count ?? 0,
    members: members.count ?? 0,
    articles: articles.count ?? 0,
  };
}
