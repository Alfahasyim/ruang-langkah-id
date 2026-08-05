import { ArrowRight } from "lucide-react";
import { GalleryTile } from "@/components/gallery/GalleryTile";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GALLERY } from "@/lib/gallery";

export function GalleryPreview() {
  const items = GALLERY.slice(0, 5);

  return (
    <section className="bg-sand-50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Galeri Perjalanan"
          title="Cerita yang tertinggal di kartu memori"
          description="Foto-foto dari anggota, diambil di jalur sungguhan — tanpa filter berlebihan, tanpa merusak apa pun untuk mendapatkannya."
          action={
            <ButtonLink href="/galeri" variant="outline">
              Buka galeri
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          }
        />

        <div className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-4 lg:grid-cols-4">
          <GalleryTile item={items[0]} className="col-span-2 row-span-2" />
          <GalleryTile item={items[1]} />
          <GalleryTile item={items[2]} />
          <GalleryTile item={items[3]} className="lg:col-span-2" />
          <GalleryTile item={items[4]} className="col-span-2 lg:col-span-2" />
        </div>
      </Container>
    </section>
  );
}
