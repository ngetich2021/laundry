"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRetentionAccount } from "@/actions/retention";

export function AccountForm({
  clients,
  onSuccess,
}: {
  clients: { id: string; name: string; phone: string }[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [planType, setPlanType] = useState("PAY_AS_YOU_GO");

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createRetentionAccount(formData);
        toast.success("Retention account created");
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
        <Label htmlFor="clientId">Client</Label>
        <Select name="clientId" required>
          <SelectTrigger id="clientId" className="w-full">
            <SelectValue placeholder="Select a client" />
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="planType">Plan</Label>
          <Select name="planType" value={planType} onValueChange={(v) => setPlanType(v ?? "PAY_AS_YOU_GO")}>
            <SelectTrigger id="planType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAY_AS_YOU_GO">Pay as you go</SelectItem>
              <SelectItem value="MONTHLY">Monthly (discounted)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="monthlyAmount">Monthly amount (KES)</Label>
          <Input id="monthlyAmount" name="monthlyAmount" type="number" min="0" step="1" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="monthlyDiscountPercent">Discount % (monthly only)</Label>
          <Input
            id="monthlyDiscountPercent"
            name="monthlyDiscountPercent"
            type="number"
            min="0"
            max="100"
            step="1"
            defaultValue={planType === "MONTHLY" ? 10 : 0}
            disabled={planType !== "MONTHLY"}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating..." : "Create account"}
      </Button>
    </form>
  );
}
