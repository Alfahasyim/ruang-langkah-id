"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import { Lightbox } from "@/components/ui/Lightbox";
import { galleryImageUrl, type GalleryItem } from "@/lib/gallery";
import { CATEGORY_META, cn } from "@/lib/utils";

export function GalleryTile({
  item,
  className,
}: {
  item: GalleryItem;
  className?: string;
}) {
  const meta = CATEGORY_META[item.category];
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photos = item.photos
    .map((photo) => ({
      src: galleryImageUrl(photo.image_path),
      alt: item.caption,
    }))
    .filter((photo): photo is { src: string; alt: string } => Boolean(photo.src));

  const total = photos.length;
  const current = photos[index];

  function go(direction: 1 | -1) {
    setIndex((value) => (value + direction + total) % total);
  }

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl bg-linear-to-br",
        meta.gradient,
        className,
      )}
    >
      {current ? (
        <>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Perbesar foto: ${item.caption}`}
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={current.src}
              alt={item.caption}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <ZoomIn className="h-7 w-7 text-sand-50 drop-shadow" aria-hidden />
            </span>
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto sebelumnya"
                className="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-sand-50 opacity-0 transition-opacity hover:bg-forest-950 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto berikutnya"
                className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-sand-50 opacity-0 transition-opacity hover:bg-forest-950 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>

              <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                {photos.map((photo, dotIndex) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Foto ${dotIndex + 1} dari ${total}`}
                    aria-current={dotIndex === index}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      dotIndex === index
                        ? "w-4 bg-sand-50"
                        : "w-1.5 bg-sand-50/50 hover:bg-sand-50/80",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <CategoryIcon
          category={item.category}
          className="absolute -right-6 -bottom-6 h-40 w-40 text-white/15 transition-transform duration-500 group-hover:scale-110"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-forest-950/85 via-forest-950/10 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm leading-snug font-semibold text-balance text-sand-50">
          {item.caption}
        </p>
        <p className="mt-1 text-xs text-moss-200">
          {item.location}
          {total > 1 && ` · ${total} foto`}
        </p>
      </div>

      {current && (
        <Lightbox
          photos={photos}
          index={index}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setIndex}
        />
      )}
    </div>
  );
}
