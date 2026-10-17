"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { createSaleSchema, recordSalePaymentSchema, generateInvoiceSchema } from "@/lib/validations/sales";
import { formDataToObject } from "@/lib/form-data";
import { saleStatusFromPayment } from "@/lib/calc";

export async function createSale(input: unknown) {
  const session = await requirePermission("sales.manage");
  const parsed = createSaleSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const { items, discountPercent, amountPaid, paymentMethod, notes, clientId } = parsed.data;

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const total = Math.max(0, subtotal * (1 - discountPercent / 100));
  const paid = Math.min(amountPaid, total);

  await prisma.sale.create({
    data: {
      clientId,
      subtotal,
      discountPercent,
      total,
      amountPaid: paid,
      paymentMethod,
      status: saleStatusFromPayment(total, paid),
      notes: notes?.trim() || null,
      soldById: session.user.id,
      items: {
        create: items.map((i) => ({
          label: i.label,
          unit: i.unit?.trim() || null,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.quantity * i.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/admin/sales");
  revalidatePath("/admin/reports");
}

export async function recordSalePayment(saleId: string, formData: FormData) {
  await requirePermission("sales.manage");
  const parsed = recordSalePaymentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const sale = await prisma.sale.findUniqueOrThrow({ where: { id: saleId } });
  if (sale.status === "CANCELLED") throw new Error("This sale is cancelled");

  const newPaid = Math.min(sale.amountPaid + parsed.data.amountPaid, sale.total);

  await prisma.sale.update({
    where: { id: saleId },
    data: { amountPaid: newPaid, status: saleStatusFromPayment(sale.total, newPaid) },
  });

  revalidatePath("/admin/sales");
  revalidatePath("/admin/reports");
}

export async function cancelSale(saleId: string) {
  await requirePermission("sales.manage");
  await prisma.sale.update({ where: { id: saleId }, data: { status: "CANCELLED" } });
  revalidatePath("/admin/sales");
  revalidatePath("/admin/reports");
}

export async function deleteSale(saleId: string) {
  await requirePermission("sales.manage");
  await prisma.sale.delete({ where: { id: saleId } });
  revalidatePath("/admin/sales");
  revalidatePath("/admin/reports");
}

export async function generateInvoice(saleId: string, formData: FormData) {
  const session = await requirePermission("sales.manage");
  const parsed = generateInvoiceSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const existing = await prisma.invoice.findUnique({ where: { saleId } });
  if (existing) return existing.id;

  const invoice = await prisma.invoice.create({
    data: {
      saleId,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/sales");
  return invoice.id;
}
