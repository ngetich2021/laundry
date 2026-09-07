"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TargetProgress } from "@/components/admin/target-progress";
import { logAchievement } from "@/actions/targets";

export interface AchievementRow {
  id: string;
  description: string | null;
  achievedAt: string;
}

export function AchievementPanel({
  campaignId,
  targetCount,
  targetMetricLabel,
  achievements,
  canManage,
}: {
  campaignId: string;
  targetCount: number;
  targetMetricLabel: string;
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
      <TargetProgress
        current={achievements.length}
        target={targetCount}
        label={`${achievements.length} / ${targetCount} ${targetMetricLabel}`}
      />

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
                <span className="text-xs text-muted-foreground">{format(new Date(a.achievedAt), "d MMM")}</span>
              </div>
            ))
        )}
      </div>

      {canManage && (
        <>
          <Separator />
          <form action={onSubmit} className="flex items-center gap-2">
            <Input name="description" placeholder="Optional note (e.g. client name)" className="h-8" />
            <Button type="submit" size="sm" disabled={pending}>
              Log +1
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
