import { z } from "zod";

export const punchSchema = z.object({
  note: z.string().optional().or(z.literal("")),
});

export const freeWashThresholdSchema = z.object({
  freeWashThreshold: z.coerce.number().int().min(1, "Must wash at least once").max(100),
});
