import { z } from "zod";

export const serviceCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  icon: z.string().min(1).default("Package"),
  displayStyle: z.enum(["LIST", "SINGLE"]),
  sortOrder: z.coerce.number().int().default(0),
});

export const servicePriceItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  price: z.coerce.number().min(0, "Enter a price"),
  unit: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});
