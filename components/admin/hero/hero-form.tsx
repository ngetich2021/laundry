"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface HeroFormValues {
  label: string;
  body: string;
  ctaText: string;
  ctaLink?: string | null;
  imageUrl: string;
  sortOrder: number;
}

export function HeroForm({
  action,
  defaultValues,
  onSuccess,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: HeroFormValues;
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Hero slide saved");
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
        <Label htmlFor="label">Headline</Label>
        <Input id="label" name="label" defaultValue={defaultValues?.label} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Description</Label>
        <Textarea id="body" name="body" rows={2} defaultValue={defaultValues?.body} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="ctaText">Button text</Label>
          <Input id="ctaText" name="ctaText" defaultValue={defaultValues?.ctaText} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctaLink">Button link (optional)</Label>
          <Input id="ctaLink" name="ctaLink" placeholder="Leave blank to open the booking form" defaultValue={defaultValues?.ctaLink ?? ""} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="/iron.jpeg or https://..."
          defaultValue={defaultValues?.imageUrl}
          required
        />
        <p className="text-xs text-muted-foreground">Use an existing image path (e.g. /wash1.jpeg) or a full image URL.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sortOrder">Order (lower shows first)</Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={defaultValues?.sortOrder ?? 0} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
