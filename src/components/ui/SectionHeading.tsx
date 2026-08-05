import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  action?: ReactNode;
}) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto text-center",
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-xs font-semibold uppercase tracking-[0.18em]",
              isLight ? "text-moss-300" : "text-terracotta-600",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-3xl leading-tight font-semibold text-balance sm:text-4xl",
            isLight ? "text-sand-50" : "text-forest-950",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed text-pretty",
              isLight ? "text-forest-100" : "text-granite-600",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
