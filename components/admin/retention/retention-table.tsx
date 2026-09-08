"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { AccountForm } from "./account-form";
import { InvoicePanel, type InvoiceRow } from "./invoice-panel";
import { deleteRetentionAccount, setRetentionStatus } from "@/actions/retention";
import { formatKES, retentionAccountBalance } from "@/lib/calc";

export interface RetentionAccountRow {
  id: string;
  planType: "MONTHLY" | "PAY_AS_YOU_GO";
  monthlyAmount: number;
  monthlyDiscountPercent: number;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  client: { id: string; name: string; phone: string };
  invoices: InvoiceRow[];
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  CANCELLED: "destructive",
};

export function RetentionTable({
  accounts,
  clients,
  canManage,
}: {
  accounts: RetentionAccountRow[];
  clients: { id: string; name: string; phone: string }[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = accounts.find((a) => a.id === selectedId) ?? null;

  function onDelete(id: string) {
    if (!confirm("Delete this retention account? This also removes its invoices. This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteRetentionAccount(id);
        toast.success("Account deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onStatusChange(id: string, status: "ACTIVE" | "PAUSED" | "CANCELLED") {
    startTransition(async () => {
      try {
        await setRetentionStatus(id, status);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<RetentionAccountRow>[] = [
    { key: "client", header: "Client", render: (a) => <span className="font-medium">{a.client.name}</span> },
    {
      key: "plan",
      header: "Plan",
      render: (a) => (a.planType === "MONTHLY" ? `Monthly (${a.monthlyDiscountPercent}% off)` : "Pay as you go"),
    },
    { key: "amount", header: "Monthly amount", render: (a) => formatKES(a.monthlyAmount) },
    {
      key: "balance",
      header: "Balance",
      render: (a) => {
        const balance = retentionAccountBalance(a.invoices);
        return balance > 0 ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">{formatKES(balance)}</span>
        ) : (
          <span className="text-emerald-600 dark:text-emerald-400">Settled</span>
        );
      },
    },
    { key: "status", header: "Status", render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge> },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (a) => (
        <RowActions
          onView={() => setSelectedId(a.id)}
          onDelete={canManage ? () => onDelete(a.id) : undefined}
          deleteLabel="Delete account"
          disabled={pending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Retention Accounts</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> New account
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search by client..."
        searchFn={(row, q) => row.client.name.toLowerCase().includes(q)}
        emptyMessage="No retention accounts yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New retention account">
        <AccountForm clients={clients} onSuccess={() => setAddOpen(false)} />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.client.name ?? ""}
        description={selected ? (selected.planType === "MONTHLY" ? `Monthly plan, ${selected.monthlyDiscountPercent}% discount` : "Pay as you go") : undefined}
      >
        {selected && (
          <div className="space-y-3">
            {canManage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Select value={selected.status} onValueChange={(v) => v && onStatusChange(selected.id, v as "ACTIVE" | "PAUSED" | "CANCELLED")} disabled={pending}>
                  <SelectTrigger size="sm" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-3 text-sm">
              <p><span className="text-muted-foreground">Monthly amount:</span> {formatKES(selected.monthlyAmount)}</p>
              <p><span className="text-muted-foreground">Discount:</span> {selected.monthlyDiscountPercent}%</p>
              <p><span className="text-muted-foreground">Client:</span> {selected.client.name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selected.client.phone}</p>
            </div>

            <InvoicePanel accountId={selected.id} invoices={selected.invoices} canManage={canManage} />

            {canManage && (
              <>
                <Separator />
                <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
                  Delete account
                </Button>
              </>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
