"use client";

import { useRef, type ReactNode } from "react";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bungkus thumbnail apa pun (biasanya <Image>) agar bisa diklik untuk
 * membuka versi penuhnya di popup. Memakai <dialog> native: gratis dari
 * penjaga fokus, tombol Esc, dan lapisan ::backdrop tanpa dependensi luar.
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Perbesar foto: ${alt}`}
        className={cn("group relative block cursor-zoom-in text-left", className)}
      >
        {children}
        <span className="absolute inset-0 flex items-center justify-center bg-forest-950/0 opacity-0 transition-all duration-200 group-hover:bg-forest-950/25 group-hover:opacity-100">
          <ZoomIn className="h-6 w-6 text-sand-50 drop-shadow" aria-hidden />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        onCancel={() => dialogRef.current?.close()}
        className="m-auto max-h-[88vh] max-w-[92vw] rounded-2xl border-0 bg-transparent p-0 backdrop:bg-forest-950/85"
        aria-label={alt}
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- ukuran asli tidak diketahui, lebih sederhana daripada memaksa next/image di dalam dialog */}
          <img
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Tutup"
            className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-forest-950 text-sand-50 shadow-lg transition-colors hover:bg-forest-800"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </dialog>
    </>
  );
}
