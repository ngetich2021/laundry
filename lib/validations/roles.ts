import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional().or(z.literal("")),
});

export const inviteSchema = z.object({
  email: z.string().email("Enter a valid email"),
  roleId: z.string().min(1, "Select a role"),
  note: z.string().optional().or(z.literal("")),
});
