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
      // Unggahan foto galeri dibatasi 4 MB di server action; beri sedikit
      // kelonggaran untuk overhead multipart.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
