import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  businessType: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  source: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;
