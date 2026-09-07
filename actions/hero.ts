"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { heroSlideSchema } from "@/lib/validations/hero";
import { formDataToObject } from "@/lib/form-data";

export async function createHeroSlide(formData: FormData) {
  await requirePermission("hero.manage");
  const parsed = heroSlideSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.heroSlide.create({
    data: {
      label: parsed.data.label,
      body: parsed.data.body,
      ctaText: parsed.data.ctaText,
      ctaLink: parsed.data.ctaLink || null,
      imageUrl: parsed.data.imageUrl,
      sortOrder: parsed.data.sortOrder,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requirePermission("hero.manage");
  const parsed = heroSlideSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.heroSlide.update({
    where: { id },
    data: {
      label: parsed.data.label,
      body: parsed.data.body,
      ctaText: parsed.data.ctaText,
      ctaLink: parsed.data.ctaLink || null,
      imageUrl: parsed.data.imageUrl,
      sortOrder: parsed.data.sortOrder,
    },
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function setHeroSlideActive(id: string, isActive: boolean) {
  await requirePermission("hero.manage");
  await prisma.heroSlide.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function deleteHeroSlide(id: string) {
  await requirePermission("hero.manage");
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/admin/hero");
  revalidatePath("/");
}
