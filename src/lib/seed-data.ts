import type { Article, Trip } from "./types";

/**
 * Dipakai saat kredensial Supabase belum diisi supaya `npm run dev` langsung
 * menampilkan situs yang utuh. Tanggal dibuat relatif agar demo tidak pernah basi.
 */
function inDays(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

type SeedTrip = Omit<Trip, "seats_remaining" | "difficulty_tier">;

const TIER = ["Pemula", "Pemula", "Menengah", "Lanjutan", "Lanjutan"] as const;

const RAW_TRIPS: SeedTrip[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    slug: "prau-sunrise-camp",
    title: "Prau Sunrise Camp — Golden Sunrise di Bukit Teletubbies",
    category: "gunung",
    location: "Gunung Prau, Dieng",
    province: "Jawa Tengah",
    meeting_point: "Basecamp Patak Banteng, Wonosobo",
    start_date: inDays(18),
    end_date: inDays(19),
    difficulty_level: 2,
    elevation_m: 2590,
    quota: 25,
    seats_taken: 18,
    price: 385000,
    summary:
      "Trip perkenalan paling ramah untuk kamu yang baru pertama bermalam di ketinggian.",
    description:
      "Prau adalah gerbang pertama banyak anggota Ruang Langkah. Treknya pendek, jalurnya jelas, tapi hadiahnya luar biasa: hamparan bukit bergelombang yang memerah saat matahari terbit di balik deretan Sindoro-Sumbing. Kami berangkat sore, mendirikan tenda sebelum gelap, lalu memasak bersama sambil berbagi cerita perjalanan. Sepanjang trip kami menerapkan Leave No Trace penuh — semua sampah turun kembali bersama kita.",
    highlights: [
      "Golden sunrise dengan panorama tujuh gunung",
      "Sesi pengenalan manajemen tenda dan logistik",
      "Trekking malam terpandu dengan rasio 1 leader : 6 peserta",
    ],
    includes: [
      "Tenda kapasitas 4 orang dan matras",
      "Makan 3x, kopi, dan camilan lokal",
      "Simaksi, retribusi, dan parkir",
      "Pemandu bersertifikat dan P3K lengkap",
    ],
    requirements: [
      "Usia minimal 15 tahun",
      "Membawa sleeping bag dan jaket hangat",
      "Sepatu trekking atau sepatu bersol kasar",
    ],
    image_url: null,
    status: "open",
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    slug: "curug-leuwi-hejo-explore",
    title: "Leuwi Hejo Explore — Menyusuri Kolam Zamrud Sentul",
    category: "curug",
    location: "Curug Leuwi Hejo, Sentul",
    province: "Jawa Barat",
    meeting_point: "Stasiun Bogor, pintu keluar utara",
    start_date: inDays(9),
    end_date: null,
    difficulty_level: 1,
    elevation_m: 480,
    quota: 20,
    seats_taken: 11,
    price: 165000,
    summary:
      "Satu hari penuh air jernih, batu granit raksasa, dan tawa yang menggema di lembah.",
    description:
      "Rangkaian Leuwi Hejo, Leuwi Cepet, dan Leuwi Baliner tersambung oleh jalur setapak yang teduh. Trip ini kami rancang untuk keluarga dan pendatang baru: jalan kaki santai sekitar 45 menit, lalu waktu bebas berenang di kolam alami berwarna hijau zamrud. Sebelum pulang, kami selalu menyisihkan 30 menit untuk memungut sampah di sepanjang aliran sungai.",
    highlights: [
      "Tiga curug dalam satu jalur susur sungai",
      "Sesi foto bawah air bersama tim dokumentasi",
      "Aksi bersih sungai 30 menit sebelum pulang",
    ],
    includes: [
      "Tiket masuk dan asuransi harian",
      "Pemandu lokal dan life vest",
      "Makan siang nasi liwet Sunda",
    ],
    requirements: [
      "Bisa berenang dasar atau bersedia memakai life vest",
      "Membawa baju ganti dan dry bag",
    ],
    image_url: null,
    status: "open",
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    slug: "halimun-salak-forest-walk",
    title: "Halimun Salak Forest Walk — Rimba, Kabut, dan Owa Jawa",
    category: "hutan",
    location: "TN Gunung Halimun Salak",
    province: "Jawa Barat",
    meeting_point: "Kantor Resort Cikaniki, Bogor",
    start_date: inDays(31),
    end_date: inDays(32),
    difficulty_level: 3,
    elevation_m: 1100,
    quota: 16,
    seats_taken: 7,
    price: 620000,
    summary:
      "Berjalan pelan di hutan hujan tertua Jawa Barat sambil belajar membaca jejak satwa.",
    description:
      "Bukan trip untuk mengejar puncak, tapi untuk memperlambat langkah. Kami menyusuri canopy trail Cikaniki, mendengarkan panggilan owa jawa di pagi buta, dan belajar mengenali pohon rasamala serta tumbuhan obat bersama pendamping dari komunitas Kasepuhan. Malamnya kami menginap di rumah warga — porsi terbesar dari biaya trip ini kembali ke ekonomi desa penyangga.",
    highlights: [
      "Canopy trail sepanjang 100 meter di ketinggian 25 meter",
      "Pengamatan owa jawa dan elang jawa bersama ranger",
      "Menginap di rumah warga Kasepuhan Citalahab",
    ],
    includes: [
      "Homestay 1 malam dan makan 4x",
      "Ranger taman nasional dan pemandu interpretasi",
      "Simaksi dan kontribusi konservasi",
    ],
    requirements: [
      "Sanggup berjalan 6–8 km di medan berlumpur",
      "Membawa jas hujan dan senter kepala",
      "Dilarang membawa speaker aktif",
    ],
    image_url: null,
    status: "open",
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    slug: "gede-pangrango-classic",
    title: "Gede Pangrango Classic — Kawah, Alun-alun Suryakencana",
    category: "gunung",
    location: "Gunung Gede, Cianjur",
    province: "Jawa Barat",
    meeting_point: "Basecamp Gunung Putri, Cianjur",
    start_date: inDays(46),
    end_date: inDays(48),
    difficulty_level: 4,
    elevation_m: 2958,
    quota: 18,
    seats_taken: 18,
    price: 950000,
    summary:
      "Tiga hari menembus hutan montana menuju padang edelweis Suryakencana.",
    description:
      "Jalur klasik Gunung Putri–Suryakencana–Puncak Gede–Cibodas. Trip ini menuntut fisik yang siap: total 18 km dengan beda ketinggian lebih dari 1.400 meter. Sebagai gantinya, kamu akan berkemah di tengah 50 hektar padang edelweis dan menyaksikan kawah aktif dari bibir puncak. Kuota kami batasi ketat dan wajib melewati sesi briefing fisik dua minggu sebelum keberangkatan.",
    highlights: [
      "Berkemah di Alun-alun Suryakencana",
      "Menyaksikan kawah aktif Gunung Gede dari puncak",
      "Turun via Cibodas melewati Air Panas dan Curug Cibeureum",
    ],
    includes: [
      "Simaksi TNGGP dan booking kuota",
      "Tenda, logistik, dan makan 6x",
      "Porter logistik kelompok",
    ],
    requirements: [
      "Pernah mendaki minimal 2 gunung di atas 2.000 mdpl",
      "Wajib hadir briefing fisik H-14",
      "Surat keterangan sehat dari dokter",
    ],
    image_url: null,
    status: "full",
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    slug: "curug-cikaso-hidden-canyon",
    title: "Cikaso Hidden Canyon — Tiga Tirai Air di Sukabumi Selatan",
    category: "curug",
    location: "Curug Cikaso, Sukabumi",
    province: "Jawa Barat",
    meeting_point: "Terminal Surade, Sukabumi",
    start_date: inDays(24),
    end_date: inDays(25),
    difficulty_level: 2,
    elevation_m: 120,
    quota: 22,
    seats_taken: 14,
    price: 475000,
    summary:
      "Naik perahu menyusuri Sungai Cikaso menuju tiga air terjun kembar setinggi 80 meter.",
    description:
      "Cikaso hanya bisa dicapai dengan perahu kayu menyusuri sungai berwarna teh. Setibanya di sana, tiga tirai air—Asepan, Meong, dan Aki—jatuh berdampingan ke kolam yang luas. Kami menambahkan satu malam di pesisir Ujung Genteng untuk melihat pelepasan tukik bersama konservasi penyu setempat.",
    highlights: [
      "Perahu tradisional menyusuri Sungai Cikaso",
      "Pelepasan tukik bersama konservasi Ujung Genteng",
      "Sunset di pantai berpasir putih Pangumbahan",
    ],
    includes: [
      "Transport lokal dan perahu",
      "Penginapan 1 malam dan makan 4x",
      "Donasi konservasi penyu",
    ],
    requirements: [
      "Membawa sandal gunung anti-selip",
      "Tidak menggunakan flash saat pelepasan tukik",
    ],
    image_url: null,
    status: "open",
  },
  {
    id: "11111111-1111-4111-8111-111111111106",
    slug: "rinjani-summit-expedition",
    title: "Rinjani Summit Expedition — Danau Segara Anak & Puncak 3.726",
    category: "gunung",
    location: "Gunung Rinjani, Lombok",
    province: "Nusa Tenggara Barat",
    meeting_point: "Bandara Lombok (LOP)",
    start_date: inDays(72),
    end_date: inDays(76),
    difficulty_level: 5,
    elevation_m: 3726,
    quota: 12,
    seats_taken: 5,
    price: 3450000,
    summary:
      "Ekspedisi lima hari untuk pendaki berpengalaman: Sembalun, Segara Anak, hingga Senaru.",
    description:
      "Jalur lintas Sembalun–Senaru adalah ujian nyata: bukit penyesalan, summit attack pukul dua pagi di pasir vulkanik, lalu turun ke Danau Segara Anak untuk berendam di air panas alami. Kami menerapkan rasio 1 leader : 4 peserta, membawa oksigen portabel, dan bekerja sama dengan porter lokal yang dibayar sesuai standar upah Asosiasi Porter Rinjani.",
    highlights: [
      "Summit attack ke puncak tertinggi ketiga di Indonesia",
      "Bermalam di tepi Danau Segara Anak",
      "Kemitraan adil dengan porter dan guide lokal",
    ],
    includes: [
      "Tiket masuk TN Gunung Rinjani dan asuransi ekspedisi",
      "Porter, guide, tenda, dan makan 12x",
      "Transport bandara–basecamp pulang pergi",
    ],
    requirements: [
      "Pengalaman minimal 3 gunung di atas 3.000 mdpl",
      "Lolos tes fisik: 5 km lari di bawah 35 menit",
      "Asuransi perjalanan pribadi aktif",
    ],
    image_url: null,
    status: "open",
  },
];

