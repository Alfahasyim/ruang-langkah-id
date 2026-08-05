import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { GalleryTile } from "@/components/gallery/GalleryTile";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { GALLERY } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeri Perjalanan",
  description:
    "Dokumentasi perjalanan Ruang Langkah Indonesia di gunung, curug, dan hutan Nusantara.",
};

export default function GaleriPage() {
  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title="Yang kami bawa pulang hanyalah gambar"
        description="Setiap foto di sini diambil tanpa merusak vegetasi, mengganggu satwa, atau memaksa masuk area terlarang. Kalau satu frame harus ditukar dengan kerusakan, frame itu tidak kami ambil."
      />

      <section className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <div className="grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-4">
            {GALLERY.map((item, index) => (
              <GalleryTile
                key={item.id}
                item={item}
                className={
                  index % 5 === 0 ? "col-span-2 row-span-2" : undefined
                }
              />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-sand-200 bg-white p-7 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
              <Camera className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-forest-950">
                Punya foto dari trip bersama kami?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-granite-600">
                Kirimkan ke tim dokumentasi lewat grup WhatsApp anggota. Foto
                terpilih akan tampil di galeri ini lengkap dengan kredit
                fotografernya.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
