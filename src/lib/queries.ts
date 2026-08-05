import { SEED_ARTICLES, SEED_TRIPS } from "./seed-data";
import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";
import type { Article, Trip, TripCategory } from "./types";

const TRIP_COLUMNS =
  "id, slug, title, category, location, province, meeting_point, start_date, end_date, difficulty_level, difficulty_tier, elevation_m, quota, seats_taken, seats_remaining, price, summary, description, highlights, includes, requirements, image_url, status";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function sortByStartDate(trips: Trip[]) {
  return [...trips].sort((a, b) => a.start_date.localeCompare(b.start_date));
}

export async function getUpcomingTrips(limit?: number): Promise<Trip[]> {
  if (!isSupabaseConfigured) {
    const upcoming = sortByStartDate(
      SEED_TRIPS.filter((trip) => trip.start_date >= todayISO()),
    );
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("trips")
    .select(TRIP_COLUMNS)
    .neq("status", "draft")
    .gte("start_date", todayISO())
    .order("start_date", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("[trips] gagal memuat dari Supabase:", error.message);
    return limit ? SEED_TRIPS.slice(0, limit) : SEED_TRIPS;
  }

  return (data ?? []) as Trip[];
}

export async function getTripsByCategory(
  category?: TripCategory,
): Promise<Trip[]> {
  const trips = await getUpcomingTrips();
  return category ? trips.filter((trip) => trip.category === category) : trips;
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  if (!isSupabaseConfigured) {
    return SEED_TRIPS.find((trip) => trip.slug === slug) ?? null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("trips")
    .select(TRIP_COLUMNS)
    .eq("slug", slug)
    .neq("status", "draft")
    .maybeSingle();

  if (error) {
    console.error("[trip] gagal memuat detail:", error.message);
    return SEED_TRIPS.find((trip) => trip.slug === slug) ?? null;
  }

  return (data as Trip) ?? null;
}

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured) return SEED_ARTICLES;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, excerpt, read_minutes, author, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[articles] gagal memuat:", error.message);
    return SEED_ARTICLES;
  }

  return (data ?? []) as Article[];
}
