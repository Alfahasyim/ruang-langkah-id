"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  CheckboxRow,
  Field,
  FormAlert,
  Input,
  Select,
} from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { saveGalleryItem } from "@/lib/admin/content-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { GalleryRow } from "@/lib/admin/queries";

const MAX_FILES = 10;
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type Staged = { path: string; name: string; previewUrl: string };

function slugifyName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function SubmitButton({ isEdit, disabled }: { isEdit: boolean; disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Menyimpan…
        </>
      ) : (
        <>
          <ImagePlus className="h-4 w-4" aria-hidden />
          {isEdit ? "Simpan perubahan" : "Tambah ke galeri"}
        </>
      )}
    </Button>
  );
}

export function GalleryForm({
  item,
  nextSortOrder = 0,
}: {
  item?: GalleryRow;
  nextSortOrder?: number;
}) {
  const [state, formAction] = useActionState(saveGalleryItem, INITIAL_FORM_STATE);
  const [staged, setStaged] = useState<Staged[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const errors = state.fieldErrors ?? {};
  const existingCount = item?.photos.length ?? 0;
  const remainingSlots = MAX_FILES - existingCount - staged.length;

  /**
   * Diunggah langsung ke Supabase Storage dari browser. Server action nanti
   * hanya menerima daftar path — body request ke serverless function Vercel
   * dibatasi 4,5 MB, jadi byte foto tidak boleh melewatinya.
   */
  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadError(null);

    if (files.length > remainingSlots) {
      setUploadError(
        `Sisa ${remainingSlots} slot foto untuk entri ini (maksimal ${MAX_FILES}).`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError(`${file.name}: format harus JPG, PNG, WebP, atau AVIF.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.size > MAX_BYTES) {
        setUploadError(`${file.name}: ukuran melebihi 4 MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const uploaded: Staged[] = [];

      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const base = slugifyName(file.name.replace(/\.[^.]+$/, "")) || "foto";
        const path = `${base}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${extension}`;

        const { error } = await supabase.storage
          .from("galeri")
          .upload(path, file, { contentType: file.type, upsert: false });

        if (error) {
          setUploadError(`Gagal mengunggah ${file.name}: ${error.message}`);
          break;
        }

        uploaded.push({
          path,
          name: file.name,
          previewUrl: URL.createObjectURL(file),
        });
      }

      setStaged((current) => [...current, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeStaged(target: Staged) {
    setStaged((current) => current.filter((entry) => entry.path !== target.path));
    URL.revokeObjectURL(target.previewUrl);

    // Berkasnya sudah telanjur ada di Storage, jadi ikut dibersihkan supaya
    // tidak menumpuk sebagai berkas yatim saat form dibatalkan.
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.storage.from("galeri").remove([target.path]);
    } catch {
      // Dibiarkan diam: gagal bersih-bersih tidak boleh menghalangi admin.
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {item && <input type="hidden" name="id" value={item.id} />}
      <input
        type="hidden"
        name="image_paths"
        value={JSON.stringify(staged.map((entry) => entry.path))}
      />

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <Field label="Keterangan momen" htmlFor={`caption-${item?.id ?? "baru"}`} required error={errors.caption}>
        <Input
          id={`caption-${item?.id ?? "baru"}`}
          name="caption"
          defaultValue={item?.caption}
          placeholder="Menunggu kabut buyar di Bukit Teletubbies"
          required
        />
      </Field>

      <Field
        label="Lokasi"
        htmlFor={`location-${item?.id ?? "baru"}`}
        required
        error={errors.location}
      >
        <Input
          id={`location-${item?.id ?? "baru"}`}
          name="location"
          defaultValue={item?.location}
          placeholder="Gunung Prau, Dieng"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Kategori"
          htmlFor={`category-${item?.id ?? "baru"}`}
          required
          error={errors.category}
        >
          <Select
            id={`category-${item?.id ?? "baru"}`}
            name="category"
            defaultValue={item?.category ?? ""}
            required
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            <option value="gunung">Gunung</option>
            <option value="curug">Curug</option>
            <option value="hutan">Hutan</option>
          </Select>
        </Field>

        <Field
          label="Urutan tampil"
          htmlFor={`sort_order-${item?.id ?? "baru"}`}
          hint="Angka kecil tampil lebih dulu."
        >
          <Input
            id={`sort_order-${item?.id ?? "baru"}`}
            name="sort_order"
            type="number"
            defaultValue={item?.sort_order ?? nextSortOrder}
          />
        </Field>
      </div>

      <Field
        label="Tambah foto"
        htmlFor={`image-${item?.id ?? "baru"}`}
        hint={
          remainingSlots > 0
            ? `Bisa pilih beberapa sekaligus. Maksimal 4 MB per berkas, sisa ${remainingSlots} slot. Semua foto masuk ke satu entri ini dan tampil sebagai slide.`
            : `Sudah mencapai batas ${MAX_FILES} foto untuk entri ini.`
        }
        error={uploadError ?? undefined}
      >
        <input
          ref={fileInputRef}
          id={`image-${item?.id ?? "baru"}`}
          name="image"
          type="file"
          multiple
          disabled={uploading || remainingSlots <= 0}
          onChange={handleFiles}
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-granite-700 file:mr-4 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sand-50 disabled:opacity-60"
        />
      </Field>

      {uploading && (
        <p className="flex items-center gap-2 text-sm text-granite-600">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Mengunggah foto…
        </p>
      )}

      {staged.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-forest-900">
            Siap disimpan ({staged.length})
          </p>
          <ul className="flex flex-wrap gap-2">
            {staged.map((entry) => (
              <li key={entry.path} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal dari blob URL */}
                <img
                  src={entry.previewUrl}
                  alt={entry.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeStaged(entry)}
                  aria-label={`Batalkan ${entry.name}`}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-600 text-white"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CheckboxRow
        name="is_published"
        defaultChecked={item?.is_published ?? true}
        label="Tampilkan entri ini di galeri publik"
      />

      <SubmitButton isEdit={Boolean(item)} disabled={uploading} />
    </form>
  );
}
