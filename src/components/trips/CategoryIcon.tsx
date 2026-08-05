import { Mountain, TreePine, Waves } from "lucide-react";
import type { TripCategory } from "@/lib/types";

const ICONS = {
  gunung: Mountain,
  curug: Waves,
  hutan: TreePine,
} as const;

export function CategoryIcon({
  category,
  className,
}: {
  category: TripCategory;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={className} aria-hidden />;
}
