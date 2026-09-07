"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface CategoryFormValues {
  name: string;
  icon: string;
  displayStyle: string;
  sortOrder: number;
}

const ICONS = ["Package", "WashingMachine", "Shirt", "Sparkles", "Droplets", "Wind"];

export function CategoryForm({
  action,
  defaultValues,
  onSuccess,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: CategoryFormValues;
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Category saved");
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
        <Label htmlFor="name">Service name</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Select name="icon" defaultValue={defaultValues?.icon ?? "Package"}>
            <SelectTrigger id="icon" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ICONS.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="displayStyle">Display as</Label>
          <Select name="displayStyle" defaultValue={defaultValues?.displayStyle ?? "LIST"}>
            <SelectTrigger id="displayStyle" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LIST">List of prices (e.g. sizes)</SelectItem>
              <SelectItem value="SINGLE">One big price (e.g. per kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
