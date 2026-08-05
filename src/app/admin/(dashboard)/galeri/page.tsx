import Image from "next/image";
import { AdminHeading, Badge, EmptyState, Panel } from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { EditDisclosure } from "@/components/admin/EditDisclosure";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import { FormAlert } from "@/components/forms/Fields";
import { Zoomable } from "@/components/ui/Zoomable";
import { deleteGalleryItem, deleteGalleryPhoto } from "@/lib/admin/content-actions";
import { getGalleryRows } from "@/lib/admin/queries";
import { galleryImageUrl } from "@/lib/gallery";
import { CATEGORY_META } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Galeri" };

function resolveNotice(
  pesan: string | undefined,
  jumlah: string | undefined,
): { status: "success" | "error"; text: string } | undefined {
  switch (pesan) {
    case "tersimpan":
      return { status: "success", text: "Entri galeri berhasil disimpan." };
    case "tersimpan-foto":
      return {
        status: "success",
        text: `Entri tersimpan dengan ${jumlah ?? "beberapa"} foto baru.`,
      };
    case "terhapus":
      return { status: "success", text: "Entri galeri berhasil dihapus." };
    case "foto-terhapus":
      return { status: "success", text: "Foto berhasil dihapus dari entri." };
    default:
      return undefined;
  }
}

export default async function AdminGalleryPage({
  searchParams,
}: PageProps<"/admin/galeri">) {
  const params = await searchParams;
  const notice = resolveNotice(
    typeof params.pesan === "string" ? params.pesan : undefined,
    typeof params.jumlah === "string" ? params.jumlah : undefined,
  );

  const items = await getGalleryRows();
  const nextSortOrder =
    items.length > 0 ? Math.max(...items.map((item) => item.sort_order)) + 1 : 1;

  return (
    <>
      <AdminHeading
        title="Galeri Perjalanan"
        description="Satu entri bisa memuat banyak foto yang tampil sebagai slide di situs. Entri tanpa foto tampil sebagai gradien bertema kategori."
      />

      {notice && (
        <div className="mb-6">
          <FormAlert status={notice.status} message={notice.text} />
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_22rem] xl:items-start">
        <div>
          {items.length === 0 ? (
            <EmptyState
              title="Galeri masih kosong"
              description="Tambahkan entri pertama lewat formulir di samping."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((item) => {
                const meta = CATEGORY_META[item.category];

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-sand-300 bg-white"
                  >
                    {item.photos.length === 0 ? (
                      <div
                        className={`relative h-36 bg-linear-to-br ${meta.gradient}`}
                      >
                        <CategoryIcon
                          category={item.category}
                          className="absolute -right-4 -bottom-4 h-28 w-28 text-white/20"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1 bg-sand-100 p-1">
                        {item.photos.map((photo) => {
                          const url = galleryImageUrl(photo.image_path);
                          if (!url) return null;

                          return (
                            <div key={photo.id} className="group relative aspect-square">
                              <Zoomable
                                src={url}
                                alt={item.caption}
                                className="h-full w-full overflow-hidden rounded-md"
                              >
                                <Image
                                  src={url}
                                  alt={item.caption}
                                  fill
                                  sizes="120px"
                                  className="object-cover"
                                />
                              </Zoomable>

                              <DeleteForm
                                action={deleteGalleryPhoto}
                                confirmMessage={`Hapus satu foto ini dari entri "${item.caption}"?`}
                                label=""
                                className="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                              >
                                <input type="hidden" name="photo_id" value={photo.id} />
                                <input
                                  type="hidden"
                                  name="image_path"
                                  value={photo.image_path}
                                />
                              </DeleteForm>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-snug font-medium text-forest-950">
                          {item.caption}
                        </p>
                        <Badge tone={item.is_published ? "success" : "neutral"}>
                          {item.is_published ? "Tampil" : "Sembunyi"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-granite-500">
                        {item.location} · urutan {item.sort_order} ·{" "}
                        {item.photos.length} foto
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-sand-200 pt-3">
                        <DeleteForm
                          action={deleteGalleryItem}
                          confirmMessage={`Hapus entri "${item.caption}" beserta ${item.photos.length} fotonya?`}
                          label="Hapus entri"
                        >
                          <input type="hidden" name="id" value={item.id} />
                        </DeleteForm>
                      </div>

                      <div className="mt-2">
                        <EditDisclosure label="Ubah / tambah foto">
                          <GalleryForm item={item} />
                        </EditDisclosure>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <Panel className="xl:sticky xl:top-8">
          <h2 className="mb-5 font-semibold text-forest-950">Tambah entri baru</h2>
          <GalleryForm nextSortOrder={nextSortOrder} />
        </Panel>
      </div>
    </>
  );
}
