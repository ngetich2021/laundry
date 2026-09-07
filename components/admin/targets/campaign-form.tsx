"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCampaign } from "@/actions/targets";

export function CampaignForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createCampaign(formData);
        toast.success("Campaign created");
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
        <Label htmlFor="name">Campaign name</Label>
        <Input id="name" name="name" placeholder="e.g. Salon flyer drive - Sept" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue="FLYER">
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLYER">Flyer</SelectItem>
              <SelectItem value="SOCIAL">Social</SelectItem>
              <SelectItem value="REFERRAL_PUSH">Referral push</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetCount">Target count</Label>
          <Input id="targetCount" name="targetCount" type="number" min="1" step="1" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="targetMetricLabel">What are we counting?</Label>
        <Input id="targetMetricLabel" name="targetMetricLabel" placeholder="e.g. Salons signed up" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End date</Label>
          <Input id="endDate" name="endDate" type="date" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating..." : "Create campaign"}
      </Button>
    </form>
  );
}
