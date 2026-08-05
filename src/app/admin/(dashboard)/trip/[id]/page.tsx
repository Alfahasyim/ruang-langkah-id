import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminUI";
import { TripForm } from "@/components/admin/TripForm";
import { getTripById } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ubah Trip" };

export default async function EditTripPage({
  params,
}: PageProps<"/admin/trip/[id]">) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip) notFound();

  return (
    <div className="max-w-3xl">
      <AdminHeading
        title="Ubah trip"
        description={`${trip.title} · ${trip.seats_taken} dari ${trip.quota} kursi terisi.`}
      />
      <TripForm trip={trip} />
    </div>
  );
}
