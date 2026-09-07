"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { AccountForm } from "./account-form";
import { InvoicePanel, type InvoiceRow } from "./invoice-panel";
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
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = accounts.find((a) => a.id === selectedId) ?? null;

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
        {selected && <InvoicePanel accountId={selected.id} invoices={selected.invoices} canManage={canManage} />}
      </RowDialog>
    </div>
  );
}
