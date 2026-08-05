"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxPhoto = { src: string; alt: string };

/**
 * Popup zoom terkendali. Memakai <dialog> native supaya penjagaan fokus,
 * tombol Esc, dan lapisan backdrop datang dari browser tanpa dependensi luar.
 */
export function Lightbox({
  photos,
  index,
  open,
  onClose,
  onNavigate,
}: {
  photos: LightboxPhoto[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = photos.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open || total < 2) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") onNavigate((index + 1) % total);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, index, total, onNavigate]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      onClose={onClose}
      onCancel={onClose}
      aria-label={photo.alt}
      className="m-auto max-h-[90vh] max-w-[94vw] rounded-2xl border-0 bg-transparent p-0 backdrop:bg-forest-950/85"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- dimensi asli tidak diketahui; next/image tidak memberi keuntungan di dalam dialog */}
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-forest-950 text-sand-50 shadow-lg transition-colors hover:bg-forest-800"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => onNavigate((index - 1 + total) % total)}
              aria-label="Foto sebelumnya"
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/70 text-sand-50 transition-colors hover:bg-forest-950"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % total)}
              aria-label="Foto berikutnya"
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/70 text-sand-50 transition-colors hover:bg-forest-950"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>

            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/70 px-3 py-1 text-xs font-medium text-sand-50">
              {index + 1} / {total}
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
