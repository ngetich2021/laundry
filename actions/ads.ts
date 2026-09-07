"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { adSchema } from "@/lib/validations/ad";
import { formDataToObject } from "@/lib/form-data";

export async function createAd(formData: FormData) {
  const session = await requirePermission("ads.manage");
  const parsed = adSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.adCampaign.create({
    data: {
      platform: parsed.data.platform,
      name: parsed.data.name,
      amountSpent: parsed.data.amountSpent,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      notes: parsed.data.notes || null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/ads");
}

export async function updateAd(id: string, formData: FormData) {
  await requirePermission("ads.manage");
  const parsed = adSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.adCampaign.update({
    where: { id },
    data: {
      platform: parsed.data.platform,
      name: parsed.data.name,
      amountSpent: parsed.data.amountSpent,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/admin/ads");
}
