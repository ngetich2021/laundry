"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReportDateFilter({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState(selectedDate);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(`/admin/reports?date=${date}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div className="space-y-1">
        <Label htmlFor="date" className="text-xs">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={pending}
          className="h-9"
        />
      </div>
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        View
      </Button>
    </form>
  );
}
