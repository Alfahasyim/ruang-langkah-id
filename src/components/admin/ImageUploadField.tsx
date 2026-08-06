"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Field } from "@/components/forms/Fields";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * Satu berkas, diunggah langsung dari browser ke bucket Storage lalu path-nya
 * dikirim lewat input tersembunyi. Byte berkas sengaja tidak melewati Server
 * Action karena body request ke serverless function Vercel dibatasi 4,5 MB.
 */
export function ImageUploadField({
  name,
  bucket,
  label,
  hint,
  error,
  maxBytes = 2 * 1024 * 1024,
  allowSvg = false,
  currentUrl,
  inputId,
}: {
  /** Nama input tersembunyi yang menampung path hasil unggahan. */
  name: string;
  bucket: string;
  label: string;
  hint?: string;
  error?: string;
  maxBytes?: number;
  allowSvg?: boolean;
  currentUrl?: string | null;
  inputId: string;
}) {
  const [path, setPath] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accepted = allowSvg
    ? ALLOWED_TYPES
    : ALLOWED_TYPES.filter((type) => type !== "image/svg+xml");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!accepted.includes(file.type)) {
      setUploadError(
        `Format harus ${allowSvg ? "PNG, SVG, WebP, atau JPG" : "JPG, PNG, WebP, atau AVIF"}.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > maxBytes) {
      setUploadError(
        `Ukuran berkas melebihi ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const base = slugifyName(file.name.replace(/\.[^.]+$/, "")) || "berkas";
      const nextPath = `${base}-${Date.now()}.${extension}`;

      const { error: uploadIssue } = await supabase.storage
        .from(bucket)
        .upload(nextPath, file, { contentType: file.type, upsert: false });

      if (uploadIssue) {
        setUploadError(`Gagal mengunggah: ${uploadIssue.message}`);
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPath(nextPath);
      setPreviewUrl(URL.createObjectURL(file));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearStaged() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPath("");
  }

  const shownUrl = previewUrl ?? currentUrl ?? null;

  return (
    <>
      <input type="hidden" name={name} value={path} />

      <Field
        label={label}
        htmlFor={inputId}
        hint={hint}
        error={error ?? uploadError ?? undefined}
      >
        <div className="flex flex-col gap-3">
          {shownUrl && (
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-sand-300 bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau blob lokal & aset Storage berukuran kecil */}
                <img
                  src={shownUrl}
                  alt="Pratinjau"
                  className="max-h-full max-w-full object-contain"
                />
              </span>
              {previewUrl && (
                <button
                  type="button"
                  onClick={clearStaged}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-terracotta-700 transition-colors hover:bg-terracotta-50"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Batalkan berkas baru
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={accepted.join(",")}
            disabled={uploading}
            onChange={handleFile}
            className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-granite-700 file:mr-4 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sand-50 disabled:opacity-60"
          />

          {uploading && (
            <p className="flex items-center gap-2 text-sm text-granite-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Mengunggah…
            </p>
          )}

          {path && !uploading && (
            <p className="flex items-center gap-2 text-sm text-forest-700">
              <Upload className="h-4 w-4" aria-hidden />
              Berkas siap — klik Simpan untuk menerapkan.
            </p>
          )}
        </div>
      </Field>
    </>
  );
}
