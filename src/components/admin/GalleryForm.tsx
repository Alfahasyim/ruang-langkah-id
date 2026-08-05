"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Loader2 } from "lucide-react";
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
import type { GalleryRow } from "@/lib/admin/queries";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
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
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {item && <input type="hidden" name="id" value={item.id} />}

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <Field label="Keterangan foto" htmlFor="caption" required error={errors.caption}>
        <Input
          id="caption"
          name="caption"
          defaultValue={item?.caption}
          placeholder="Menunggu kabut buyar di Bukit Teletubbies"
          required
        />
      </Field>

      <Field label="Lokasi" htmlFor="gallery_location" required error={errors.location}>
        <Input
          id="gallery_location"
          name="location"
          defaultValue={item?.location}
          placeholder="Gunung Prau, Dieng"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Kategori"
          htmlFor="gallery_category"
          required
          error={errors.category}
        >
          <Select
            id="gallery_category"
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
          htmlFor="sort_order"
          hint="Angka kecil tampil lebih dulu."
        >
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={item?.sort_order ?? nextSortOrder}
          />
        </Field>
      </div>

      <Field
        label="Berkas foto"
        htmlFor="image"
        hint={
          item?.image_path
            ? "Sudah ada foto. Pilih berkas baru hanya bila ingin menggantinya."
            : "JPG, PNG, WebP, atau AVIF. Maksimal 4 MB. Kosongkan untuk memakai gradien."
        }
        error={errors.image}
      >
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-granite-700 file:mr-4 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sand-50"
        />
      </Field>

      <CheckboxRow
        name="is_published"
        defaultChecked={item?.is_published ?? true}
        label="Tampilkan foto ini di galeri publik"
      />

      <SubmitButton isEdit={Boolean(item)} />
    </form>
  );
}
