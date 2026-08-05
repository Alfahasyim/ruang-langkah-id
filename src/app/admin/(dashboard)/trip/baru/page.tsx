import { AdminHeading } from "@/components/admin/AdminUI";
import { TripForm } from "@/components/admin/TripForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Trip Baru" };

export default async function NewTripPage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl">
      <AdminHeading
        title="Buat trip baru"
        description="Simpan sebagai draf dulu bila detailnya belum final — draf tidak tampil di situs publik."
      />
      <TripForm />
    </div>
  );
}
