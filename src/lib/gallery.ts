import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";
import type { TripCategory } from "./types";

export type GalleryPhoto = {
  id: string;
  image_path: string;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  caption: string;
  location: string;
  category: TripCategory;
  /** Bisa lebih dari satu; tampil sebagai slide. Kosong = tampil gradien. */
  photos: GalleryPhoto[];
};

/** Dipakai saat Supabase belum terhubung supaya halaman galeri tetap utuh. */
export const SEED_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    caption: "Menunggu kabut buyar di Bukit Teletubbies",
    location: "Gunung Prau, Dieng",
    category: "gunung",
    photos: [],
  },
  {
    id: "g2",
    caption: "Kolam zamrud yang dingin menusuk",
    location: "Leuwi Hejo, Sentul",
    category: "curug",
    photos: [],
  },
  {
    id: "g3",
    caption: "Canopy trail di antara pohon rasamala",
    location: "Halimun Salak, Bogor",
    category: "hutan",
    photos: [],
  },
  {
    id: "g4",
    caption: "Sarapan bersama sebelum turun gunung",
    location: "Suryakencana, Gunung Gede",
    category: "gunung",
    photos: [],
  },
  {
    id: "g5",
    caption: "Tiga tirai air yang jatuh berbarengan",
    location: "Curug Cikaso, Sukabumi",
    category: "curug",
    photos: [],
  },
  {
    id: "g6",
    caption: "Membawa turun 14 kg sampah dari jalur",
    location: "Aksi bersih gunung, Papandayan",
    category: "gunung",
    photos: [],
  },
  {
    id: "g7",
    caption: "Belajar mengenali jejak satwa bersama ranger",
    location: "Citalahab, Halimun Salak",
    category: "hutan",
    photos: [],
  },
  {
    id: "g8",
    caption: "Langit merah di tepi Segara Anak",
    location: "Gunung Rinjani, Lombok",
    category: "gunung",
    photos: [],
  },
];

export function galleryImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/galeri/${imagePath}`;
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return SEED_GALLERY;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery")
    .select(
      "id, caption, location, category, photos:gallery_photos(id, image_path, sort_order)",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "gallery_photos", ascending: true });

  if (error) {
    console.error("[gallery] gagal memuat:", error.message);
    return SEED_GALLERY;
  }

  return (data ?? []) as GalleryItem[];
}
