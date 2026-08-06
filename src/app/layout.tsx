import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings, siteAssetUrl } from "@/lib/settings";
import { SITE } from "@/lib/site";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Nama dan logo diambil dari pengaturan yang bisa diubah admin, jadi metadata
 * harus dihitung per request — bukan konstanta seperti sebelumnya.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const logoUrl = siteAssetUrl(settings.logo_path);
  const title = `${settings.name} — Komunitas Petualangan Alam`;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      template: `%s · ${settings.short_name}`,
    },
    description: SITE.description,
    keywords: [
      "komunitas pendaki",
      "open trip gunung",
      "eksplorasi curug",
      "penjelajahan hutan",
      "leave no trace",
      settings.name,
    ],
    // Logo unggahan dipakai sebagai favicon; tanpa logo, Next.js jatuh ke
    // berkas app/favicon.ico bawaan.
    ...(logoUrl ? { icons: { icon: logoUrl, apple: logoUrl } } : {}),
    openGraph: {
      title,
      description: SITE.description,
      locale: "id_ID",
      type: "website",
      ...(logoUrl ? { images: [logoUrl] } : {}),
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
