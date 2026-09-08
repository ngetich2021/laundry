"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { punchSchema, freeWashThresholdSchema } from "@/lib/validations/loyalty";
import { formDataToObject } from "@/lib/form-data";

export async function enrollClient(clientId: string, freeWashThreshold?: number) {
  await requirePermission("loyalty.manage");
  const threshold = freeWashThreshold && freeWashThreshold > 0 ? freeWashThreshold : 6;
  await prisma.loyaltyCard.upsert({
    where: { clientId },
    create: { clientId, freeWashThreshold: threshold },
    update: {},
  });
  revalidatePath("/admin/loyalty");
  revalidatePath("/admin/clients");
}

export async function updateFreeWashThreshold(cardId: string, formData: FormData) {
  await requirePermission("loyalty.manage");
  const parsed = freeWashThresholdSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.loyaltyCard.update({
    where: { id: cardId },
    data: { freeWashThreshold: parsed.data.freeWashThreshold },
  });
  revalidatePath("/admin/loyalty");
  revalidatePath("/admin/clients");
}

export async function addPunch(clientId: string, formData: FormData) {
  const session = await requirePermission("loyalty.manage");
  const parsed = punchSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const card = await prisma.loyaltyCard.upsert({
    where: { clientId },
    create: { clientId },
    update: {},
  });

  const newPunchCount = card.punchesCount + 1;
  const earnedFreeWash = newPunchCount % card.freeWashThreshold === 0;

  await prisma.loyaltyCard.update({
    where: { id: card.id },
    data: {
      punchesCount: newPunchCount,
      lastPunchAt: new Date(),
      totalFreeWashesEarned: earnedFreeWash ? card.totalFreeWashesEarned + 1 : card.totalFreeWashesEarned,
      punches: {
        create: { note: parsed.data.note || null, recordedById: session.user.id },
      },
    },
  });

  revalidatePath("/admin/loyalty");
  revalidatePath("/admin/clients");
}

export async function redeemFreeWash(cardId: string) {
  await requirePermission("loyalty.manage");
  const card = await prisma.loyaltyCard.findUniqueOrThrow({ where: { id: cardId } });
  if (card.totalFreeWashesRedeemed >= card.totalFreeWashesEarned) {
    throw new Error("No free wash available to redeem.");
  }
  await prisma.loyaltyCard.update({
    where: { id: cardId },
    data: { totalFreeWashesRedeemed: card.totalFreeWashesRedeemed + 1 },
  });
  revalidatePath("/admin/loyalty");
  revalidatePath("/admin/clients");
}

export async function deleteLoyaltyCard(cardId: string) {
  await requirePermission("loyalty.manage");
  await prisma.loyaltyCard.delete({ where: { id: cardId } });
  revalidatePath("/admin/loyalty");
  revalidatePath("/admin/clients");
}
