import Image from "next/image";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import type { GalleryItem } from "@/lib/gallery";
import { CATEGORY_META, cn } from "@/lib/utils";

export function GalleryTile({
  item,
  className,
}: {
  item: GalleryItem;
  className?: string;
}) {
  const meta = CATEGORY_META[item.category];

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-linear-to-br",
        meta.gradient,
        className,
      )}
    >
      {item.src ? (
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <CategoryIcon
          category={item.category}
          className="absolute -right-6 -bottom-6 h-40 w-40 text-white/15 transition-transform duration-500 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-forest-950/85 via-forest-950/10 to-transparent" />

      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm leading-snug font-semibold text-balance text-sand-50">
          {item.caption}
        </p>
        <p className="mt-1 text-xs text-moss-200">{item.location}</p>
      </figcaption>
    </figure>
  );
}
