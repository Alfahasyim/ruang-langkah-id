"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, LogIn } from "lucide-react";
import { Field, FormAlert, Input } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { signInAdmin } from "@/lib/admin/auth-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Memeriksa…
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" aria-hidden />
          Masuk
        </>
      )}
    </Button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signInAdmin, INITIAL_FORM_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="lanjut" value={next} />

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@ruanglangkah.id"
          required
        />
      </Field>

      <Field label="Kata sandi" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <SubmitButton />
    </form>
  );
}
