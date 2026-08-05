import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Komunitas Petualangan Alam`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    "komunitas pendaki",
    "open trip gunung",
    "eksplorasi curug",
    "penjelajahan hutan",
    "leave no trace",
    "Ruang Langkah Indonesia",
  ],
  openGraph: {
    title: `${SITE.name} — Komunitas Petualangan Alam`,
    description: SITE.description,
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-sand-50"
        >
          Lompat ke konten utama
        </a>
        <Header />
        <main id="konten-utama" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
