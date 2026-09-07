import { z } from "zod";

export const adSchema = z.object({
  platform: z.enum(["FACEBOOK", "INSTAGRAM", "TIKTOK", "LAUNDRY_KE", "GOOGLE", "OTHER"]),
  name: z.string().min(2, "Name is required"),
  amountSpent: z.coerce.number().min(0, "Enter an amount"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  notes: z.string().optional().or(z.literal("")),
});
