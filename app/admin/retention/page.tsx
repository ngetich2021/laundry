import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { RetentionTable } from "@/components/admin/retention/retention-table";

export default async function RetentionPage() {
  const session = await requirePermission("retention.view");

  const [accounts, clients] = await Promise.all([
    prisma.retentionAccount.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        invoices: { orderBy: { dueDate: "asc" } },
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, phone: true } }),
  ]);

  return (
    <RetentionTable
      accounts={accounts.map((a) => ({
        ...a,
        invoices: a.invoices.map((inv) => ({
          ...inv,
          periodStart: inv.periodStart.toISOString(),
          periodEnd: inv.periodEnd.toISOString(),
          dueDate: inv.dueDate.toISOString(),
          paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
        })),
      }))}
      clients={clients}
      canManage={session.user.permissions.includes("retention.manage")}
    />
  );
}
