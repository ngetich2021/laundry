"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { roleSchema } from "@/lib/validations/roles";
import { formDataToObject } from "@/lib/form-data";

export async function createRole(formData: FormData) {
  await requirePermission("roles.manage");
  const parsed = roleSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const existing = await prisma.role.findUnique({ where: { name: parsed.data.name } });
  if (existing) throw new Error("A role with this name already exists.");

  await prisma.role.create({
    data: { name: parsed.data.name, description: parsed.data.description || null },
  });

  revalidatePath("/admin/settings/roles");
}

export async function setRolePermission(roleId: string, permissionId: string, enabled: boolean) {
  await requirePermission("roles.manage");
  const role = await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
  if (role.isSystem && role.name === "Admin" && !enabled) {
    throw new Error("The Admin role must keep all permissions.");
  }

  if (enabled) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      create: { roleId, permissionId },
      update: {},
    });
  } else {
    await prisma.rolePermission.deleteMany({ where: { roleId, permissionId } });
  }

  revalidatePath("/admin/settings/roles");
}

export async function deleteRole(roleId: string) {
  await requirePermission("roles.manage");
  const role = await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
  if (role.isSystem) throw new Error("Built-in roles can't be deleted.");

  const inUse = await prisma.user.count({ where: { roleId } });
  const invited = await prisma.allowedEmail.count({ where: { roleId } });
  if (inUse > 0 || invited > 0) {
    throw new Error("This role is still assigned to a user or invite. Reassign them first.");
  }

  await prisma.role.delete({ where: { id: roleId } });
  revalidatePath("/admin/settings/roles");
}
