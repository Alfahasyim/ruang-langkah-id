import Link from "next/link";
import { CategoryIcon } from "./CategoryIcon";
import type { TripCategory } from "@/lib/types";
import { CATEGORY_META, cn } from "@/lib/utils";

const CATEGORIES: TripCategory[] = ["gunung", "curug", "hutan"];

export function TripFilterBar({ active }: { active?: TripCategory }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filter kategori trip">
      <Link
        href="/trip"
        aria-current={!active ? "true" : undefined}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
          !active
            ? "border-moss-400 bg-moss-400/15 text-moss-200"
            : "border-forest-700 text-forest-200 hover:border-moss-400/60 hover:text-sand-50",
        )}
      >
        Semua kategori
      </Link>

      {CATEGORIES.map((category) => {
        const isActive = active === category;

        return (
          <Link
            key={category}
            href={`/trip?kategori=${category}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "border-moss-400 bg-moss-400/15 text-moss-200"
                : "border-forest-700 text-forest-200 hover:border-moss-400/60 hover:text-sand-50",
            )}
          >
            <CategoryIcon category={category} className="h-4 w-4" />
            {CATEGORY_META[category].label}
          </Link>
        );
      })}
    </nav>
  );
}
