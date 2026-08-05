"use client";

import { useState, type ReactNode } from "react";
import { ZoomIn } from "lucide-react";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

/**
 * Bungkus satu thumbnail agar bisa diklik untuk membuka versi penuhnya.
 * Untuk kumpulan foto dengan slide, pakai PhotoSlider.
 */
export function Zoomable({
  src,
  alt,
  children,
  className,
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Perbesar foto: ${alt}`}
        className={cn("group relative block cursor-zoom-in text-left", className)}
      >
        {children}
        <span className="absolute inset-0 flex items-center justify-center bg-forest-950/0 opacity-0 transition-all duration-200 group-hover:bg-forest-950/25 group-hover:opacity-100">
          <ZoomIn className="h-6 w-6 text-sand-50 drop-shadow" aria-hidden />
        </span>
      </button>

      <Lightbox
        photos={[{ src, alt }]}
        index={0}
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={() => {}}
      />
    </>
  );
}
