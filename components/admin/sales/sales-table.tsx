"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { SaleForm, type CatalogCategory, type ClientOption } from "./sale-form";
import { recordSalePayment, cancelSale, deleteSale, generateInvoice } from "@/actions/sales";
import { formatKES, saleBalance } from "@/lib/calc";

export interface SaleItemRow {
  id: string;
  label: string;
  unit: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface SaleRow {
  id: string;
  createdAt: string;
  client: { id: string; name: string; phone: string };
  subtotal: number;
  discountPercent: number;
  total: number;
  amountPaid: number;
  paymentMethod: string;
  status: "UNPAID" | "PARTIALLY_PAID" | "PAID" | "CANCELLED";
  notes: string | null;
  soldBy: { name: string | null; email: string };
  items: SaleItemRow[];
  invoice: { id: string } | null;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "destructive",
  PARTIALLY_PAID: "secondary",
  PAID: "default",
  CANCELLED: "outline",
};

const paymentMethodLabel: Record<string, string> = {
  CASH: "Cash",
  MPESA: "M-Pesa",
  CARD: "Card",
  BANK_TRANSFER: "Bank transfer",
  OTHER: "Other",
};

function customerName(sale: SaleRow) {
  return sale.client.name;
}

export function SalesTable({
  sales,
  clients,
  categories,
  canManage,
}: {
  sales: SaleRow[];
  clients: ClientOption[];
  categories: CatalogCategory[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const selected = sales.find((s) => s.id === selectedId) ?? null;

  function onCancel(id: string) {
    if (!confirm("Cancel this sale? It will no longer count toward revenue.")) return;
    startTransition(async () => {
      try {
        await cancelSale(id);
        toast.success("Sale cancelled");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this sale permanently? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteSale(id);
        toast.success("Sale deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onPay(saleId: string, formData: FormData) {
    startTransition(async () => {
      try {
        await recordSalePayment(saleId, formData);
        toast.success("Payment recorded");
        setPayOpen(false);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onGenerateAndOpenInvoice(sale: SaleRow) {
    startTransition(async () => {
      try {
        if (!sale.invoice) {
          await generateInvoice(sale.id, new FormData());
        }
        router.push(`/admin/sales/${sale.id}/invoice`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<SaleRow>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (s) => format(new Date(s.createdAt), "d MMM yyyy, HH:mm"),
      exportValue: (s) => format(new Date(s.createdAt), "yyyy-MM-dd HH:mm"),
    },
    {
      key: "customer",
      header: "Customer",
      render: (s) => <span className="font-medium">{customerName(s)}</span>,
      exportValue: (s) => customerName(s),
    },
    {
      key: "soldBy",
      header: "Sold by",
      render: (s) => s.soldBy.name ?? s.soldBy.email,
    },
    {
      key: "items",
      header: "Items",
      render: (s) => `${s.items.length} item${s.items.length === 1 ? "" : "s"}`,
      exportValue: (s) => s.items.map((i) => `${i.label} x${i.quantity}`).join("; "),
    },
    { key: "total", header: "Total", render: (s) => formatKES(s.total), exportValue: (s) => s.total },
    {
      key: "balance",
      header: "Balance",
      render: (s) => {
        const balance = saleBalance(s);
        return balance > 0 ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">{formatKES(balance)}</span>
        ) : (
          <span className="text-emerald-600 dark:text-emerald-400">Settled</span>
        );
      },
      exportValue: (s) => saleBalance(s),
    },
    {
      key: "paymentMethod",
      header: "Payment",
      render: (s) => paymentMethodLabel[s.paymentMethod] ?? s.paymentMethod,
    },
    {
      key: "status",
      header: "Status",
      render: (s) => <Badge variant={statusVariant[s.status]}>{s.status.replace("_", " ")}</Badge>,
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (s) => (
        <RowActions
          onView={() => setSelectedId(s.id)}
          onDelete={canManage ? () => onDelete(s.id) : undefined}
          deleteLabel="Delete sale"
          disabled={pending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sales</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> New sale
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        exportFilename="sales"
        data={sales}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search by customer..."
        searchFn={(row, q) => customerName(row).toLowerCase().includes(q)}
        emptyMessage="No sales recorded yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="Record a sale">
        <SaleForm clients={clients} categories={categories} onSuccess={() => setAddOpen(false)} />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setPayOpen(false);
          }
        }}
        title={selected ? customerName(selected) : ""}
        description={selected ? format(new Date(selected.createdAt), "d MMM yyyy, HH:mm") : undefined}
      >
        {selected && (
          <div className="space-y-4">
            <div className="max-h-56 overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">{item.label}</TableCell>
                      <TableCell className="text-xs">
                        {item.quantity} {item.unit ?? ""}
                      </TableCell>
                      <TableCell className="text-xs">{formatKES(item.unitPrice)}</TableCell>
                      <TableCell className="text-xs">{formatKES(item.lineTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-3 text-sm">
              <p>
                <span className="text-muted-foreground">Subtotal:</span> {formatKES(selected.subtotal)}
              </p>
              <p>
                <span className="text-muted-foreground">Discount:</span> {selected.discountPercent}%
              </p>
              <p>
                <span className="text-muted-foreground">Total:</span> {formatKES(selected.total)}
              </p>
              <p>
                <span className="text-muted-foreground">Paid:</span> {formatKES(selected.amountPaid)}
              </p>
              <p>
                <span className="text-muted-foreground">Balance:</span> {formatKES(saleBalance(selected))}
              </p>
              <p>
                <span className="text-muted-foreground">Payment:</span> {paymentMethodLabel[selected.paymentMethod]}
              </p>
              <p className="col-span-2">
                <span className="text-muted-foreground">Sold by:</span> {selected.soldBy.name ?? selected.soldBy.email}
              </p>
              {selected.notes && (
                <p className="col-span-2">
                  <span className="text-muted-foreground">Notes:</span> {selected.notes}
                </p>
              )}
            </div>

            {canManage && selected.status !== "CANCELLED" && saleBalance(selected) > 0 && (
              <>
                {payOpen ? (
                  <form
                    action={(fd) => onPay(selected.id, fd)}
                    className="flex items-end gap-2 rounded-md border bg-muted/40 p-2"
                  >
                    <div className="space-y-1">
                      <Label htmlFor="amountPaid" className="text-xs">
                        Amount
                      </Label>
                      <Input id="amountPaid" name="amountPaid" type="number" min="0" step="1" className="h-8 w-32" required />
                    </div>
                    <Button type="submit" size="sm" disabled={pending}>
                      Confirm
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setPayOpen(false)}>
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setPayOpen(true)}>
                    Record payment
                  </Button>
                )}
              </>
            )}

            <Separator />

            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => onGenerateAndOpenInvoice(selected)} disabled={pending}>
                {selected.invoice ? <ExternalLink /> : <FileText />}
                {selected.invoice ? "View invoice" : "Generate invoice"}
              </Button>
              {canManage && selected.status !== "CANCELLED" && (
                <Button size="sm" variant="outline" onClick={() => onCancel(selected.id)} disabled={pending}>
                  Cancel sale
                </Button>
              )}
              {canManage && (
                <Button size="sm" variant="destructive" onClick={() => onDelete(selected.id)} disabled={pending}>
                  Delete sale
                </Button>
              )}
            </div>
          </div>
        )}
      </RowDialog>
    </div>
  );
}
