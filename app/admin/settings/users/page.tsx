import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { UsersTable } from "@/components/admin/settings/users-table";

export default async function UsersPage() {
  await requirePermission("users.manage");

  const [invited, roles] = await Promise.all([
    prisma.allowedEmail.findMany({
      orderBy: { createdAt: "desc" },
      include: { role: { select: { id: true, name: true } } },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const users = await prisma.user.findMany({
    where: { email: { in: invited.map((i) => i.email) } },
    select: { email: true, lastLoginAt: true },
  });
  const lastLoginByEmail = new Map(users.map((u) => [u.email, u.lastLoginAt]));

  return (
    <UsersTable
      users={invited.map((i) => ({
        id: i.id,
        email: i.email,
        note: i.note,
        role: i.role,
        lastLoginAt: lastLoginByEmail.get(i.email)?.toISOString() ?? null,
      }))}
      roles={roles}
    />
  );
}
