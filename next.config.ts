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
      // Foto galeri diunggah langsung dari browser ke Supabase Storage, jadi
      // server action hanya menerima teks (path). Foto tim masih lewat sini,
      // maks 4 MB + overhead multipart.
      //
      // Catatan: menaikkan angka ini tidak menembus batas 4,5 MB body request
      // milik serverless function Vercel — itu batas platform, bukan Next.js.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
