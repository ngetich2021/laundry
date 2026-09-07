import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { TargetsTable } from "@/components/admin/targets/targets-table";

export default async function TargetsPage() {
  const session = await requirePermission("targets.view");

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { achievements: { orderBy: { achievedAt: "asc" } } },
  });

  return (
    <TargetsTable
      campaigns={campaigns.map((c) => ({
        ...c,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate.toISOString(),
        achievements: c.achievements.map((a) => ({ ...a, achievedAt: a.achievedAt.toISOString() })),
      }))}
      canManage={session.user.permissions.includes("targets.manage")}
    />
  );
}
