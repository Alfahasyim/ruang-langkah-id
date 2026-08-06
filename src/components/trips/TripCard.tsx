import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mountain, Users } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import { DifficultyMeter } from "./DifficultyMeter";
import type { Trip } from "@/lib/types";
import {
  CATEGORY_META,
  cn,
  formatDateRange,
  formatRupiah,
  tripDurationLabel,
} from "@/lib/utils";

export function TripCard({ trip }: { trip: Trip }) {
  const meta = CATEGORY_META[trip.category];
  const isFull = trip.seats_remaining <= 0 || trip.status === "full";
  const isTight = !isFull && trip.seats_remaining <= 5;
  const filledPercent = Math.round((trip.seats_taken / trip.quota) * 100);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand-300 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-forest-900/10">
      <div
        className={cn(
          "relative flex h-40 items-end bg-linear-to-br p-5",
          meta.gradient,
        )}
      >
        <CategoryIcon
          category={trip.category}
          className="absolute -top-3 -right-3 h-32 w-32 text-white/15"
        />
        <div className="relative flex w-full items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-800 backdrop-blur">
            <CategoryIcon category={trip.category} className="h-3.5 w-3.5" />
            {meta.label}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isFull
                ? "bg-granite-800/80 text-sand-100"
                : isTight
                  ? "bg-terracotta-500 text-white"
                  : "bg-white/90 text-forest-800",
            )}
          >
            {isFull
              ? "Kuota penuh"
              : isTight
                ? `Sisa ${trip.seats_remaining} kursi`
                : `${trip.seats_remaining} kursi`}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg leading-snug font-semibold text-balance text-forest-950">
            <Link href={`/trip/${trip.slug}`} className="hover:underline">
              {trip.title}
            </Link>
          </h3>
          <p className="whitespace-pre-line mt-2 text-sm leading-relaxed text-granite-600">
            {trip.summary}
          </p>
        </div>

        <dl className="grid gap-2 text-sm text-granite-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-forest-500" aria-hidden />
            <dd>
              {trip.location}
              {trip.province && (
                <span className="text-granite-400"> · {trip.province}</span>
              )}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-forest-500" aria-hidden />
            <dd>
              {formatDateRange(trip.start_date, trip.end_date)}
              <span className="text-granite-400">
                {" "}
                · {tripDurationLabel(trip.start_date, trip.end_date)}
              </span>
            </dd>
          </div>
          {trip.elevation_m && (
            <div className="flex items-center gap-2">
              <Mountain className="h-4 w-4 shrink-0 text-forest-500" aria-hidden />
              <dd>{trip.elevation_m.toLocaleString("id-ID")} mdpl</dd>
            </div>
          )}
        </dl>

        <DifficultyMeter level={trip.difficulty_level} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-granite-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {trip.seats_taken} dari {trip.quota} peserta
            </span>
            <span>{filledPercent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-sand-200">
            <div
              className={cn(
                "h-full rounded-full",
                isFull ? "bg-granite-400" : "bg-forest-600",
              )}
              style={{ width: `${Math.min(filledPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-sand-200 pt-4">
          <div>
            <p className="text-xs text-granite-500">Kontribusi</p>
            <p className="text-lg font-semibold text-forest-900">
              {formatRupiah(trip.price)}
            </p>
          </div>
          <Link
            href={`/trip/${trip.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-forest-800"
          >
            {isFull ? "Daftar waiting list" : "Ambil kursi"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
