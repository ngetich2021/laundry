import { z } from "zod";

export const referralSchema = z
  .object({
    referrerType: z.enum(["CLIENT", "EXTERNAL"]),
    referrerClientId: z.string().optional().or(z.literal("")),
    referrerName: z.string().optional().or(z.literal("")),
    referrerPhone: z.string().optional().or(z.literal("")),
    referredName: z.string().min(2, "Name is required"),
    referredPhone: z.string().min(7, "A valid phone number is required"),
    rewardPercent: z.coerce.number().min(0).max(100),
  })
  .refine((data) => data.referrerType !== "CLIENT" || !!data.referrerClientId, {
    message: "Select the referring client",
    path: ["referrerClientId"],
  })
  .refine((data) => data.referrerType !== "EXTERNAL" || (!!data.referrerName && data.referrerName.length >= 2), {
    message: "Referrer's name is required",
    path: ["referrerName"],
  })
  .refine((data) => data.referrerType !== "EXTERNAL" || (!!data.referrerPhone && data.referrerPhone.length >= 7), {
    message: "Referrer's phone is required",
    path: ["referrerPhone"],
  });

export const applyRewardSchema = z.object({
  appliedToOrderRef: z.string().optional().or(z.literal("")),
});
