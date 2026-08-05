import { createSupabaseServerClient, isSupabaseConfigured } from "./supabaseServer";

export type TeamMember = {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  /** Path berkas di bucket Storage 'tim'. Null = tampil sebagai inisial berwarna. */
  photo_path: string | null;
};

/** Dipakai saat Supabase belum terhubung supaya halaman Tentang Kami tetap utuh. */
export const SEED_TEAM: TeamMember[] = [
  {
    id: "t1",
    full_name: "Rama Wijanarko",
    role: "Ketua Komunitas & Trip Leader",
    bio: "Pendaki 14 tahun, sertifikasi Wilderness First Responder. Percaya bahwa keputusan turun lebih berani daripada memaksa naik.",
    photo_path: null,
  },
  {
    id: "t2",
    full_name: "Sari Nurhaliza",
    role: "Koordinator Konservasi",
    bio: "Sarjana kehutanan yang menjaga agar setiap trip berdampak baik bagi ekosistem dan ekonomi desa penyangga.",
    photo_path: null,
  },
  {
    id: "t3",
    full_name: "dr. Bagas Prayoga",
    role: "Penanggung Jawab Medis",
    bio: "Dokter umum sekaligus pendaki. Menyusun protokol medis lapangan dan melatih tim P3K di tiap kelompok.",
    photo_path: null,
  },
  {
    id: "t4",
    full_name: "Yoga Pratama",
    role: "Kepala Navigasi & Logistik",
    bio: "Mantan anggota SAR daerah. Memetakan jalur, menyiapkan rencana evakuasi, dan mengajar kelas kompas.",
    photo_path: null,
  },
  {
    id: "t5",
    full_name: "Dinda Maharani",
    role: "Koordinator Anggota Baru",
    bio: "Dulu peserta paling lambat di rombongan, kini memastikan tidak ada pemula yang merasa sendirian di jalur.",
    photo_path: null,
  },
  {
    id: "t6",
    full_name: "Fajar Ramadhan",
    role: "Dokumentasi & Media",
    bio: "Merekam perjalanan tanpa mengganggu satwa maupun merusak vegetasi demi satu frame yang bagus.",
    photo_path: null,
  },
];

/** Warna kartu diputar berdasarkan urutan supaya admin tidak perlu memilih warna. */
export const TEAM_TONES = [
  "bg-forest-700",
  "bg-terracotta-500",
  "bg-gold-500",
  "bg-forest-600",
  "bg-moss-500",
  "bg-granite-600",
];

/** "dr. Bagas Prayoga" → "BP"; gelar depan diabaikan agar inisial tetap bermakna. */
export function initialsOf(fullName: string) {
  const words = fullName
    .split(/\s+/)
    .filter((word) => word.length > 1 && !word.endsWith("."));

  const source = words.length > 0 ? words : fullName.split(/\s+/);

  return source
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function teamPhotoUrl(photoPath: string | null): string | null {
  if (!photoPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/tim/${photoPath}`;
}

export async function getTeam(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured) return SEED_TEAM;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, full_name, role, bio, photo_path")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[team] gagal memuat:", error.message);
    return SEED_TEAM;
  }

  return (data ?? []) as TeamMember[];
}
