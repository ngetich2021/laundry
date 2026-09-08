"use client";

import { format } from "date-fns";
import { cn } from "cn";
import { TargetProgress } from "@/components/admin/target-progress";
import { campaignDailyBreakdown } from "@/lib/calc";

function cellColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500 text-white";
  if (pct >= 50) return "bg-amber-400 text-amber-950";
  if (pct > 0) return "bg-orange-300 text-orange-950";
  return "bg-muted text-muted-foreground";
}

export function CampaignDailyProgress({
  startDate,
  endDate,
  targetCount,
  cadence,
  targetMetricLabel,
  achievements,
}: {
  startDate: string;
  endDate: string;
  targetCount: number;
  cadence: "ONE_OFF" | "DAILY";
  targetMetricLabel: string;
  achievements: { achievedAt: string }[];
}) {
  const { days, totalDays, daysElapsed, totalTarget, totalAchieved, overallPct, dailyTarget, isDaily } =
    campaignDailyBreakdown({ startDate, endDate, targetCount, cadence }, achievements);

  return (
    <div className="space-y-2">
      <TargetProgress
        current={totalAchieved}
        target={totalTarget}
        label={isDaily ? `${totalAchieved}/${totalTarget} across ${totalDays} days` : `${totalAchieved}/${totalTarget} ${targetMetricLabel}`}
      />

      {isDaily && (
        <>
          <div className="flex flex-wrap gap-1">
            {days.map((d) => (
              <div
                key={d.date.toISOString()}
                title={`${format(d.date, "d MMM")}: ${d.count}/${d.target} logged`}
                className={cn(
                  "flex h-9 w-9 flex-col items-center justify-center rounded-md text-[10px] font-semibold leading-none transition-colors",
                  cellColor(d.pct)
                )}
              >
                <span>{format(d.date, "d")}</span>
                <span className="text-[9px] font-normal opacity-80">{d.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Day {daysElapsed} of {totalDays} &middot; {dailyTarget}/day target ({targetMetricLabel}) &middot;{" "}
            <span className={cn("font-medium", overallPct >= 100 ? "text-emerald-600 dark:text-emerald-400" : "")}>
              {overallPct}% of the {totalDays}-day goal
            </span>
          </p>
        </>
      )}
    </div>
  );
}
