"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { clientSchema } from "@/lib/validations/client";
import { formDataToObject } from "@/lib/form-data";

const quickClientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "A valid phone number is required"),
});

/** Minimal client creation used by the sale form so recording a walk-in sale still
 * results in a real Client record, without the full client dialog's extra fields. */
export async function createClientQuick(input: unknown) {
  const session = await requirePermission("clients.manage");
  const parsed = quickClientSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const existing = await prisma.client.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) return existing;

  const client = await prisma.client.create({
    data: { name: parsed.data.name, phone: parsed.data.phone, createdById: session.user.id },
  });

  revalidatePath("/admin/clients");
  return client;
}

export async function createClient(formData: FormData) {
  const session = await requirePermission("clients.manage");
  const raw = formDataToObject(formData);
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const existing = await prisma.client.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) {
    throw new Error("A client with this phone number already exists.");
  }

  await prisma.client.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      businessType: parsed.data.businessType || null,
      address: parsed.data.address || null,
      source: parsed.data.source || null,
      notes: parsed.data.notes || null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/clients");
}

export async function updateClient(clientId: string, formData: FormData) {
  await requirePermission("clients.manage");
  const raw = formDataToObject(formData);
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const existing = await prisma.client.findFirst({
    where: { phone: parsed.data.phone, NOT: { id: clientId } },
  });
  if (existing) {
    throw new Error("Another client already uses this phone number.");
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      businessType: parsed.data.businessType || null,
      address: parsed.data.address || null,
      source: parsed.data.source || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/admin/clients");
}

export async function deleteClient(clientId: string) {
  await requirePermission("clients.manage");

  const salesCount = await prisma.sale.count({ where: { clientId } });
  if (salesCount > 0) {
    throw new Error(`This client has ${salesCount} sale(s) on record and can't be deleted. Cancel or reassign those sales first.`);
  }

  await prisma.client.delete({ where: { id: clientId } });
  revalidatePath("/admin/clients");
}
