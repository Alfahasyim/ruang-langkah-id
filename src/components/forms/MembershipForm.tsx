"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, UserPlus } from "lucide-react";
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
import { joinCommunity } from "@/lib/actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";

const INTERESTS = [
  { value: "gunung", label: "Pendakian gunung" },
  { value: "curug", label: "Eksplorasi curug" },
  { value: "hutan", label: "Penjelajahan hutan" },
  { value: "konservasi", label: "Aksi konservasi & bersih alam" },
  { value: "dokumentasi", label: "Fotografi & dokumentasi" },
  { value: "edukasi", label: "Kelas & pelatihan outdoor" },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Mengirim formulir…
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" aria-hidden />
          Gabung komunitas
        </>
      )}
    </Button>
  );
}

export function MembershipForm() {
  const [state, formAction] = useActionState(joinCommunity, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") {
    return <FormAlert status="success" message={state.message} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nama lengkap"
          htmlFor="member_full_name"
          required
          error={errors.full_name}
          className="sm:col-span-2"
        >
          <Input id="member_full_name" name="full_name" autoComplete="name" required />
        </Field>

        <Field label="Email" htmlFor="member_email" required error={errors.email}>
          <Input
            id="member_email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            required
          />
        </Field>

        <Field
          label="Nomor WhatsApp"
          htmlFor="member_phone"
          required
          error={errors.phone}
        >
          <Input
            id="member_phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="081234567890"
            required
          />
        </Field>

        <Field
          label="Domisili"
          htmlFor="member_city"
          hint="Kami mengelompokkan anggota per chapter kota."
          required
          error={errors.city}
        >
          <Input id="member_city" name="city" placeholder="Bogor" required />
        </Field>

        <Field label="Tanggal lahir" htmlFor="member_birth_date">
          <Input id="member_birth_date" name="birth_date" type="date" />
        </Field>

        <Field
          label="Level pengalaman"
          htmlFor="member_experience"
          required
          error={errors.experience_level}
          className="sm:col-span-2"
        >
          <Select id="member_experience" name="experience_level" required defaultValue="">
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
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-forest-900">
          Minat kegiatan <span className="text-terracotta-600">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {INTERESTS.map((interest) => (
            <CheckboxRow
              key={interest.value}
              name="interests"
              value={interest.value}
              label={interest.label}
            />
          ))}
        </div>
        {errors.interests && (
          <p role="alert" className="text-xs font-medium text-terracotta-700">
            {errors.interests}
          </p>
        )}
      </fieldset>

      <Field
        label="Kenapa ingin bergabung?"
        htmlFor="motivation"
        hint="Ceritakan singkat harapanmu di Ruang Langkah — tidak ada jawaban yang salah."
        required
        error={errors.motivation}
      >
        <Textarea
          id="motivation"
          name="motivation"
          rows={4}
          placeholder="Saya ingin belajar mendaki dengan aman dan bertemu teman yang peduli lingkungan…"
          required
        />
      </Field>

      <div className="flex flex-col gap-2">
        <CheckboxRow
          name="agreement"
          label={
            <>
              Saya menyetujui <strong>kode etik komunitas</strong>: menghormati
              sesama anggota dan warga lokal, mengikuti standar keselamatan, dan
              menerapkan prinsip Leave No Trace di setiap kegiatan.
            </>
          }
        />
        {errors.agreement && (
          <p role="alert" className="text-xs font-medium text-terracotta-700">
            {errors.agreement}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
