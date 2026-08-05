import type { TripCategory } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateRange(start: string, end?: string | null) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const day = new Intl.DateTimeFormat("id-ID", { day: "numeric" });
  const full = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return full.format(startDate);
  }

  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  return sameMonth
    ? `${day.format(startDate)}–${full.format(endDate)}`
    : `${full.format(startDate)} – ${full.format(endDate)}`;
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function tripDurationLabel(start: string, end?: string | null) {
  if (!end) return "1 hari";
  const days =
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000,
    ) + 1;
  return days <= 1 ? "1 hari" : `${days} hari ${days - 1} malam`;
}

export const CATEGORY_META: Record<
  TripCategory,
  { label: string; description: string; gradient: string; accent: string }
> = {
  gunung: {
    label: "Gunung",
    description: "Pendakian puncak dan padang sabana",
    gradient: "from-forest-800 via-forest-600 to-moss-400",
    accent: "text-forest-700 bg-forest-100 ring-forest-200",
  },
  curug: {
    label: "Curug",
    description: "Eksplorasi air terjun dan sungai jernih",
    gradient: "from-forest-700 via-moss-500 to-gold-300",
    accent: "text-terracotta-700 bg-terracotta-100 ring-terracotta-200",
  },
  hutan: {
    label: "Hutan",
    description: "Penjelajahan rimba dan pengamatan satwa",
    gradient: "from-forest-950 via-forest-700 to-moss-500",
    accent: "text-gold-600 bg-gold-100 ring-gold-200",
  },
};

export const DIFFICULTY_META: Record<
  number,
  { tier: string; caption: string }
> = {
  1: { tier: "Pemula", caption: "Trek landai, cocok untuk langkah pertama" },
  2: { tier: "Pemula", caption: "Tanjakan ringan, stamina dasar cukup" },
  3: { tier: "Menengah", caption: "Trek panjang dengan tanjakan bervariasi" },
  4: { tier: "Lanjutan", caption: "Medan curam, butuh pengalaman camping" },
  5: { tier: "Lanjutan", caption: "Ekspedisi berat, fisik dan mental teruji" },
};
