"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { serviceCategorySchema, servicePriceItemSchema } from "@/lib/validations/pricing";
import { formDataToObject } from "@/lib/form-data";

export async function createCategory(formData: FormData) {
  await requirePermission("pricing.manage");
  const parsed = serviceCategorySchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.serviceCategory.create({ data: parsed.data });

  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function updateCategory(id: string, formData: FormData) {
  await requirePermission("pricing.manage");
  const parsed = serviceCategorySchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.serviceCategory.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await requirePermission("pricing.manage");
  await prisma.serviceCategory.delete({ where: { id } });
  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function addPriceItem(categoryId: string, formData: FormData) {
  await requirePermission("pricing.manage");
  const parsed = servicePriceItemSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.servicePriceItem.create({
    data: { categoryId, label: parsed.data.label, price: parsed.data.price, unit: parsed.data.unit || null, sortOrder: parsed.data.sortOrder },
  });

  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function updatePriceItem(id: string, formData: FormData) {
  await requirePermission("pricing.manage");
  const parsed = servicePriceItemSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.servicePriceItem.update({
    where: { id },
    data: { label: parsed.data.label, price: parsed.data.price, unit: parsed.data.unit || null, sortOrder: parsed.data.sortOrder },
  });

  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function deletePriceItem(id: string) {
  await requirePermission("pricing.manage");
  await prisma.servicePriceItem.delete({ where: { id } });
  revalidatePath("/admin/pricing");
  revalidatePath("/");
}
