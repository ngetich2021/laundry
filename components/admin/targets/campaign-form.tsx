"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CampaignFormValues {
  name: string;
  type: string;
  cadence: "ONE_OFF" | "DAILY";
  targetMetricLabel: string;
  targetCount: number;
  startDate: string;
  endDate: string;
  notes?: string | null;
}

export function CampaignForm({
  action,
  defaultValues,
  onSuccess,
  submitLabel = "Create campaign",
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: CampaignFormValues;
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cadence, setCadence] = useState<"ONE_OFF" | "DAILY">(defaultValues?.cadence ?? "ONE_OFF");

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Campaign saved");
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
        <Input id="name" name="name" placeholder="e.g. WhatsApp Business & Status Updates" defaultValue={defaultValues?.name} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={defaultValues?.type ?? "FLYER"}>
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
          <Label htmlFor="cadence">Measured</Label>
          <Select name="cadence" defaultValue={cadence} onValueChange={(v) => v && setCadence(v as "ONE_OFF" | "DAILY")}>
            <SelectTrigger id="cadence" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_OFF">Once, total for the campaign</SelectItem>
              <SelectItem value="DAILY">Daily, every day it runs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="targetMetricLabel">What are we counting?</Label>
          <Input
            id="targetMetricLabel"
            name="targetMetricLabel"
            placeholder={cadence === "DAILY" ? "e.g. 3 videos and 3 pics" : "e.g. Salons signed up"}
            defaultValue={defaultValues?.targetMetricLabel}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetCount">{cadence === "DAILY" ? "Target per day" : "Target count (total)"}</Label>
          <Input id="targetCount" name="targetCount" type="number" min="1" step="1" defaultValue={defaultValues?.targetCount} required />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {cadence === "DAILY"
          ? "Progress is tracked per day and rolled up into a percentage of the full campaign window."
          : "Progress is a single running total against the target above."}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaultValues?.startDate ?? new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End date</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={defaultValues?.endDate} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={defaultValues?.notes ?? ""} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
