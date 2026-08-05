import { ArrowRight, Tent } from "lucide-react";
import { TripCard } from "@/components/trips/TripCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Trip } from "@/lib/types";

export function UpcomingTrips({ trips }: { trips: Trip[] }) {
  return (
    <section className="bg-sand-100 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Jadwal Terdekat"
          title="Trip yang sedang membuka kursi"
          description="Kuota dibatasi agar kelompok tetap kecil dan jalur tidak kelebihan beban. Pilih yang cocok dengan level dan waktumu."
          action={
            <ButtonLink href="/trip" variant="outline">
              Lihat semua trip
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          }
        />

        {trips.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-sand-300 bg-white p-12 text-center">
            <Tent className="mx-auto h-10 w-10 text-granite-300" aria-hidden />
            <p className="mt-4 font-semibold text-forest-900">
              Belum ada trip yang dibuka saat ini.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-granite-600">
              Jadwal kuartal berikutnya sedang kami susun. Gabung jadi anggota
              agar mendapat kabar lebih dulu sebelum kuota dibuka untuk umum.
            </p>
            <ButtonLink href="/gabung" className="mt-6">
              Jadi anggota
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
