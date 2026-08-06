import type { Metadata } from "next";
import Link from "next/link";
import {
  Backpack,
  Clock,
  Compass,
  Leaf,
  LifeBuoy,
  PenLine,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArticles } from "@/lib/queries";
import type { ArticleCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Panduan & Tips",
  description:
    "Materi edukasi Ruang Langkah Indonesia: perlengkapan pendakian, etika alam bebas, keselamatan lapangan, dan navigasi dasar.",
};

const CATEGORY_INFO: Record<
  ArticleCategory,
  { label: string; icon: typeof Backpack; accent: string }
> = {
  perlengkapan: {
    label: "Perlengkapan",
    icon: Backpack,
    accent: "bg-forest-100 text-forest-700",
  },
  etika: { label: "Etika Alam Bebas", icon: Leaf, accent: "bg-moss-100 text-forest-700" },
  keselamatan: {
    label: "Keselamatan",
    icon: LifeBuoy,
    accent: "bg-terracotta-100 text-terracotta-700",
  },
  navigasi: { label: "Navigasi", icon: Compass, accent: "bg-gold-100 text-gold-600" },
};

const CATEGORY_KEYS = Object.keys(CATEGORY_INFO) as ArticleCategory[];

const CHECKLIST = [
  "Jaket tahan angin dan lapisan hangat non-katun",
  "Jas hujan atau ponco, bukan payung",
  "Headlamp beserta baterai cadangan",
  "Air minimal 2 liter untuk trek setengah hari",
  "P3K pribadi: plester, antiseptik, obat rutin",
  "Peluit, powerbank, dan kantong sampah",
];

export default async function PanduanPage({ searchParams }: PageProps<"/panduan">) {
  const params = await searchParams;
  const raw = typeof params.kategori === "string" ? params.kategori : undefined;
  const active = CATEGORY_KEYS.includes(raw as ArticleCategory)
    ? (raw as ArticleCategory)
    : undefined;

  const articles = await getArticles();
  const filtered = active
    ? articles.filter((article) => article.category === active)
    : articles;

  return (
    <>
      <PageHeader
        eyebrow="Panduan & Tips"
        title="Pengetahuan yang membuat perjalananmu lebih aman"
        description="Semua materi di sini kami susun dari pengalaman lapangan, evaluasi trip, dan masukan tim medis serta SAR. Baca sebelum berangkat, ulangi setelah pulang."
      >
        <nav className="flex flex-wrap gap-2" aria-label="Filter kategori panduan">
          <Link
            href="/panduan"
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              !active
                ? "border-moss-400 bg-moss-400/15 text-moss-200"
                : "border-forest-700 text-forest-200 hover:border-moss-400/60 hover:text-sand-50",
            )}
          >
            Semua topik
          </Link>
          {CATEGORY_KEYS.map((key) => {
            const info = CATEGORY_INFO[key];
            const isActive = active === key;

            return (
              <Link
                key={key}
                href={`/panduan?kategori=${key}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-moss-400 bg-moss-400/15 text-moss-200"
                    : "border-forest-700 text-forest-200 hover:border-moss-400/60 hover:text-sand-50",
                )}
              >
                <info.icon className="h-4 w-4" aria-hidden />
                {info.label}
              </Link>
            );
          })}
        </nav>
      </PageHeader>

      <section className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => {
              const info = CATEGORY_INFO[article.category];

              return (
                <article
                  key={article.id}
                  className="group flex flex-col rounded-3xl border border-sand-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-forest-200 hover:shadow-lg hover:shadow-forest-900/5"
                >
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${info.accent}`}
                  >
                    <info.icon className="h-3.5 w-3.5" aria-hidden />
                    {info.label}
                  </span>

                  <h2 className="mt-5 text-lg leading-snug font-semibold text-balance text-forest-950">
                    {article.title}
                  </h2>
                  <p className="whitespace-pre-line mt-3 flex-1 text-sm leading-relaxed text-granite-600">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-sand-200 pt-4 text-xs text-granite-500">
                    <span className="inline-flex items-center gap-1.5">
                      <PenLine className="h-3.5 w-3.5" aria-hidden />
                      {article.author}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {article.read_minutes} menit baca
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="rounded-3xl border border-dashed border-sand-300 bg-white p-12 text-center text-sm text-granite-600">
              Belum ada artikel di kategori ini. Materi baru kami terbitkan
              setiap dua minggu.
            </p>
          )}
        </Container>
      </section>

      <section className="border-t border-sand-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Checklist Cepat"
            title="Enam barang yang tidak boleh tertinggal"
            description="Berlaku untuk trek sehari maupun bermalam. Periksa ulang di rumah, bukan di titik kumpul."
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKLIST.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-700 font-display text-sm font-semibold text-sand-50">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-granite-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-3xl border border-terracotta-200 bg-terracotta-50 p-7">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-terracotta-800">
              <LifeBuoy className="h-5 w-5" aria-hidden />
              Bila terjadi keadaan darurat
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-terracotta-800">
              Berhenti di tempat aman, jangan memisahkan diri dari kelompok, dan
              hubungi trip leader lebih dulu. Untuk situasi kritis: Basarnas{" "}
              <strong>115</strong>, ambulans <strong>118</strong>, atau pos
              pendakian terdekat. Pastikan kontak daruratmu tahu rencana
              perjalananmu sebelum berangkat.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
