import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { AdsTable } from "@/components/admin/ads/ads-table";

export default async function AdsPage() {
  const session = await requirePermission("ads.view");

  const ads = await prisma.adCampaign.findMany({ orderBy: { startDate: "desc" } });

  return (
    <AdsTable
      ads={ads.map((a) => ({
        ...a,
        startDate: a.startDate.toISOString(),
        endDate: a.endDate.toISOString(),
      }))}
      canManage={session.user.permissions.includes("ads.manage")}
    />
  );
}
