"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-terracotta-700 transition-colors hover:bg-terracotta-50 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {label}
    </button>
  );
}

/**
 * Konfirmasi dipasang di sisi klien agar penghapusan tidak terjadi karena
 * salah klik. Otorisasi sebenarnya tetap diperiksa di dalam server action.
 */
export function DeleteForm({
  action,
  confirmMessage,
  label = "Hapus",
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  confirmMessage: string;
  label?: string;
  children?: ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="inline"
    >
      {children}
      <SubmitButton label={label} />
    </form>
  );
}
