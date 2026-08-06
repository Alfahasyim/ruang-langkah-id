import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Info,
  MapPin,
  Mountain,
  Sparkles,
  Users,
} from "lucide-react";
import { TripRegistrationForm } from "@/components/forms/TripRegistrationForm";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import { DifficultyMeter } from "@/components/trips/DifficultyMeter";
import { Container } from "@/components/ui/Container";
import { getTripBySlug } from "@/lib/queries";
import {
  CATEGORY_META,
  cn,
  formatDateRange,
  formatRupiah,
  tripDurationLabel,
} from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/trip/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) return { title: "Trip tidak ditemukan" };

  return { title: trip.title, description: trip.summary };
}

export default async function TripDetailPage({
  params,
}: PageProps<"/trip/[slug]">) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) notFound();

  const meta = CATEGORY_META[trip.category];
  const isFull = trip.seats_remaining <= 0;

  const facts = [
    {
      icon: MapPin,
      label: "Lokasi",
      value: [trip.location, trip.province].filter(Boolean).join(", "),
    },
    {
      icon: CalendarDays,
      label: "Tanggal",
      value: `${formatDateRange(trip.start_date, trip.end_date)} · ${tripDurationLabel(trip.start_date, trip.end_date)}`,
    },
    {
      icon: Mountain,
      label: "Ketinggian",
      value: trip.elevation_m
        ? `${trip.elevation_m.toLocaleString("id-ID")} mdpl`
        : "Dataran rendah",
    },
    {
      icon: Users,
      label: "Kuota",
      value: `${trip.seats_taken} dari ${trip.quota} kursi terisi`,
    },
  ];

  return (
    <>
      <section
        className={cn(
          "relative overflow-hidden bg-linear-to-br text-white",
          meta.gradient,
        )}
      >
        <CategoryIcon
          category={trip.category}
          className="absolute -top-10 -right-10 h-72 w-72 text-white/10"
        />
        <div className="absolute inset-0 bg-forest-950/35" aria-hidden />

        <Container className="relative py-16 sm:py-20">
          <Link
            href="/trip"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke katalog trip
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-800">
              <CategoryIcon category={trip.category} className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <span className="rounded-full bg-forest-950/50 px-3 py-1 text-xs font-semibold text-sand-50">
              Level {trip.difficulty_level}/5 · {trip.difficulty_tier}
            </span>
            {isFull && (
              <span className="rounded-full bg-granite-900/70 px-3 py-1 text-xs font-semibold text-sand-100">
                Kuota penuh — buka daftar tunggu
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-3xl leading-tight font-semibold text-balance sm:text-5xl">
            {trip.title}
          </h1>
          <p className="whitespace-pre-line mt-5 max-w-2xl leading-relaxed text-pretty text-white/90">
            {trip.summary}
          </p>
        </Container>
      </section>

      <section className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-2xl font-semibold text-forest-950">
                  Tentang perjalanan ini
                </h2>
                <p className="whitespace-pre-line mt-4 leading-relaxed text-pretty text-granite-700">
                  {trip.description}
                </p>
              </div>

              {trip.highlights.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-semibold text-forest-950">
                    <Sparkles className="h-5 w-5 text-gold-500" aria-hidden />
                    Yang membuatnya berkesan
                  </h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {trip.highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-sand-200 bg-white p-4 text-sm leading-relaxed text-granite-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-8 sm:grid-cols-2">
                {trip.includes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-forest-950">
                      Sudah termasuk
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {trip.includes.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-relaxed text-granite-700"
                        >
                          <CircleCheck
                            className="mt-0.5 h-4 w-4 shrink-0 text-forest-600"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trip.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-forest-950">
                      Syarat peserta
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {trip.requirements.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-relaxed text-granite-700"
                        >
                          <Info
                            className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500"
                            aria-hidden
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="rounded-3xl border border-sand-300 bg-white p-7 shadow-sm">
                <p className="text-xs tracking-wide text-granite-500 uppercase">
                  Kontribusi per peserta
                </p>
                <p className="mt-1 font-display text-3xl font-semibold text-forest-900">
                  {formatRupiah(trip.price)}
                </p>

                <dl className="mt-6 space-y-4 border-t border-sand-200 pt-6">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex gap-3">
                      <fact.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-forest-500"
                        aria-hidden
                      />
                      <div>
                        <dt className="text-xs text-granite-500">{fact.label}</dt>
                        <dd className="text-sm font-medium text-forest-900">
                          {fact.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 border-t border-sand-200 pt-6">
                  <p className="mb-2.5 text-xs text-granite-500">
                    Tingkat kesulitan
                  </p>
                  <DifficultyMeter level={trip.difficulty_level} showCaption />
                </div>

                {trip.meeting_point && (
                  <p className="mt-6 rounded-2xl bg-sand-100 p-4 text-xs leading-relaxed text-granite-600">
                    <strong className="text-forest-900">Titik kumpul:</strong>{" "}
                    {trip.meeting_point}
                  </p>
                )}

                <a
                  href="#formulir"
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-terracotta-500 text-sm font-semibold text-white transition-colors hover:bg-terracotta-600"
                >
                  {isFull ? "Masuk daftar tunggu" : "Daftar sekarang"}
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section id="formulir" className="scroll-mt-28 bg-sand-100 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-terracotta-600 uppercase">
            Formulir Pendaftaran
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-balance text-forest-950">
            Amankan kursimu di {trip.location}
          </h2>
          <p className="mt-4 leading-relaxed text-granite-600">
            Isi data di bawah ini. Tim kami akan menghubungimu lewat WhatsApp
            dalam 1x24 jam untuk konfirmasi pembayaran dan detail keberangkatan.
          </p>

          <div className="mt-9 rounded-3xl border border-sand-300 bg-white p-7 sm:p-9">
            <TripRegistrationForm trip={trip} />
          </div>
        </Container>
      </section>
    </>
  );
}
