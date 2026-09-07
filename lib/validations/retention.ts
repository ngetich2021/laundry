import { z } from "zod";

export const retentionAccountSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  planType: z.enum(["MONTHLY", "PAY_AS_YOU_GO"]),
  monthlyAmount: z.coerce.number().positive("Enter a monthly amount"),
  monthlyDiscountPercent: z.coerce.number().min(0).max(100).default(0),
  startDate: z.string().min(1, "Select a start date"),
});

export const invoiceSchema = z.object({
  periodStart: z.string().min(1, "Required"),
  periodEnd: z.string().min(1, "Required"),
  dueDate: z.string().min(1, "Required"),
});

export const paymentSchema = z.object({
  amountPaid: z.coerce.number().positive("Enter an amount"),
  paidAt: z.string().min(1, "Required"),
});
