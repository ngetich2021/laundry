"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { referralSchema, applyRewardSchema } from "@/lib/validations/referral";
import { formDataToObject } from "@/lib/form-data";

export async function createReferral(formData: FormData) {
  const session = await requirePermission("referrals.manage");
  const parsed = referralSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  let referrerClientId: string | null = null;
  let referrerName: string;
  let referrerPhone: string;

  if (parsed.data.referrerType === "CLIENT") {
    const client = await prisma.client.findUniqueOrThrow({ where: { id: parsed.data.referrerClientId! } });
    referrerClientId = client.id;
    referrerName = client.name;
    referrerPhone = client.phone;
  } else {
    referrerName = parsed.data.referrerName!;
    referrerPhone = parsed.data.referrerPhone!;
    const existing = await prisma.client.findUnique({ where: { phone: referrerPhone } });
    if (existing) referrerClientId = existing.id;
  }

  await prisma.referral.create({
    data: {
      referrerClientId,
      referrerName,
      referrerPhone,
      referredName: parsed.data.referredName,
      referredPhone: parsed.data.referredPhone,
      rewardPercent: parsed.data.rewardPercent,
      recordedById: session.user.id,
    },
  });

  revalidatePath("/admin/referrals");
}

export async function convertReferral(referralId: string) {
  await requirePermission("referrals.manage");
  const referral = await prisma.referral.findUniqueOrThrow({ where: { id: referralId } });

  let referredClient = await prisma.client.findUnique({ where: { phone: referral.referredPhone } });
  if (!referredClient) {
    referredClient = await prisma.client.create({
      data: { name: referral.referredName, phone: referral.referredPhone, source: "Referral" },
    });
  }

  await prisma.referral.update({
    where: { id: referralId },
    data: { status: "CONVERTED", referredClientId: referredClient.id, convertedAt: new Date() },
  });

  revalidatePath("/admin/referrals");
  revalidatePath("/admin/clients");
}

export async function applyReward(referralId: string, formData: FormData) {
  await requirePermission("referrals.manage");
  const parsed = applyRewardSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.referral.update({
    where: { id: referralId },
    data: { status: "REWARD_APPLIED", appliedToOrderRef: parsed.data.appliedToOrderRef || null, rewardAppliedAt: new Date() },
  });

  revalidatePath("/admin/referrals");
}

export async function deleteReferral(referralId: string) {
  await requirePermission("referrals.manage");
  await prisma.referral.delete({ where: { id: referralId } });
  revalidatePath("/admin/referrals");
}
