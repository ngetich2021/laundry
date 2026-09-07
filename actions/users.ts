"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { inviteSchema } from "@/lib/validations/roles";
import { formDataToObject } from "@/lib/form-data";

export async function inviteUser(formData: FormData) {
  const session = await requirePermission("users.manage");
  const parsed = inviteSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const existing = await prisma.allowedEmail.findUnique({ where: { email: parsed.data.email } });
  if (existing) throw new Error("This email is already invited.");

  await prisma.allowedEmail.create({
    data: {
      email: parsed.data.email,
      roleId: parsed.data.roleId,
      note: parsed.data.note || null,
      invitedById: session.user.id,
    },
  });

  revalidatePath("/admin/settings/users");
}

export async function changeUserRole(allowedEmailId: string, roleId: string) {
  await requirePermission("users.manage");
  const allowed = await prisma.allowedEmail.findUniqueOrThrow({ where: { id: allowedEmailId } });

  await prisma.$transaction([
    prisma.allowedEmail.update({ where: { id: allowedEmailId }, data: { roleId } }),
    prisma.user.updateMany({ where: { email: allowed.email }, data: { roleId } }),
  ]);

  revalidatePath("/admin/settings/users");
}

export async function revokeAccess(allowedEmailId: string) {
  await requirePermission("users.manage");
  const allowed = await prisma.allowedEmail.findUniqueOrThrow({ where: { id: allowedEmailId } });

  const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
  if (adminRole && allowed.roleId === adminRole.id) {
    const otherAdmins = await prisma.allowedEmail.count({ where: { roleId: adminRole.id, id: { not: allowedEmailId } } });
    if (otherAdmins === 0) throw new Error("You can't revoke the last Admin.");
  }

  await prisma.allowedEmail.delete({ where: { id: allowedEmailId } });
  revalidatePath("/admin/settings/users");
}
