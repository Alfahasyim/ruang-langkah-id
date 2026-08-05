"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";
import {
  CheckboxRow,
  EXPERIENCE_OPTIONS,
  Field,
  FormAlert,
  Input,
  Select,
  Textarea,
} from "./Fields";
import { Button } from "@/components/ui/Button";
import { registerForTrip } from "@/lib/actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";
import type { Trip } from "@/lib/types";

function SubmitButton({ isFull }: { isFull: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Mengirim pendaftaran…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" aria-hidden />
          {isFull ? "Masuk daftar tunggu" : "Kirim pendaftaran"}
        </>
      )}
    </Button>
  );
}

export function TripRegistrationForm({ trip }: { trip: Trip }) {
  const [state, formAction] = useActionState(registerForTrip, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};
  const isFull = trip.seats_remaining <= 0;

  if (state.status === "success") {
    return <FormAlert status="success" message={state.message} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="trip_id" value={trip.id} />

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      {isFull && (
        <p className="rounded-xl border border-gold-200 bg-gold-100 p-4 text-sm leading-relaxed text-forest-900">
          Kuota trip ini sudah penuh. Kamu tetap bisa mendaftar untuk masuk
          daftar tunggu — kami menghubungimu lebih dulu bila ada kursi kosong.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nama lengkap"
          htmlFor="full_name"
          required
          error={errors.full_name}
          className="sm:col-span-2"
        >
          <Input
            id="full_name"
            name="full_name"
            autoComplete="name"
            placeholder="Sesuai KTP, untuk pendataan simaksi"
            required
          />
        </Field>

        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            required
          />
        </Field>

        <Field
          label="Nomor WhatsApp"
          htmlFor="phone"
          required
          error={errors.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="081234567890"
            required
          />
        </Field>

        <Field label="Tanggal lahir" htmlFor="birth_date">
          <Input id="birth_date" name="birth_date" type="date" />
        </Field>

        <Field
          label="Level pengalaman"
          htmlFor="experience_level"
          required
          error={errors.experience_level}
        >
          <Select id="experience_level" name="experience_level" required defaultValue="">
            <option value="" disabled>
              Pilih salah satu
            </option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Nama kontak darurat"
          htmlFor="emergency_contact_name"
          required
          error={errors.emergency_contact_name}
        >
          <Input
            id="emergency_contact_name"
            name="emergency_contact_name"
            placeholder="Orang tua, pasangan, atau saudara"
            required
          />
        </Field>

        <Field
          label="Nomor kontak darurat"
          htmlFor="emergency_contact_phone"
          required
          error={errors.emergency_contact_phone}
        >
          <Input
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            type="tel"
            inputMode="tel"
            placeholder="081234567890"
            required
          />
        </Field>

        <Field
          label="Riwayat kesehatan"
          htmlFor="medical_notes"
          hint="Asma, alergi obat, vertigo, atau kondisi lain yang perlu diketahui tim medis."
          className="sm:col-span-2"
        >
          <Textarea
            id="medical_notes"
            name="medical_notes"
            rows={3}
            placeholder="Tulis 'tidak ada' bila tidak ada yang perlu dilaporkan."
          />
        </Field>

        <Field
          label="Catatan tambahan"
          htmlFor="notes"
          hint="Kebutuhan sewa alat, preferensi makanan, atau pertanyaan untuk trip leader."
          className="sm:col-span-2"
        >
          <Textarea id="notes" name="notes" rows={3} />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <CheckboxRow
          name="agreement"
          label={
            <>
              Saya menyatakan sehat jasmani, bersedia mengikuti arahan trip
              leader, dan berkomitmen membawa turun kembali seluruh sampah saya
              sesuai prinsip <strong>Leave No Trace</strong>.
            </>
          }
        />
        {errors.agreement && (
          <p role="alert" className="text-xs font-medium text-terracotta-700">
            {errors.agreement}
          </p>
        )}
      </div>

      <SubmitButton isFull={isFull} />

      <p className="text-xs leading-relaxed text-granite-500">
        Data yang kamu kirim hanya kami gunakan untuk keperluan pendataan
        peserta dan keselamatan selama trip berlangsung.
      </p>
    </form>
  );
}
