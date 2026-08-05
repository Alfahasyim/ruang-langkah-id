import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";
import type { TripCategory } from "./types";

export type GalleryItem = {
  id: string;
  caption: string;
  location: string;
  category: TripCategory;
  /** Path berkas di bucket Storage 'galeri'. Null = tampil sebagai gradien. */
  image_path: string | null;
};

/** Dipakai saat Supabase belum terhubung supaya halaman galeri tetap utuh. */
export const SEED_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    caption: "Menunggu kabut buyar di Bukit Teletubbies",
    location: "Gunung Prau, Dieng",
    category: "gunung",
    image_path: null,
  },
  {
    id: "g2",
    caption: "Kolam zamrud yang dingin menusuk",
    location: "Leuwi Hejo, Sentul",
    category: "curug",
    image_path: null,
  },
  {
    id: "g3",
    caption: "Canopy trail di antara pohon rasamala",
    location: "Halimun Salak, Bogor",
    category: "hutan",
    image_path: null,
  },
  {
    id: "g4",
    caption: "Sarapan bersama sebelum turun gunung",
    location: "Suryakencana, Gunung Gede",
    category: "gunung",
    image_path: null,
  },
  {
    id: "g5",
    caption: "Tiga tirai air yang jatuh berbarengan",
    location: "Curug Cikaso, Sukabumi",
    category: "curug",
    image_path: null,
  },
  {
    id: "g6",
    caption: "Membawa turun 14 kg sampah dari jalur",
    location: "Aksi bersih gunung, Papandayan",
    category: "gunung",
    image_path: null,
  },
  {
    id: "g7",
    caption: "Belajar mengenali jejak satwa bersama ranger",
    location: "Citalahab, Halimun Salak",
    category: "hutan",
    image_path: null,
  },
  {
    id: "g8",
    caption: "Langit merah di tepi Segara Anak",
    location: "Gunung Rinjani, Lombok",
    category: "gunung",
    image_path: null,
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
    .select("id, caption, location, category, image_path")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[gallery] gagal memuat:", error.message);
    return SEED_GALLERY;
  }

  return (data ?? []) as GalleryItem[];
}
