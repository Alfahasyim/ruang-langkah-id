import type { TripCategory } from "./types";

export type GalleryItem = {
  id: string;
  caption: string;
  location: string;
  category: TripCategory;
  /** Ganti dengan foto asli komunitas: taruh di /public/galeri lalu isi path-nya. */
  src?: string;
};

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    caption: "Menunggu kabut buyar di Bukit Teletubbies",
    location: "Gunung Prau, Dieng",
    category: "gunung",
  },
  {
    id: "g2",
    caption: "Kolam zamrud yang dingin menusuk",
    location: "Leuwi Hejo, Sentul",
    category: "curug",
  },
  {
    id: "g3",
    caption: "Canopy trail di antara pohon rasamala",
    location: "Halimun Salak, Bogor",
    category: "hutan",
  },
  {
    id: "g4",
    caption: "Sarapan bersama sebelum turun gunung",
    location: "Suryakencana, Gunung Gede",
    category: "gunung",
  },
  {
    id: "g5",
    caption: "Tiga tirai air yang jatuh berbarengan",
    location: "Curug Cikaso, Sukabumi",
    category: "curug",
  },
  {
    id: "g6",
    caption: "Membawa turun 14 kg sampah dari jalur",
    location: "Aksi bersih gunung, Papandayan",
    category: "gunung",
  },
  {
    id: "g7",
    caption: "Belajar mengenali jejak satwa bersama ranger",
    location: "Citalahab, Halimun Salak",
    category: "hutan",
  },
  {
    id: "g8",
    caption: "Langit merah di tepi Segara Anak",
    location: "Gunung Rinjani, Lombok",
    category: "gunung",
  },
];
