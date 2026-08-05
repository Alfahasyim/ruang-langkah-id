import type { NextConfig } from "next";

// Foto galeri diambil dari Supabase Storage, jadi host-nya ikut kredensial
// masing-masing proyek — diturunkan dari env, bukan di-hardcode.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https" as const,
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  experimental: {
    serverActions: {
      // Galeri menerima sampai 10 foto sekaligus @ maks 4 MB/berkas (lihat
      // MAX_GALLERY_FILES & MAX_IMAGE_BYTES di lib/admin/content-actions.ts).
      // Batas di sini harus menampung totalnya, bukan satu berkas saja.
      bodySizeLimit: "45mb",
    },
  },
};

export default nextConfig;
