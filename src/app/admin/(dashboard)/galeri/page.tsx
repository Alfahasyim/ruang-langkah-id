import Image from "next/image";
import { AdminHeading, Badge, EmptyState, Panel } from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { EditDisclosure } from "@/components/admin/EditDisclosure";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import { FormAlert } from "@/components/forms/Fields";
import { Zoomable } from "@/components/ui/Zoomable";
import { deleteGalleryItem } from "@/lib/admin/content-actions";
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
      return { status: "success", text: "Foto galeri berhasil disimpan." };
    case "tersimpan-banyak":
      return {
        status: "success",
        text: `${jumlah ?? "Beberapa"} foto berhasil ditambahkan ke galeri.`,
      };
    case "terhapus":
      return { status: "success", text: "Foto galeri berhasil dihapus." };
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
        description="Unggah foto dokumentasi trip. Foto tanpa berkas akan tampil sebagai gradien bertema kategori."
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
              description="Tambahkan foto pertama lewat formulir di samping."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const imageUrl = galleryImageUrl(item.image_path);
                const meta = CATEGORY_META[item.category];

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-sand-300 bg-white"
                  >
                    <div
                      className={`relative h-36 bg-linear-to-br ${meta.gradient}`}
                    >
                      {imageUrl ? (
                        <Zoomable src={imageUrl} alt={item.caption} className="h-full">
                          <Image
                            src={imageUrl}
                            alt={item.caption}
                            fill
                            sizes="(min-width: 1024px) 20vw, 50vw"
                            className="object-cover"
                          />
                        </Zoomable>
                      ) : (
                        <CategoryIcon
                          category={item.category}
                          className="absolute -right-4 -bottom-4 h-28 w-28 text-white/20"
                        />
                      )}
                    </div>

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
                        {item.location} · urutan {item.sort_order}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-sand-200 pt-3">
                        <DeleteForm
                          action={deleteGalleryItem}
                          confirmMessage={`Hapus foto "${item.caption}" dari galeri?`}
                        >
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            type="hidden"
                            name="image_path"
                            value={item.image_path ?? ""}
                          />
                        </DeleteForm>
                      </div>

                      <div className="mt-2">
                        <EditDisclosure>
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
          <h2 className="mb-5 font-semibold text-forest-950">Tambah foto</h2>
          <GalleryForm nextSortOrder={nextSortOrder} />
        </Panel>
      </div>
    </>
  );
}
