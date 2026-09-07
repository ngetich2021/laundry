"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { ClientForm } from "./client-form";
import { createClient, updateClient } from "@/actions/clients";
import { formatKES, retentionAccountBalance, loyaltyFreeWashesAvailable } from "@/lib/calc";
import { format } from "date-fns";

export interface ClientRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  businessType: string | null;
  address: string | null;
  source: string | null;
  notes: string | null;
  createdAt: string;
  retentionAccounts: { id: string; status: string; invoices: { amountDue: number; amountPaid: number }[] }[];
  loyaltyCard: { totalFreeWashesEarned: number; totalFreeWashesRedeemed: number; punchesCount: number; freeWashThreshold: number } | null;
  referralsMade: { id: string; status: string }[];
}

export function ClientsTable({ clients, canManage }: { clients: ClientRow[]; canManage: boolean }) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = clients.find((c) => c.id === selectedId) ?? null;

  const columns: DataTableColumn<ClientRow>[] = [
    { key: "name", header: "Name", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "phone", header: "Phone", render: (c) => c.phone },
    { key: "businessType", header: "Business", render: (c) => c.businessType || "—" },
    {
      key: "balance",
      header: "Retention balance",
      render: (c) => {
        const balance = retentionAccountBalance(c.retentionAccounts.flatMap((a) => a.invoices));
        return balance > 0 ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">{formatKES(balance)}</span>
        ) : (
          <span className="text-muted-foreground">Kes 0</span>
        );
      },
    },
    {
      key: "loyalty",
      header: "Free washes",
      render: (c) =>
        c.loyaltyCard ? (
          loyaltyFreeWashesAvailable(c.loyaltyCard) > 0 ? (
            <Badge>{loyaltyFreeWashesAvailable(c.loyaltyCard)} available</Badge>
          ) : (
            <span className="text-muted-foreground">{c.loyaltyCard.punchesCount}/{c.loyaltyCard.freeWashThreshold} punches</span>
          )
        ) : (
          <span className="text-muted-foreground">No card</span>
        ),
    },
    { key: "createdAt", header: "Added", render: (c) => format(new Date(c.createdAt), "d MMM yyyy") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> Add client
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={clients}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search clients by name or phone..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.phone.toLowerCase().includes(q)}
        emptyMessage="No clients captured yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="Add client">
        <ClientForm action={createClient} onSuccess={() => setAddOpen(false)} submitLabel="Add client" />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.name ?? ""}
        description={selected?.phone}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/50 p-3 text-center text-sm">
              <div>
                <p className="text-muted-foreground">Balance</p>
                <p className="font-semibold">{formatKES(retentionAccountBalance(selected.retentionAccounts.flatMap((a) => a.invoices)))}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Free washes</p>
                <p className="font-semibold">{selected.loyaltyCard ? loyaltyFreeWashesAvailable(selected.loyaltyCard) : 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Referrals</p>
                <p className="font-semibold">{selected.referralsMade.length}</p>
              </div>
            </div>

            {canManage ? (
              <>
                <Separator />
                <ClientForm
                  action={(fd) => updateClient(selected.id, fd)}
                  defaultValues={selected}
                  onSuccess={() => setSelectedId(null)}
                  submitLabel="Save changes"
                />
              </>
            ) : (
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Email:</span> {selected.email || "—"}</p>
                <p><span className="text-muted-foreground">Business:</span> {selected.businessType || "—"}</p>
                <p><span className="text-muted-foreground">Address:</span> {selected.address || "—"}</p>
                <p><span className="text-muted-foreground">Notes:</span> {selected.notes || "—"}</p>
              </div>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
