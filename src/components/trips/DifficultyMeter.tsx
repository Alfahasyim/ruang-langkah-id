import { cn, DIFFICULTY_META } from "@/lib/utils";

const FILL_TONE = [
  "bg-moss-400",
  "bg-moss-500",
  "bg-gold-400",
  "bg-terracotta-400",
  "bg-terracotta-600",
];

export function DifficultyMeter({
  level,
  showCaption = false,
  className,
}: {
  level: number;
  showCaption?: boolean;
  className?: string;
}) {
  const meta = DIFFICULTY_META[level] ?? DIFFICULTY_META[3];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1"
          role="img"
          aria-label={`Tingkat kesulitan ${level} dari 5 — ${meta.tier}`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index < level
                  ? `w-5 ${FILL_TONE[level - 1]}`
                  : "w-3 bg-granite-200",
              )}
            />
          ))}
        </div>
        <span className="text-xs font-semibold tracking-wide text-granite-700">
          {meta.tier}
          <span className="ml-1 font-normal text-granite-400">
            {level}/5
          </span>
        </span>
      </div>
      {showCaption && (
        <p className="text-xs leading-relaxed text-granite-500">
          {meta.caption}
        </p>
      )}
    </div>
  );
}
