import { AdminHeading, DataTable, EmptyState } from "@/components/admin/AdminUI";
import { updateRegistrationStatus } from "@/lib/admin/content-actions";
import { getRegistrations } from "@/lib/admin/queries";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pendaftar Trip" };

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu konfirmasi" },
  { value: "confirmed", label: "Terkonfirmasi" },
  { value: "waitlist", label: "Daftar tunggu" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default async function AdminRegistrationsPage() {
  const registrations = await getRegistrations();

  return (
    <>
      <AdminHeading
        title="Pendaftar Trip"
        description="Data peserta beserta kontak darurat. Ubah status setelah pembayaran dikonfirmasi."
      />

      {registrations.length === 0 ? (
        <EmptyState
          title="Belum ada pendaftar"
          description="Pendaftaran dari halaman trip akan langsung muncul di sini."
        />
      ) : (
        <DataTable
          headers={["Peserta", "Trip", "Kontak darurat", "Catatan", "Status"]}
        >
          {registrations.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-forest-950">{row.full_name}</p>
                <p className="mt-0.5 text-xs text-granite-600">{row.email}</p>
                <p className="text-xs text-granite-600">{row.phone}</p>
                <p className="mt-1 text-xs text-granite-500">
                  {row.experience_level}
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="text-forest-900">{row.trips?.title ?? "—"}</p>
                {row.trips && (
                  <p className="mt-0.5 text-xs text-granite-500">
                    {formatDateRange(row.trips.start_date)}
                  </p>
                )}
              </td>
              <td className="px-5 py-4 text-granite-700">
                <p>{row.emergency_contact_name}</p>
                <p className="mt-0.5 text-xs text-granite-500">
                  {row.emergency_contact_phone}
                </p>
              </td>
              <td className="px-5 py-4 text-xs text-granite-600">
                {row.medical_notes && (
                  <p>
                    <span className="font-semibold text-forest-900">Medis:</span>{" "}
                    {row.medical_notes}
                  </p>
                )}
                {row.notes && <p className="mt-1">{row.notes}</p>}
                {!row.medical_notes && !row.notes && (
                  <span className="text-granite-400">—</span>
                )}
              </td>
              <td className="px-5 py-4">
                <form action={updateRegistrationStatus} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="sr-only" htmlFor={`status-${row.id}`}>
                    Status pendaftaran {row.full_name}
                  </label>
                  <select
                    id={`status-${row.id}`}
                    name="status"
                    defaultValue={row.status}
                    className="rounded-lg border border-sand-300 bg-white px-2.5 py-1.5 text-xs text-forest-900"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-forest-700 px-2.5 py-1.5 text-xs font-semibold text-sand-50 transition-colors hover:bg-forest-800"
                  >
                    Perbarui
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
