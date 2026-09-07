"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { retentionAccountSchema, invoiceSchema, paymentSchema } from "@/lib/validations/retention";
import { formDataToObject } from "@/lib/form-data";

export async function createRetentionAccount(formData: FormData) {
  const session = await requirePermission("retention.manage");
  const parsed = retentionAccountSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.retentionAccount.create({
    data: {
      clientId: parsed.data.clientId,
      planType: parsed.data.planType,
      monthlyAmount: parsed.data.monthlyAmount,
      monthlyDiscountPercent: parsed.data.planType === "MONTHLY" ? parsed.data.monthlyDiscountPercent : 0,
      startDate: new Date(parsed.data.startDate),
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/retention");
  revalidatePath("/admin/clients");
}

export async function generateInvoice(accountId: string, formData: FormData) {
  await requirePermission("retention.manage");
  const parsed = invoiceSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const account = await prisma.retentionAccount.findUniqueOrThrow({ where: { id: accountId } });
  const discount = account.planType === "MONTHLY" ? account.monthlyDiscountPercent : 0;
  const amountDue = account.monthlyAmount * (1 - discount / 100);

  await prisma.retentionInvoice.create({
    data: {
      retentionAccountId: accountId,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      dueDate: new Date(parsed.data.dueDate),
      amountDue,
    },
  });

  revalidatePath("/admin/retention");
  revalidatePath("/admin/clients");
}

export async function recordPayment(invoiceId: string, formData: FormData) {
  await requirePermission("retention.manage");
  const parsed = paymentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const invoice = await prisma.retentionInvoice.findUniqueOrThrow({ where: { id: invoiceId } });
  const paidAt = new Date(parsed.data.paidAt);

  await prisma.retentionInvoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid: invoice.amountPaid + parsed.data.amountPaid,
      paidAt,
      isEarlyPayment: paidAt < invoice.dueDate,
    },
  });

  revalidatePath("/admin/retention");
  revalidatePath("/admin/clients");
}

export async function setRetentionStatus(accountId: string, status: "ACTIVE" | "PAUSED" | "CANCELLED") {
  await requirePermission("retention.manage");
  await prisma.retentionAccount.update({ where: { id: accountId }, data: { status } });
  revalidatePath("/admin/retention");
}
