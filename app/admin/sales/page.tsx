import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { SalesTable } from "@/components/admin/sales/sales-table";

export default async function SalesPage() {
  const session = await requirePermission("sales.view");

  const [sales, clients, categories] = await Promise.all([
    prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        soldBy: { select: { name: true, email: true } },
        items: true,
        invoice: { select: { id: true } },
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, phone: true } }),
    prisma.serviceCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  return (
    <SalesTable
      sales={sales.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))}
      clients={clients}
      categories={categories}
      canManage={session.user.permissions.includes("sales.manage")}
    />
  );
}
