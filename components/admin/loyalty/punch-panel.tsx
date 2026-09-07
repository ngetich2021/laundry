"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TargetProgress } from "@/components/admin/target-progress";
import { addPunch, redeemFreeWash, updateFreeWashThreshold } from "@/actions/loyalty";
import { loyaltyFreeWashesAvailable, loyaltyPunchesIntoCycle } from "@/lib/calc";

export interface PunchRow {
  id: string;
  visitDate: string;
  note: string | null;
}

export function PunchPanel({
  clientId,
  cardId,
  punchesCount,
  freeWashThreshold,
  totalFreeWashesEarned,
  totalFreeWashesRedeemed,
  punches,
}: {
  clientId: string;
  cardId: string;
  punchesCount: number;
  freeWashThreshold: number;
  totalFreeWashesEarned: number;
  totalFreeWashesRedeemed: number;
  punches: PunchRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const into = loyaltyPunchesIntoCycle({ punchesCount, freeWashThreshold });
  const available = loyaltyFreeWashesAvailable({ totalFreeWashesEarned, totalFreeWashesRedeemed });

  function onUpdateThreshold(formData: FormData) {
    startTransition(async () => {
      try {
        await updateFreeWashThreshold(cardId, formData);
        toast.success("Updated");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onPunch(formData: FormData) {
    startTransition(async () => {
      try {
        await addPunch(clientId, formData);
        toast.success("Punch added");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onRedeem() {
    startTransition(async () => {
      try {
        await redeemFreeWash(cardId);
        toast.success("Free wash redeemed");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-3">
      <TargetProgress
        current={into}
        target={freeWashThreshold}
        label={
          available > 0
            ? `${available} free wash ready`
            : `${into} / ${freeWashThreshold} punches this cycle`
        }
      />

      {available > 0 && (
        <Button size="sm" variant="outline" className="w-full" onClick={onRedeem} disabled={pending}>
          Redeem free wash
        </Button>
      )}

      <form action={onUpdateThreshold} className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label htmlFor={`threshold-${cardId}`} className="text-xs text-muted-foreground">
            Washes needed for a free wash
          </label>
          <Input id={`threshold-${cardId}`} name="freeWashThreshold" type="number" min={1} max={100} defaultValue={freeWashThreshold} className="h-8" />
        </div>
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          Save
        </Button>
      </form>

      <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
        {punches.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted-foreground">No punches yet.</p>
        ) : (
          punches
            .slice()
            .reverse()
            .map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span>{p.note || "Wash visit"}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(p.visitDate), "d MMM")}</span>
              </div>
            ))
        )}
      </div>

      <Separator />
      <form action={onPunch} className="flex items-center gap-2">
        <Input name="note" placeholder="Optional note" className="h-8" />
        <Button type="submit" size="sm" disabled={pending}>
          Add punch
        </Button>
      </form>
    </div>
  );
}
