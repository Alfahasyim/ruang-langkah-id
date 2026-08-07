import Image from "next/image";
import { ArrowRight, CalendarDays, Compass, Leaf } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const STATS = [
  { value: "1.240+", label: "Anggota aktif se-Indonesia" },
  { value: "186", label: "Trip terselenggara sejak 2019" },
  { value: "2,3 ton", label: "Sampah dibawa turun dari jalur" },
  { value: "0", label: "Insiden serius dalam 3 tahun terakhir" },
];

export function Hero({
  nextTripLabel,
  bannerUrl,
  bannerOverlay = 55,
}: {
  nextTripLabel?: string;
  /** Null/undefined = pakai latar warna bawaan (pola topografi). */
  bannerUrl?: string | null;
  bannerOverlay?: number;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-950 text-sand-50">
      {bannerUrl ? (
        <>
          <Image
            src={bannerUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Lapisan gelap menjaga teks putih tetap terbaca di atas foto apa pun.
              Kepekatannya diatur admin karena tiap foto beda tingkat terangnya. */}
          <div
            className="absolute inset-0 bg-forest-950"
            style={{ opacity: bannerOverlay / 100 }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-forest-950/80 via-forest-950/30 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div className="topo-pattern absolute inset-0 opacity-70" aria-hidden />
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-forest-950 to-transparent"
        aria-hidden
      />

      <Container className="relative py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-moss-400/30 bg-moss-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-moss-200">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Komunitas petualangan alam sejak 2019
          </p>

          <h1 className="mt-6 font-display text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl">
            Alam tidak menunggu.
            <span className="block text-moss-300">
              Ambil ranselmu, kita mulai dari satu langkah.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-forest-100 sm:text-lg">
            Ruang Langkah Indonesia mempertemukan pendaki pemula sampai
            berpengalaman untuk menjelajahi gunung, curug, dan hutan Nusantara —
            dengan trip leader bersertifikat, kelompok kecil, dan komitmen tegas
            pada prinsip Leave No Trace.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/trip" variant="secondary" size="lg">
              Gabung Trip Berikutnya
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="/gabung"
              size="lg"
              className="border border-moss-400/40 bg-transparent text-sand-50 hover:bg-moss-400/10"
            >
              Jadi Anggota Komunitas
            </ButtonLink>
          </div>

          {nextTripLabel && (
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-forest-200">
              <CalendarDays className="h-4 w-4 text-gold-300" aria-hidden />
              Keberangkatan terdekat:{" "}
              <span className="font-semibold text-sand-50">{nextTripLabel}</span>
            </p>
          )}
        </div>

        <dl className="mt-16 grid gap-x-6 gap-y-8 border-t border-forest-800 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-3xl font-semibold text-gold-300">
                {stat.value}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-forest-200">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-forest-900/70 px-4 py-2 text-xs text-moss-200">
          <Leaf className="h-3.5 w-3.5" aria-hidden />
          Kuota tiap trip sengaja kami batasi agar jalur tidak kelebihan beban.
        </p>
      </Container>
    </section>
  );
}
