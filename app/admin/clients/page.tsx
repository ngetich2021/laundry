import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { ClientsTable } from "@/components/admin/clients/clients-table";

export default async function ClientsPage() {
  const session = await requirePermission("clients.view");

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      retentionAccounts: { select: { id: true, status: true, invoices: { select: { amountDue: true, amountPaid: true } } } },
      loyaltyCard: { select: { totalFreeWashesEarned: true, totalFreeWashesRedeemed: true, punchesCount: true, freeWashThreshold: true } },
      referralsMade: { select: { id: true, status: true } },
    },
  });

  return (
    <ClientsTable
      clients={clients.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
      canManage={session.user.permissions.includes("clients.manage")}
    />
  );
}
