import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["FLYER", "SOCIAL", "REFERRAL_PUSH", "OTHER"]),
  targetMetricLabel: z.string().min(2, "e.g. 'Salons signed up'"),
  targetCount: z.coerce.number().int().positive("Enter a target"),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  notes: z.string().optional().or(z.literal("")),
});

export const achievementSchema = z.object({
  description: z.string().optional().or(z.literal("")),
});
