import Link from "next/link";
import { Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  tone = "dark",
  className,
  name,
  shortName,
  logoUrl,
}: {
  tone?: "dark" | "light";
  className?: string;
  name: string;
  shortName: string;
  logoUrl?: string | null;
}) {
  const isLight = tone === "light";

  // Nama pendek dipecah: kata terakhir jadi baris kecil di bawah, sisanya
  // jadi baris utama. "Ruang Langkah Indonesia" → "Ruang Langkah" / "Indonesia".
  const words = name.trim().split(/\s+/);
  const primary = shortName.trim() || words.slice(0, -1).join(" ") || name;
  const secondary =
    words.length > 1 && name.startsWith(primary)
      ? name.slice(primary.length).trim()
      : "";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${name} — kembali ke beranda`}
    >
      {logoUrl ? (
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- aset kecil dari Storage, dimensi asli tidak diketahui */}
          <img
            src={logoUrl}
            alt=""
            className="h-full w-full object-contain"
            width={40}
            height={40}
          />
        </span>
      ) : (
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
      )}

      <span className="leading-tight">
        <span
          className={cn(
            "block font-display text-base font-semibold",
            isLight ? "text-sand-50" : "text-forest-950",
          )}
        >
          {primary}
        </span>
        {secondary && (
          <span
            className={cn(
              "block text-[0.65rem] font-medium tracking-[0.22em] uppercase",
              isLight ? "text-moss-300" : "text-terracotta-600",
            )}
          >
            {secondary}
          </span>
        )}
      </span>
    </Link>
  );
}
