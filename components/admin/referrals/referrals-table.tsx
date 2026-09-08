"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { ReferralForm } from "./referral-form";
import { convertReferral, applyReward, deleteReferral } from "@/actions/referrals";

export interface ReferralRow {
  id: string;
  referrerName: string;
  referrerPhone: string;
  referredName: string;
  referredPhone: string;
  rewardPercent: number;
  status: "PENDING" | "CONVERTED" | "REWARD_APPLIED" | "EXPIRED";
  appliedToOrderRef: string | null;
  createdAt: string;
  referrerClient: { id: string; name: string; phone: string } | null;
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "outline",
  CONVERTED: "secondary",
  REWARD_APPLIED: "default",
  EXPIRED: "destructive",
};

export function ReferralsTable({
  referrals,
  clients,
  canManage,
}: {
  referrals: ReferralRow[];
  clients: { id: string; name: string; phone: string }[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = referrals.find((r) => r.id === selectedId) ?? null;

  function onConvert(id: string) {
    startTransition(async () => {
      try {
        await convertReferral(id);
        toast.success("Marked as converted");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onApply(id: string, formData: FormData) {
    startTransition(async () => {
      try {
        await applyReward(id, formData);
        toast.success("Reward applied");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this referral? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteReferral(id);
        toast.success("Referral deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<ReferralRow>[] = [
    {
      key: "referrer",
      header: "Referred by",
      render: (r) => (
        <span className="flex items-center gap-2 font-medium">
          {r.referrerName}
          {!r.referrerClient && <Badge variant="outline">external</Badge>}
        </span>
      ),
    },
    { key: "referred", header: "New person", render: (r) => `${r.referredName} (${r.referredPhone})` },
    { key: "reward", header: "Reward", render: (r) => `${r.rewardPercent}%` },
    { key: "status", header: "Status", render: (r) => <Badge variant={statusVariant[r.status]}>{r.status.replace("_", " ")}</Badge> },
    { key: "createdAt", header: "Recorded", render: (r) => format(new Date(r.createdAt), "d MMM yyyy") },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (r) => (
        <RowActions
          onView={() => setSelectedId(r.id)}
          onDelete={canManage ? () => onDelete(r.id) : undefined}
          deleteLabel="Delete referral"
          disabled={pending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Referrals</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> Record referral
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={referrals}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search referrals..."
        searchFn={(row, q) => row.referredName.toLowerCase().includes(q) || row.referrerName.toLowerCase().includes(q)}
        emptyMessage="No referrals recorded yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="Record a referral">
        <ReferralForm clients={clients} onSuccess={() => setAddOpen(false)} />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.referredName ?? ""}
        description={selected ? `Referred by ${selected.referrerName} (${selected.referrerPhone})` : undefined}
      >
        {selected && (
          <div className="space-y-3">
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Referrer:</span> {selected.referrerName} ({selected.referrerPhone}){!selected.referrerClient && <Badge className="ml-1.5" variant="outline">external</Badge>}</p>
              <p><span className="text-muted-foreground">New person:</span> {selected.referredName} ({selected.referredPhone})</p>
              <p><span className="text-muted-foreground">Reward:</span> {selected.rewardPercent}% off referrer&apos;s next order</p>
              <p><span className="text-muted-foreground">Recorded:</span> {format(new Date(selected.createdAt), "d MMM yyyy")}</p>
            </div>
            {canManage && selected.status === "PENDING" && (
              <Button size="sm" className="w-full" onClick={() => onConvert(selected.id)} disabled={pending}>
                Mark as converted (client signed up)
              </Button>
            )}
            {canManage && selected.status === "CONVERTED" && (
              <>
                <Separator />
                <form action={(fd) => onApply(selected.id, fd)} className="flex items-center gap-2">
                  <Input name="appliedToOrderRef" placeholder="Order/receipt ref (optional)" className="h-8" />
                  <Button type="submit" size="sm" disabled={pending}>
                    Apply reward
                  </Button>
                </form>
              </>
            )}
            {selected.status === "REWARD_APPLIED" && (
              <p className="text-sm text-muted-foreground">Applied to: {selected.appliedToOrderRef || "—"}</p>
            )}
            {canManage && (
              <>
                <Separator />
                <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
                  Delete referral
                </Button>
              </>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
