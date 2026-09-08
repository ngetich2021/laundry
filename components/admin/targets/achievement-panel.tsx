"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CampaignDailyProgress } from "@/components/admin/targets/campaign-daily-progress";
import { logAchievement } from "@/actions/targets";

export interface AchievementRow {
  id: string;
  description: string | null;
  achievedAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  FLYER: "Flyer",
  SOCIAL: "Social",
  REFERRAL_PUSH: "Referral push",
  OTHER: "Other",
};

export function AchievementPanel({
  campaignId,
  type,
  startDate,
  endDate,
  targetCount,
  cadence,
  targetMetricLabel,
  notes,
  achievements,
  canManage,
}: {
  campaignId: string;
  type: string;
  startDate: string;
  endDate: string;
  targetCount: number;
  cadence: "ONE_OFF" | "DAILY";
  targetMetricLabel: string;
  notes: string | null;
  achievements: AchievementRow[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await logAchievement(campaignId, formData);
        toast.success("Logged");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{TYPE_LABEL[type] ?? type}</Badge>
        <Badge variant="outline">{cadence === "DAILY" ? "Daily target" : "One-off target"}</Badge>
      </div>

      <CampaignDailyProgress
        startDate={startDate}
        endDate={endDate}
        targetCount={targetCount}
        cadence={cadence}
        targetMetricLabel={targetMetricLabel}
        achievements={achievements}
      />

      {notes && (
        <p className="rounded-md bg-muted/50 p-2 text-sm">
          <span className="text-muted-foreground">Notes: </span>
          {notes}
        </p>
      )}

      <Separator />

      <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border p-2">
        {achievements.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No achievements logged yet.</p>
        ) : (
          achievements
            .slice()
            .reverse()
            .map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span>{a.description || targetMetricLabel}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(a.achievedAt), "d MMM, HH:mm")}</span>
              </div>
            ))
        )}
      </div>

      {canManage && (
        <form action={onSubmit} className="flex items-center gap-2">
          <Input name="description" placeholder="Optional note (e.g. client name)" className="h-8" />
          <Button type="submit" size="sm" disabled={pending}>
            Log +1
          </Button>
        </form>
      )}
    </div>
  );
}
