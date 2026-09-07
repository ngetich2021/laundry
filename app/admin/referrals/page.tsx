import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { ReferralsTable } from "@/components/admin/referrals/referrals-table";

export default async function ReferralsPage() {
  const session = await requirePermission("referrals.view");

  const [referrals, clients] = await Promise.all([
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      include: { referrerClient: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, phone: true } }),
  ]);

  return (
    <ReferralsTable
      referrals={referrals.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      clients={clients}
      canManage={session.user.permissions.includes("referrals.manage")}
    />
  );
}
