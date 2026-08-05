import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

/**
 * Form ubah disembunyikan di balik <details> supaya satu halaman cukup untuk
 * daftar sekaligus penyuntingan — tanpa route terpisah per item.
 */
export function EditDisclosure({
  label = "Ubah",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-forest-700 transition-colors hover:bg-forest-50">
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        {label}
        <span className="text-granite-400 group-open:hidden">▸</span>
        <span className="hidden text-granite-400 group-open:inline">▾</span>
      </summary>
      <div className="mt-4 border-t border-sand-200 pt-4">{children}</div>
    </details>
  );
}
