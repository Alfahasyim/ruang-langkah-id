import Link from "next/link";
import { Footprints } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${SITE.name} — kembali ke beranda`}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          isLight
            ? "bg-moss-300/20 text-moss-200 group-hover:bg-moss-300/30"
            : "bg-forest-700 text-sand-50 group-hover:bg-forest-800",
        )}
      >
        <Footprints className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-display text-base font-semibold",
            isLight ? "text-sand-50" : "text-forest-950",
          )}
        >
          Ruang Langkah
        </span>
        <span
          className={cn(
            "block text-[0.65rem] font-medium tracking-[0.22em] uppercase",
            isLight ? "text-moss-300" : "text-terracotta-600",
          )}
        >
          Indonesia
        </span>
      </span>
    </Link>
  );
}
