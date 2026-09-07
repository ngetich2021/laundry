"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "cn";
import { createReferral } from "@/actions/referrals";

export function ReferralForm({
  clients,
  onSuccess,
}: {
  clients: { id: string; name: string; phone: string }[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [referrerType, setReferrerType] = useState<"CLIENT" | "EXTERNAL">("CLIENT");

  function onSubmit(formData: FormData) {
    formData.set("referrerType", referrerType);
    startTransition(async () => {
      try {
        await createReferral(formData);
        toast.success("Referral recorded");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Referred by</Label>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-[3px]">
          {(["CLIENT", "EXTERNAL"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setReferrerType(t)}
              className={cn(
                "rounded-md px-2 py-1 text-sm font-medium transition-colors",
                referrerType === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "CLIENT" ? "Existing customer" : "External person"}
            </button>
          ))}
        </div>
      </div>

      {referrerType === "CLIENT" ? (
        <div className="space-y-1.5">
          <Label htmlFor="referrerClientId">Referring client</Label>
          <Select name="referrerClientId" required>
            <SelectTrigger id="referrerClientId" className="w-full">
              <SelectValue placeholder="Select the existing client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} &middot; {c.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="referrerName">Referrer&apos;s name</Label>
            <Input id="referrerName" name="referrerName" required={referrerType === "EXTERNAL"} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="referrerPhone">Referrer&apos;s phone</Label>
            <Input id="referrerPhone" name="referrerPhone" required={referrerType === "EXTERNAL"} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="referredName">New person&apos;s name</Label>
          <Input id="referredName" name="referredName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="referredPhone">Their phone</Label>
          <Input id="referredPhone" name="referredPhone" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rewardPercent">Reward for referrer (%)</Label>
        <Input id="rewardPercent" name="rewardPercent" type="number" min="0" max="100" step="1" defaultValue={10} required />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Record referral"}
      </Button>
    </form>
  );
}
