"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function SubmitButton({ label, title }: { label: string; title: string }) {
  const { pending } = useFormStatus();
  const iconOnly = label === "";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={iconOnly ? title : undefined}
      title={iconOnly ? title : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50",
        iconOnly
          ? "h-6 w-6 justify-center bg-terracotta-600 text-white hover:bg-terracotta-700"
          : "px-2.5 py-1.5 text-terracotta-700 hover:bg-terracotta-50",
      )}
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
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  confirmMessage: string;
  /** String kosong menghasilkan tombol ikon saja. */
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className={cn("inline", className)}
    >
      {children}
      <SubmitButton label={label} title={confirmMessage} />
    </form>
  );
}
