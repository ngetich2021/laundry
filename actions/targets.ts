"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { campaignSchema, achievementSchema } from "@/lib/validations/campaign";
import { formDataToObject } from "@/lib/form-data";

export async function createCampaign(formData: FormData) {
  const session = await requirePermission("targets.manage");
  const parsed = campaignSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.campaign.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      cadence: parsed.data.cadence,
      targetMetricLabel: parsed.data.targetMetricLabel,
      targetCount: parsed.data.targetCount,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      notes: parsed.data.notes || null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/targets");
}

export async function updateCampaign(campaignId: string, formData: FormData) {
  await requirePermission("targets.manage");
  const parsed = campaignSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      cadence: parsed.data.cadence,
      targetMetricLabel: parsed.data.targetMetricLabel,
      targetCount: parsed.data.targetCount,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/admin/targets");
}

export async function deleteCampaign(campaignId: string) {
  await requirePermission("targets.manage");
  await prisma.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/admin/targets");
}

export async function logAchievement(campaignId: string, formData: FormData) {
  const session = await requirePermission("targets.manage");
  const parsed = achievementSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.campaignAchievement.create({
    data: {
      campaignId,
      description: parsed.data.description || null,
      recordedById: session.user.id,
    },
  });

  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
    include: { _count: { select: { achievements: true } } },
  });
  if (campaign._count.achievements >= campaign.targetCount && campaign.status === "ACTIVE") {
    await prisma.campaign.update({ where: { id: campaignId }, data: { status: "COMPLETED" } });
  }

  revalidatePath("/admin/targets");
}

export async function setCampaignStatus(campaignId: string, status: "ACTIVE" | "COMPLETED" | "CANCELLED") {
  await requirePermission("targets.manage");
  await prisma.campaign.update({ where: { id: campaignId }, data: { status } });
  revalidatePath("/admin/targets");
}
