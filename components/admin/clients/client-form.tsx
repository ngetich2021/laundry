"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ClientFormValues {
  name: string;
  phone: string;
  email?: string | null;
  businessType?: string | null;
  address?: string | null;
  source?: string | null;
  notes?: string | null;
}

export function ClientForm({
  action,
  defaultValues,
  onSuccess,
  submitLabel = "Save client",
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: ClientFormValues;
  onSuccess?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Client saved");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={defaultValues?.phone} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="businessType">Business type</Label>
          <Input
            id="businessType"
            name="businessType"
            placeholder="e.g. Salon, Barbershop"
            defaultValue={defaultValues?.businessType ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="source">How they found us</Label>
          <Input id="source" name="source" placeholder="e.g. Flyer, Referral" defaultValue={defaultValues?.source ?? ""} />
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
