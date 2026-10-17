import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { AppLink } from "@/components/ui/app-link";
import { PrintButton } from "@/components/admin/sales/print-button";
import { formatKES, saleBalance } from "@/lib/calc";

export default async function SaleInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("sales.view");
  const { id } = await params;

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      client: { select: { name: true, phone: true, email: true, address: true } },
      items: true,
      invoice: true,
    },
  });

  if (!sale) notFound();

  if (!sale.invoice) {
    return (
      <div className="mx-auto max-w-lg space-y-3 py-12 text-center">
        <p className="text-sm text-muted-foreground">No invoice has been generated for this sale yet.</p>
        <AppLink href="/admin/sales" className="text-sm font-medium underline">
          Back to sales
        </AppLink>
      </div>
    );
  }

  const customerName = sale.client.name;
  const customerPhone = sale.client.phone;
  const balance = saleBalance(sale);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="space-y-6 rounded-md border bg-background p-8 print:border-0 print:p-0">
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-28 shrink-0">
              <Image src="/logo.jpeg" alt="Royal Laundry & Dry Cleaners" fill className="object-contain" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Royal Laundry & Dry Cleaners</p>
              <p>Eldoret, Kenya</p>
              <p>0790212210 &middot; royallaundry140@gmail.com</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-lg font-bold">INVOICE</h1>
            <p className="text-xs text-muted-foreground">#{sale.invoice.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">Issued {format(sale.invoice.issuedAt, "d MMM yyyy")}</p>
            {sale.invoice.dueDate && <p className="text-xs text-muted-foreground">Due {format(sale.invoice.dueDate, "d MMM yyyy")}</p>}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Billed to</p>
            <p className="font-medium">{customerName}</p>
            {customerPhone && <p className="text-muted-foreground">{customerPhone}</p>}
            {sale.client.email && <p className="text-muted-foreground">{sale.client.email}</p>}
            {sale.client.address && <p className="text-muted-foreground">{sale.client.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground">Sale date</p>
            <p className="font-medium">{format(sale.createdAt, "d MMM yyyy, HH:mm")}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.label}</td>
                <td className="py-2 text-right">
                  {item.quantity} {item.unit ?? ""}
                </td>
                <td className="py-2 text-right">{formatKES(item.unitPrice)}</td>
                <td className="py-2 text-right">{formatKES(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatKES(sale.subtotal)}</span>
          </div>
          {sale.discountPercent > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>{sale.discountPercent}%</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-1 font-semibold">
            <span>Total</span>
            <span>{formatKES(sale.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid</span>
            <span>{formatKES(sale.amountPaid)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Balance due</span>
            <span>{balance > 0 ? formatKES(balance) : "Kes 0 (Paid)"}</span>
          </div>
        </div>

        {sale.notes && (
          <div className="border-t pt-3 text-sm">
            <p className="text-xs uppercase text-muted-foreground">Notes</p>
            <p>{sale.notes}</p>
          </div>
        )}

        <p className="border-t pt-4 text-center text-xs text-muted-foreground">Thank you for your business!</p>
      </div>
    </div>
  );
}
