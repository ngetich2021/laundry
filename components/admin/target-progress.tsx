"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "cn";

export function progressPercent(current: number, target: number) {
  return target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

function barColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 75) return "bg-lime-500";
  if (pct >= 50) return "bg-amber-500";
  if (pct >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function textColor(pct: number) {
  if (pct >= 100) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 75) return "text-lime-600 dark:text-lime-400";
  if (pct >= 50) return "text-amber-600 dark:text-amber-400";
  if (pct >= 25) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function TargetProgress({
  current,
  target,
  label,
  className,
}: {
  current: number;
  target: number;
  label?: string;
  className?: string;
}) {
  const pct = progressPercent(current, target);
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium">{label ?? `${current}/${target}`}</span>
        <span className={cn("font-semibold tabular-nums", textColor(pct))}>{pct}%</span>
      </div>
      <ProgressPrimitive.Root value={pct} className="block">
        <ProgressPrimitive.Track className="relative flex h-1.5 w-full items-center overflow-hidden rounded-full bg-muted">
          <ProgressPrimitive.Indicator className={cn("h-full rounded-full transition-all", barColor(pct))} />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
    </div>
  );
}