export const SEED_TRIPS: Trip[] = RAW_TRIPS.map((trip) => ({
  ...trip,
  seats_remaining: Math.max(trip.quota - trip.seats_taken, 0),
  difficulty_tier: TIER[trip.difficulty_level - 1],
}));

export const SEED_ARTICLES: Article[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    slug: "layering-system-untuk-gunung-tropis",
    title: "Layering System untuk Gunung Tropis: Kenapa Katun Itu Musuh",
    category: "perlengkapan",
    excerpt:
      "Suhu puncak bisa menyentuh 3°C sementara kaki gunung masih 28°C. Pelajari tiga lapis pakaian yang membuat tubuhmu tetap kering dan hangat.",
    read_minutes: 7,
    author: "Rama Wijanarko",
    published_at: inDays(-12),
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    slug: "tujuh-prinsip-leave-no-trace",
    title: "Tujuh Prinsip Leave No Trace dan Cara Menerapkannya di Indonesia",
    category: "etika",
    excerpt:
      "Dari mengelola sampah organik sampai etika berfoto di padang edelweis — panduan praktis yang kami pakai di setiap trip.",
    read_minutes: 9,
    author: "Sari Nurhaliza",
    published_at: inDays(-26),
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    slug: "mengenali-gejala-hipotermia",
    title: "Mengenali Gejala Hipotermia Sebelum Terlambat",
    category: "keselamatan",
    excerpt:
      "Menggigil yang berhenti bukan tanda membaik. Kenali lima tahap hipotermia dan protokol penanganan di lapangan.",
    read_minutes: 6,
    author: "dr. Bagas Prayoga",
    published_at: inDays(-5),
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    slug: "membaca-peta-kontur-tanpa-sinyal",
    title: "Membaca Peta Kontur Tanpa Sinyal: Kompas Masih Relevan",
    category: "navigasi",
    excerpt:
      "GPS di ponsel mati saat baterai habis di suhu dingin. Latih kemampuan dasar orientasi peta dan kompas sebagai jaring pengaman.",
    read_minutes: 11,
    author: "Yoga Pratama",
    published_at: inDays(-40),
  },
  {
    id: "22222222-2222-4222-8222-222222222205",
    slug: "packing-carrier-45-liter",
    title: "Packing Carrier 45 Liter untuk Trip Dua Hari Satu Malam",
    category: "perlengkapan",
    excerpt:
      "Urutan memasukkan barang menentukan titik berat ranselmu. Ikuti pola tiga zona agar bahu tidak cepat lelah.",
    read_minutes: 8,
    author: "Rama Wijanarko",
    published_at: inDays(-18),
  },
  {
    id: "22222222-2222-4222-8222-222222222206",
    slug: "etika-berinteraksi-dengan-warga-desa-penyangga",
    title: "Etika Berinteraksi dengan Warga Desa Penyangga",
    category: "etika",
    excerpt:
      "Kita adalah tamu. Panduan singkat soal izin memotret, berbelanja di warung lokal, dan menghormati aturan adat.",
    read_minutes: 5,
    author: "Sari Nurhaliza",
    published_at: inDays(-33),
  },
];
