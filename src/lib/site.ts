export const SITE = {
  name: "Ruang Langkah Indonesia",
  shortName: "Ruang Langkah",
  tagline: "Melangkah bersama, pulang dengan cerita — dan tanpa meninggalkan jejak.",
  description:
    "Komunitas petualangan alam Indonesia: pendakian gunung, eksplorasi curug, dan penjelajahan hutan dengan standar keselamatan dan prinsip Leave No Trace.",
  email: "halo@ruanglangkah.id",
  whatsapp: "+62 812-3456-7890",
  instagram: "@ruanglangkah.id",
  basecamp: "Jl. Rimbawan No. 17, Bogor, Jawa Barat",
  url: "https://ruanglangkah.id",
};

export const MAIN_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/trip", label: "Open Trip" },
  { href: "/panduan", label: "Panduan & Tips" },
  { href: "/galeri", label: "Galeri" },
] as const;

export const FOOTER_NAV = [
  {
    title: "Jelajah",
    links: [
      { href: "/trip?kategori=gunung", label: "Trip Gunung" },
      { href: "/trip?kategori=curug", label: "Trip Curug" },
      { href: "/trip?kategori=hutan", label: "Trip Hutan" },
      { href: "/galeri", label: "Galeri Perjalanan" },
    ],
  },
  {
    title: "Komunitas",
    links: [
      { href: "/tentang-kami", label: "Cerita Kami" },
      { href: "/tentang-kami#tim", label: "Tim & Trip Leader" },
      { href: "/gabung", label: "Gabung Anggota" },
      { href: "/gabung#keuntungan", label: "Keuntungan Anggota" },
    ],
  },
  {
    title: "Keselamatan",
    links: [
      { href: "/panduan?kategori=keselamatan", label: "Panduan Keselamatan" },
      { href: "/panduan?kategori=perlengkapan", label: "Checklist Perlengkapan" },
      { href: "/panduan?kategori=etika", label: "Etika Alam Bebas" },
      { href: "/panduan?kategori=navigasi", label: "Navigasi Dasar" },
    ],
  },
] as const;
