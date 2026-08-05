import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/trips/CategoryIcon";
import { Container } from "@/components/ui/Container";
import type { TripCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/utils";

const ORDER: TripCategory[] = ["gunung", "curug", "hutan"];

const BLURB: Record<TripCategory, string> = {
  gunung:
    "Dari bukit 1.500 mdpl untuk langkah pertama hingga ekspedisi lintas jalur di atas 3.000 mdpl.",
  curug:
    "Susur sungai, kolam alami, dan air terjun tersembunyi — trip sehari yang ramah untuk keluarga.",
  hutan:
    "Berjalan pelan di rimba tropis, mengenali pohon dan satwa bersama ranger serta warga adat.",
};

export function CategoryStrip({
  counts,
}: {
  counts: Record<TripCategory, number>;
}) {
  return (
    <section className="border-y border-sand-200 bg-white py-16">
      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {ORDER.map((category) => {
            const meta = CATEGORY_META[category];

            return (
              <Link
                key={category}
                href={`/trip?kategori=${category}`}
                className="group flex flex-col gap-4 rounded-3xl border border-sand-200 p-7 transition-all hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg hover:shadow-forest-900/5"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br text-white ${meta.gradient}`}
                  >
                    <CategoryIcon category={category} className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-granite-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-forest-950">
                    {meta.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-granite-600">
                    {BLURB[category]}
                  </p>
                </div>
                <p className="mt-auto text-xs font-semibold tracking-wide text-terracotta-600 uppercase">
                  {counts[category] ?? 0} trip dibuka
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
