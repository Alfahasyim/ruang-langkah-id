"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import {
  Field,
  FormAlert,
  Input,
  Select,
  Textarea,
} from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { saveTrip } from "@/lib/admin/content-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";
import type { Trip } from "@/lib/types";
import { DIFFICULTY_META } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draf — belum tampil di situs" },
  { value: "open", label: "Dibuka — menerima pendaftaran" },
  { value: "full", label: "Penuh — pendaftar masuk daftar tunggu" },
  { value: "closed", label: "Ditutup" },
  { value: "completed", label: "Selesai" },
];

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Menyimpan…
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          {isEdit ? "Simpan perubahan" : "Buat trip"}
        </>
      )}
    </Button>
  );
}

export function TripForm({ trip }: { trip?: Trip }) {
  const [state, formAction] = useActionState(saveTrip, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      {trip && <input type="hidden" name="id" value={trip.id} />}

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">Informasi dasar</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Judul trip"
            htmlFor="title"
            required
            error={errors.title}
            className="sm:col-span-2"
          >
            <Input id="title" name="title" defaultValue={trip?.title} required />
          </Field>

          <Field
            label="Slug URL"
            htmlFor="slug"
            hint="Kosongkan untuk dibuat otomatis dari judul."
            className="sm:col-span-2"
          >
            <Input
              id="slug"
              name="slug"
              defaultValue={trip?.slug}
              placeholder="prau-sunrise-camp"
            />
          </Field>

          <Field label="Kategori" htmlFor="category" required error={errors.category}>
            <Select
              id="category"
              name="category"
              defaultValue={trip?.category ?? ""}
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

          <Field label="Status" htmlFor="status" required error={errors.status}>
            <Select
              id="status"
              name="status"
              defaultValue={trip?.status ?? "draft"}
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Lokasi" htmlFor="location" required error={errors.location}>
            <Input
              id="location"
              name="location"
              defaultValue={trip?.location}
              placeholder="Gunung Prau, Dieng"
              required
            />
          </Field>

          <Field label="Provinsi" htmlFor="province">
            <Input
              id="province"
              name="province"
              defaultValue={trip?.province ?? ""}
              placeholder="Jawa Tengah"
            />
          </Field>

          <Field label="Titik kumpul" htmlFor="meeting_point" className="sm:col-span-2">
            <Input
              id="meeting_point"
              name="meeting_point"
              defaultValue={trip?.meeting_point ?? ""}
              placeholder="Basecamp Patak Banteng, Wonosobo"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">
          Jadwal, kesulitan, dan kuota
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Tanggal mulai"
            htmlFor="start_date"
            required
            error={errors.start_date}
          >
            <Input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={trip?.start_date}
              required
            />
          </Field>

          <Field
            label="Tanggal selesai"
            htmlFor="end_date"
            hint="Kosongkan untuk trip sehari."
            error={errors.end_date}
          >
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={trip?.end_date ?? ""}
            />
          </Field>

          <Field
            label="Level kesulitan"
            htmlFor="difficulty_level"
            hint="Skala 1–5. Label Pemula/Menengah/Lanjutan dihitung otomatis."
            required
            error={errors.difficulty_level}
          >
            <Select
              id="difficulty_level"
              name="difficulty_level"
              defaultValue={trip?.difficulty_level ?? 2}
              required
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level} — {DIFFICULTY_META[level].tier}: {DIFFICULTY_META[level].caption}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Ketinggian (mdpl)" htmlFor="elevation_m">
            <Input
              id="elevation_m"
              name="elevation_m"
              type="number"
              min={0}
              defaultValue={trip?.elevation_m ?? ""}
            />
          </Field>

          <Field
            label="Kuota peserta"
            htmlFor="quota"
            required
            error={errors.quota}
            hint={
              trip
                ? `Saat ini ${trip.seats_taken} kursi sudah terisi.`
                : undefined
            }
          >
            <Input
              id="quota"
              name="quota"
              type="number"
              min={1}
              defaultValue={trip?.quota ?? 20}
              required
            />
          </Field>

          <Field
            label="Kontribusi per peserta (Rp)"
            htmlFor="price"
            required
            error={errors.price}
          >
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1000}
              defaultValue={trip?.price ?? 0}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">Konten</h2>
        <div className="flex flex-col gap-5">
          <Field
            label="Ringkasan"
            htmlFor="summary"
            hint="Satu kalimat yang tampil di kartu trip."
            required
            error={errors.summary}
          >
            <Textarea
              id="summary"
              name="summary"
              rows={2}
              defaultValue={trip?.summary}
              required
            />
          </Field>

          <Field
            label="Deskripsi lengkap"
            htmlFor="description"
            required
            error={errors.description}
          >
            <Textarea
              id="description"
              name="description"
              rows={7}
              defaultValue={trip?.description}
              required
            />
          </Field>

          <Field
            label="Yang membuatnya berkesan"
            htmlFor="highlights"
            hint="Satu poin per baris."
          >
            <Textarea
              id="highlights"
              name="highlights"
              rows={4}
              defaultValue={trip?.highlights.join("\n")}
            />
          </Field>

          <Field
            label="Sudah termasuk"
            htmlFor="includes"
            hint="Satu poin per baris."
          >
            <Textarea
              id="includes"
              name="includes"
              rows={4}
              defaultValue={trip?.includes.join("\n")}
            />
          </Field>

          <Field
            label="Syarat peserta"
            htmlFor="requirements"
            hint="Satu poin per baris."
          >
            <Textarea
              id="requirements"
              name="requirements"
              rows={4}
              defaultValue={trip?.requirements.join("\n")}
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton isEdit={Boolean(trip)} />
        <Link
          href="/admin/trip"
          className="rounded-full px-5 py-3 text-sm font-semibold text-granite-600 transition-colors hover:bg-sand-200"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
