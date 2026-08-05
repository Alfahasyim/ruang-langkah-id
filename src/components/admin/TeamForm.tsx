"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, UserPlus } from "lucide-react";
import {
  CheckboxRow,
  Field,
  FormAlert,
  Input,
  Textarea,
} from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { saveTeamMember } from "@/lib/admin/content-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";
import type { TeamMemberRow } from "@/lib/admin/queries";

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
          <UserPlus className="h-4 w-4" aria-hidden />
          {isEdit ? "Simpan perubahan" : "Tambah ke tim"}
        </>
      )}
    </Button>
  );
}

export function TeamForm({
  member,
  nextSortOrder = 0,
}: {
  member?: TeamMemberRow;
  nextSortOrder?: number;
}) {
  const [state, formAction] = useActionState(saveTeamMember, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};
  const uid = member?.id ?? "baru";

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {member && <input type="hidden" name="id" value={member.id} />}

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <Field
        label="Nama lengkap"
        htmlFor={`full_name-${uid}`}
        required
        error={errors.full_name}
      >
        <Input
          id={`full_name-${uid}`}
          name="full_name"
          defaultValue={member?.full_name}
          placeholder="Rama Wijanarko"
          required
        />
      </Field>

      <Field
        label="Peran di komunitas"
        htmlFor={`role-${uid}`}
        required
        error={errors.role}
      >
        <Input
          id={`role-${uid}`}
          name="role"
          defaultValue={member?.role}
          placeholder="Ketua Komunitas & Trip Leader"
          required
        />
      </Field>

      <Field
        label="Bio singkat"
        htmlFor={`bio-${uid}`}
        hint="Dua sampai tiga kalimat. Ceritakan pengalaman dan perannya di lapangan."
        required
        error={errors.bio}
      >
        <Textarea
          id={`bio-${uid}`}
          name="bio"
          rows={4}
          defaultValue={member?.bio}
          required
        />
      </Field>

      <Field
        label="Urutan tampil"
        htmlFor={`sort_order-${uid}`}
        hint="Angka kecil tampil lebih dulu."
      >
        <Input
          id={`sort_order-${uid}`}
          name="sort_order"
          type="number"
          defaultValue={member?.sort_order ?? nextSortOrder}
        />
      </Field>

      <Field
        label="Foto profil"
        htmlFor={`photo-${uid}`}
        hint={
          member?.photo_path
            ? "Sudah ada foto. Pilih berkas baru hanya bila ingin menggantinya."
            : "JPG, PNG, WebP, atau AVIF. Maksimal 4 MB. Kosongkan untuk memakai inisial berwarna."
        }
        error={errors.photo}
      >
        <input
          id={`photo-${uid}`}
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-granite-700 file:mr-4 file:rounded-full file:border-0 file:bg-forest-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sand-50"
        />
      </Field>

      <CheckboxRow
        name="is_published"
        defaultChecked={member?.is_published ?? true}
        label="Tampilkan di halaman Tentang Kami"
      />

      <SubmitButton isEdit={Boolean(member)} />
    </form>
  );
}
