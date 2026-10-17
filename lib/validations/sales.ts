import { z } from "zod";

export const saleItemSchema = z.object({
  label: z.string().min(1, "Item name is required"),
  unit: z.string().optional().nullable(),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0, "Unit price can't be negative"),
});

export const createSaleSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  items: z.array(saleItemSchema).min(1, "Add at least one item"),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  amountPaid: z.coerce.number().min(0).default(0),
  paymentMethod: z.enum(["CASH", "MPESA", "CARD", "BANK_TRANSFER", "OTHER"]).default("CASH"),
  notes: z.string().optional().nullable(),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;

export const recordSalePaymentSchema = z.object({
  amountPaid: z.coerce.number().positive("Enter an amount"),
});

export const generateInvoiceSchema = z.object({
  dueDate: z.string().optional().nullable(),
});
