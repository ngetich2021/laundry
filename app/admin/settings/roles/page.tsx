import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { RolesTable } from "@/components/admin/settings/roles-table";

export default async function RolesPage() {
  await requirePermission("roles.manage");

  const [roles, allPermissions] = await Promise.all([
    prisma.role.findMany({
      orderBy: { createdAt: "asc" },
      include: { permissions: { include: { permission: { select: { id: true, key: true } } } } },
    }),
    prisma.permission.findMany({ select: { id: true, key: true } }),
  ]);

  return <RolesTable roles={roles} allPermissions={allPermissions} />;
}
