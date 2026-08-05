import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { TripCard } from "@/components/trips/TripCard";
import { TripFilterBar } from "@/components/trips/TripFilterBar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { getUpcomingTrips } from "@/lib/queries";
import type { DifficultyTier, TripCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Open Trip & Kegiatan",
  description:
    "Katalog open trip Ruang Langkah Indonesia: pendakian gunung, eksplorasi curug, dan penjelajahan hutan dengan level kesulitan yang transparan.",
};

const CATEGORIES: TripCategory[] = ["gunung", "curug", "hutan"];
const TIERS: DifficultyTier[] = ["Pemula", "Menengah", "Lanjutan"];

export default async function TripPage({ searchParams }: PageProps<"/trip">) {
  const params = await searchParams;

  const rawCategory = typeof params.kategori === "string" ? params.kategori : undefined;
  const rawTier = typeof params.level === "string" ? params.level : undefined;

  const category = CATEGORIES.includes(rawCategory as TripCategory)
    ? (rawCategory as TripCategory)
    : undefined;
  const tier = TIERS.includes(rawTier as DifficultyTier)
    ? (rawTier as DifficultyTier)
    : undefined;

  const allTrips = await getUpcomingTrips();
  const trips = allTrips.filter(
    (trip) =>
      (!category || trip.category === category) &&
      (!tier || trip.difficulty_tier === tier),
  );

  const tierHref = (value?: DifficultyTier) => {
    const query = new URLSearchParams();
    if (category) query.set("kategori", category);
    if (value) query.set("level", value);
    const qs = query.toString();
    return qs ? `/trip?${qs}` : "/trip";
  };

  return (
    <>
      <PageHeader
        eyebrow="Open Trip"
        title="Pilih petualangan yang sesuai dengan langkahmu"
        description="Setiap trip mencantumkan level kesulitan dalam skala 1–5, kuota peserta, dan apa saja yang sudah termasuk — supaya kamu bisa memutuskan dengan mata terbuka."
      >
        <div className="flex flex-col gap-5">
          <TripFilterBar active={category} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold tracking-[0.14em] text-forest-300 uppercase">
              Level
            </span>
            {[undefined, ...TIERS].map((value) => (
              <Link
                key={value ?? "semua"}
                href={tierHref(value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  tier === value
                    ? "bg-gold-300 text-forest-950"
                    : "bg-forest-800/70 text-forest-200 hover:bg-forest-800",
                )}
              >
                {value ?? "Semua level"}
              </Link>
            ))}
          </div>
        </div>
      </PageHeader>

      <section className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <p className="mb-8 text-sm text-granite-600">
            Menampilkan <strong className="text-forest-900">{trips.length}</strong>{" "}
            trip
            {category ? ` kategori ${category}` : ""}
            {tier ? ` untuk level ${tier}` : ""}.
          </p>

          {trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-sand-300 bg-white p-12 text-center">
              <Compass className="mx-auto h-10 w-10 text-granite-300" aria-hidden />
              <p className="mt-4 font-semibold text-forest-900">
                Belum ada trip yang cocok dengan filter ini.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-granite-600">
                Coba longgarkan filternya, atau beri tahu kami tujuan impianmu —
                banyak trip kami lahir dari usulan anggota.
              </p>
              <ButtonLink href="/trip" className="mt-6">
                Tampilkan semua trip
              </ButtonLink>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
