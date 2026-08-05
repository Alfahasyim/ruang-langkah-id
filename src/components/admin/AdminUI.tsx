import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-950 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-granite-600">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sand-300 bg-white p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Panel>
      <p className="text-xs tracking-wide text-granite-500 uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-forest-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-granite-500">{hint}</p>}
    </Panel>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-sand-300 bg-white p-12 text-center">
      <p className="font-semibold text-forest-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-granite-600">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "warning" | "danger";
  children: ReactNode;
}) {
  const TONES = {
    neutral: "bg-sand-200 text-granite-700",
    success: "bg-moss-100 text-forest-700",
    warning: "bg-gold-100 text-gold-600",
    danger: "bg-terracotta-100 text-terracotta-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
      <table className="w-full min-w-[46rem] text-left text-sm">
        <thead className="border-b border-sand-200 bg-sand-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-5 py-3.5 text-xs font-semibold tracking-wide text-granite-600 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-200">{children}</tbody>
      </table>
    </div>
  );
}
