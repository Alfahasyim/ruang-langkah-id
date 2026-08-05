import { AdminHeading, DataTable, EmptyState } from "@/components/admin/AdminUI";
import { getMembers } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Anggota" };

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <>
      <AdminHeading
        title="Anggota Komunitas"
        description="Pendaftar keanggotaan dari halaman Gabung, diurutkan dari yang terbaru."
      />

      {members.length === 0 ? (
        <EmptyState
          title="Belum ada anggota"
          description="Formulir di halaman Gabung akan mengisi daftar ini secara otomatis."
        />
      ) : (
        <DataTable headers={["Nama", "Kontak", "Domisili", "Minat", "Motivasi"]}>
          {members.map((member) => (
            <tr key={member.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-forest-950">{member.full_name}</p>
                <p className="mt-0.5 text-xs text-granite-500">
                  {new Date(member.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </td>
              <td className="px-5 py-4 text-granite-700">
                <p>{member.email}</p>
                <p className="mt-0.5 text-xs text-granite-500">{member.phone}</p>
              </td>
              <td className="px-5 py-4 text-granite-700">
                {member.city}
                <span className="mt-0.5 block text-xs text-granite-500">
                  {member.experience_level}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {member.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-sand-200 px-2 py-0.5 text-xs text-granite-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </td>
              <td className="max-w-sm px-5 py-4 text-xs leading-relaxed text-granite-600">
                {member.motivation}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
