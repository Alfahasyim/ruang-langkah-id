import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import {
  AdminHeading,
  Badge,
  DataTable,
  EmptyState,
  StatCard,
} from "@/components/admin/AdminUI";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats, getRegistrations } from "@/lib/admin/queries";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TONE = {
  pending: "warning",
  confirmed: "success",
  waitlist: "neutral",
  cancelled: "danger",
} as const;

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const [stats, registrations] = await Promise.all([
    getDashboardStats(),
    getRegistrations(),
  ]);

  const recent = registrations.slice(0, 8);

  return (
    <>
      <AdminHeading
        title={`Halo, ${session.fullName ?? "Admin"}`}
        description="Ringkasan aktivitas komunitas dan pendaftaran terbaru."
        action={
          <ButtonLink href="/admin/trip/baru">
            <Plus className="h-4 w-4" aria-hidden />
            Trip baru
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Trip mendatang"
          value={stats.upcomingTrips}
          hint={`${stats.trips} trip total termasuk arsip`}
        />
        <StatCard label="Pendaftar trip" value={stats.registrations} />
        <StatCard label="Anggota komunitas" value={stats.members} />
        <StatCard label="Artikel panduan" value={stats.articles} />
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-forest-950">
            Pendaftaran terbaru
          </h2>
          <Link
            href="/admin/pendaftar"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"
          >
            Lihat semua
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="Belum ada pendaftaran"
            description="Pendaftaran yang masuk lewat halaman trip akan muncul di sini."
          />
        ) : (
          <DataTable headers={["Nama", "Trip", "Kontak", "Status"]}>
            {recent.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-medium text-forest-950">{row.full_name}</p>
                  <p className="mt-0.5 text-xs text-granite-500">
                    {new Date(row.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
                  <p>{row.email}</p>
                  <p className="mt-0.5 text-xs text-granite-500">{row.phone}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </>
  );
}
