import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import {
  AdminHeading,
  Badge,
  DataTable,
  EmptyState,
} from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { FormAlert } from "@/components/forms/Fields";
import { ButtonLink } from "@/components/ui/Button";
import { deleteTrip } from "@/lib/admin/content-actions";
import { getAllTrips } from "@/lib/admin/queries";
import { CATEGORY_META, formatDateRange, formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Trip" };

const STATUS_TONE = {
  draft: "neutral",
  open: "success",
  full: "warning",
  closed: "neutral",
  completed: "neutral",
} as const;

const MESSAGES: Record<string, { status: "success" | "error"; text: string }> = {
  tersimpan: { status: "success", text: "Trip berhasil disimpan." },
  terhapus: { status: "success", text: "Trip berhasil dihapus." },
  "gagal-hapus": {
    status: "error",
    text: "Trip gagal dihapus. Kemungkinan masih ada pendaftar yang tertaut.",
  },
};

export default async function AdminTripPage({
  searchParams,
}: PageProps<"/admin/trip">) {
  const params = await searchParams;
  const notice =
    typeof params.pesan === "string" ? MESSAGES[params.pesan] : undefined;

  const trips = await getAllTrips();

  return (
    <>
      <AdminHeading
        title="Trip & Kegiatan"
        description="Kelola katalog open trip. Trip berstatus draf tidak tampil di situs publik."
        action={
          <ButtonLink href="/admin/trip/baru">
            <Plus className="h-4 w-4" aria-hidden />
            Trip baru
          </ButtonLink>
        }
      />

      {notice && (
        <div className="mb-6">
          <FormAlert status={notice.status} message={notice.text} />
        </div>
      )}

      {trips.length === 0 ? (
        <EmptyState
          title="Belum ada trip"
          description="Buat trip pertama untuk mulai menerima pendaftaran dari calon peserta."
          action={
            <ButtonLink href="/admin/trip/baru">
              <Plus className="h-4 w-4" aria-hidden />
              Buat trip
            </ButtonLink>
          }
        />
      ) : (
        <DataTable
          headers={["Trip", "Jadwal", "Level", "Kuota", "Status", "Aksi"]}
        >
          {trips.map((trip) => (
            <tr key={trip.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-forest-950">{trip.title}</p>
                <p className="mt-0.5 text-xs text-granite-500">
                  {CATEGORY_META[trip.category].label} · {trip.location}
                </p>
                <p className="mt-1 text-xs font-medium text-forest-700">
                  {formatRupiah(trip.price)}
                </p>
              </td>
              <td className="px-5 py-4 text-granite-700">
                {formatDateRange(trip.start_date, trip.end_date)}
              </td>
              <td className="px-5 py-4 text-granite-700">
                {trip.difficulty_level}/5
                <span className="mt-0.5 block text-xs text-granite-500">
                  {trip.difficulty_tier}
                </span>
              </td>
              <td className="px-5 py-4 text-granite-700">
                {trip.seats_taken}/{trip.quota}
                <span className="mt-0.5 block text-xs text-granite-500">
                  sisa {trip.seats_remaining}
                </span>
              </td>
              <td className="px-5 py-4">
                <Badge tone={STATUS_TONE[trip.status]}>{trip.status}</Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-1">
                  <Link
                    href={`/admin/trip/${trip.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-forest-700 transition-colors hover:bg-forest-50"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Ubah
                  </Link>
                  {trip.status !== "draft" && (
                    <Link
                      href={`/trip/${trip.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-granite-600 transition-colors hover:bg-sand-100"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      Lihat
                    </Link>
                  )}
                  <DeleteForm
                    action={deleteTrip}
                    confirmMessage={`Hapus trip "${trip.title}"? Semua data pendaftarnya ikut terhapus dan tidak bisa dikembalikan.`}
                  >
                    <input type="hidden" name="id" value={trip.id} />
                  </DeleteForm>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
