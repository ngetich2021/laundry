import { z } from "zod";

export const heroSlideSchema = z.object({
  label: z.string().min(2, "Headline is required"),
  body: z.string().min(2, "Description is required"),
  ctaText: z.string().min(2, "Button text is required"),
  ctaLink: z.string().optional().or(z.literal("")),
  imageUrl: z.string().min(1, "Image URL is required"),
  sortOrder: z.coerce.number().int().default(0),
});
