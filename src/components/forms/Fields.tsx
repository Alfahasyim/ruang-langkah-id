import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-forest-950 placeholder:text-granite-400 transition-colors focus:border-forest-500 focus:outline-none disabled:bg-sand-100";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-forest-900">
        {label}
        {required && <span className="ml-1 text-terracotta-600">*</span>}
      </label>
      {hint && <p className="text-xs text-granite-500">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-terracotta-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(CONTROL, "resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(CONTROL, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function CheckboxRow({
  label,
  ...props
}: { label: ReactNode } & ComponentProps<"input">) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand-300 bg-white p-4 text-sm text-granite-700 transition-colors has-checked:border-forest-500 has-checked:bg-forest-50">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-forest-700"
        {...props}
      />
      <span className="leading-relaxed">{label}</span>
    </label>
  );
}

export function FormAlert({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-xl border p-4 text-sm leading-relaxed",
        status === "success"
          ? "border-moss-300 bg-moss-100 text-forest-900"
          : "border-terracotta-200 bg-terracotta-50 text-terracotta-800",
      )}
    >
      {message}
    </div>
  );
}

export const EXPERIENCE_OPTIONS = [
  "Baru pertama kali",
  "Pemula (1–3 kegiatan)",
  "Menengah (4–10 kegiatan)",
  "Lanjutan (lebih dari 10 kegiatan)",
];
