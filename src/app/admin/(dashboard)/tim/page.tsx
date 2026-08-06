import Image from "next/image";
import { AdminHeading, Badge, EmptyState, Panel } from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { EditDisclosure } from "@/components/admin/EditDisclosure";
import { TeamForm } from "@/components/admin/TeamForm";
import { FormAlert } from "@/components/forms/Fields";
import { Zoomable } from "@/components/ui/Zoomable";
import { deleteTeamMember } from "@/lib/admin/content-actions";
import { getTeamRows } from "@/lib/admin/queries";
import { initialsOf, teamPhotoUrl, TEAM_TONES } from "@/lib/team";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profil Tim" };

const MESSAGES: Record<string, { status: "success" | "error"; text: string }> = {
  tersimpan: { status: "success", text: "Profil tim berhasil disimpan." },
  terhapus: { status: "success", text: "Profil tim berhasil dihapus." },
};

export default async function AdminTeamPage({
  searchParams,
}: PageProps<"/admin/tim">) {
  const params = await searchParams;
  const notice =
    typeof params.pesan === "string" ? MESSAGES[params.pesan] : undefined;

  const members = await getTeamRows();
  const nextSortOrder =
    members.length > 0
      ? Math.max(...members.map((member) => member.sort_order)) + 1
      : 1;

  return (
    <>
      <AdminHeading
        title="Profil Tim"
        description="Kelola orang-orang yang tampil di halaman Tentang Kami. Tanpa foto, kartu menampilkan inisial berwarna."
      />

      {notice && (
        <div className="mb-6">
          <FormAlert status={notice.status} message={notice.text} />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
        <div>
          {members.length === 0 ? (
            <EmptyState
              title="Belum ada profil tim"
              description="Tambahkan pengurus dan trip leader lewat formulir di samping."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {members.map((member, index) => {
                const photoUrl = teamPhotoUrl(member.photo_path);
                const tone = TEAM_TONES[index % TEAM_TONES.length];

                return (
                  <article
                    key={member.id}
                    className="rounded-2xl border border-sand-300 bg-white p-5"
                  >
                    <div className="flex items-start gap-4">
                      {photoUrl ? (
                        <Zoomable
                          src={photoUrl}
                          alt={member.full_name}
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl"
                        >
                          <Image
                            src={photoUrl}
                            alt={member.full_name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </Zoomable>
                      ) : (
                        <span
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold text-white ${tone}`}
                        >
                          {initialsOf(member.full_name)}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-forest-950">
                            {member.full_name}
                          </p>
                          <Badge tone={member.is_published ? "success" : "neutral"}>
                            {member.is_published ? "Tampil" : "Sembunyi"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-terracotta-600">
                          {member.role}
                        </p>
                        <p className="whitespace-pre-line mt-2 text-xs leading-relaxed text-granite-600">
                          {member.bio}
                        </p>
                        <p className="mt-2 text-xs text-granite-400">
                          Urutan {member.sort_order}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-sand-200 pt-3">
                      <DeleteForm
                        action={deleteTeamMember}
                        confirmMessage={`Hapus profil "${member.full_name}" dari halaman Tentang Kami?`}
                      >
                        <input type="hidden" name="id" value={member.id} />
                        <input
                          type="hidden"
                          name="photo_path"
                          value={member.photo_path ?? ""}
                        />
                      </DeleteForm>
                    </div>

                    <div className="mt-2">
                      <EditDisclosure>
                        <TeamForm member={member} />
                      </EditDisclosure>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <Panel className="xl:sticky xl:top-8">
          <h2 className="mb-5 font-semibold text-forest-950">Tambah anggota tim</h2>
          <TeamForm nextSortOrder={nextSortOrder} />
        </Panel>
      </div>
    </>
  );
}
