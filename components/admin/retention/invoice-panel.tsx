"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateInvoice, recordPayment } from "@/actions/retention";
import { formatKES, invoiceBalance } from "@/lib/calc";

export interface InvoiceRow {
  id: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  paidAt: string | null;
  isEarlyPayment: boolean;
}

export function InvoicePanel({
  accountId,
  invoices,
  canManage,
}: {
  accountId: string;
  invoices: InvoiceRow[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [payingId, setPayingId] = useState<string | null>(null);

  function onGenerate(formData: FormData) {
    startTransition(async () => {
      try {
        await generateInvoice(accountId, formData);
        toast.success("Invoice generated");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onPay(invoiceId: string, formData: FormData) {
    startTransition(async () => {
      try {
        await recordPayment(invoiceId, formData);
        toast.success("Payment recorded");
        setPayingId(null);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="max-h-56 overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Balance</TableHead>
              {canManage && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const balance = invoiceBalance(inv);
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs">
                      {format(new Date(inv.periodStart), "d MMM")} – {format(new Date(inv.periodEnd), "d MMM")}
                    </TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(inv.dueDate), "d MMM yyyy")}
                      {inv.isEarlyPayment && (
                        <Badge className="ml-1.5" variant="secondary">
                          Paid early
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {balance > 0 ? formatKES(balance) : <span className="text-emerald-600 dark:text-emerald-400">Paid</span>}
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        {balance > 0 && (
                          <Button size="xs" variant="outline" onClick={() => setPayingId(inv.id === payingId ? null : inv.id)}>
                            Pay
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {payingId && (
        <form
          action={(fd) => onPay(payingId, fd)}
          className="flex items-end gap-2 rounded-md border bg-muted/40 p-2"
        >
          <div className="space-y-1">
            <Label htmlFor="amountPaid" className="text-xs">Amount</Label>
            <Input id="amountPaid" name="amountPaid" type="number" min="0" step="1" className="h-8 w-28" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="paidAt" className="text-xs">Paid on</Label>
            <Input id="paidAt" name="paidAt" type="date" className="h-8" defaultValue={new Date().toISOString().slice(0, 10)} required />
          </div>
          <Button type="submit" size="sm" disabled={pending}>
            Confirm
          </Button>
        </form>
      )}

      {canManage && (
        <>
          <Separator />
          <form action={onGenerate} className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="periodStart" className="text-xs">Period start</Label>
              <Input id="periodStart" name="periodStart" type="date" className="h-8" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="periodEnd" className="text-xs">Period end</Label>
              <Input id="periodEnd" name="periodEnd" type="date" className="h-8" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="dueDate" className="text-xs">Due date</Label>
              <Input id="dueDate" name="dueDate" type="date" className="h-8" required />
            </div>
            <Button type="submit" size="sm" variant="outline" disabled={pending} className="col-span-3">
              Generate invoice
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
