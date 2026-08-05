import { CategoryStrip } from "@/components/home/CategoryStrip";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { JoinCta } from "@/components/home/JoinCta";
import { UpcomingTrips } from "@/components/home/UpcomingTrips";
import { ValuesSection } from "@/components/home/ValuesSection";
import { getUpcomingTrips } from "@/lib/queries";
import type { TripCategory } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

// Jadwal trip berubah dari dashboard Supabase, bukan dari deploy — segarkan tiap 5 menit.
export const revalidate = 300;

export default async function HomePage() {
  const trips = await getUpcomingTrips();
  const featured = trips.slice(0, 3);

  const counts = trips.reduce(
    (acc, trip) => {
      acc[trip.category] += 1;
      return acc;
    },
    { gunung: 0, curug: 0, hutan: 0 } as Record<TripCategory, number>,
  );

  const nextTrip = trips[0];

  return (
    <>
      <Hero
        nextTripLabel={
          nextTrip
            ? `${nextTrip.location} · ${formatDateRange(nextTrip.start_date, nextTrip.end_date)}`
            : undefined
        }
      />
      <CategoryStrip counts={counts} />
      <ValuesSection />
      <UpcomingTrips trips={featured} />
      <GalleryPreview />
      <JoinCta />
    </>
  );
}
