import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { StatCard } from "@/components/admin/stat-card";
import { VisitsTable } from "@/components/admin/visits/visits-table";
import { Globe, TrendingUp, MapPin } from "lucide-react";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function VisitsPage() {
  await requirePermission("visits.view");

  const today = startOfDay(new Date());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [visits, todayCount, weekCount] = await Promise.all([
    prisma.siteVisit.findMany({ orderBy: { visitedAt: "desc" }, take: 300 }),
    prisma.siteVisit.count({ where: { visitedAt: { gte: today } } }),
    prisma.siteVisit.count({ where: { visitedAt: { gte: sevenDaysAgo } } }),
  ]);

  const sourceCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();
  for (const v of visits) {
    const source = v.utmSource || (v.referrer ? (() => {
      try { return new URL(v.referrer!).hostname.replace("www.", ""); } catch { return v.referrer!; }
    })() : "Direct");
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);

    const loc = [v.city, v.country].filter(Boolean).join(", ") || "Unknown";
    locationCounts.set(loc, (locationCounts.get(loc) ?? 0) + 1);
  }
  const topSource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const topLocation = [...locationCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Site Visits</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Visits today" value={todayCount} icon={Globe} />
        <StatCard label="Visits (7 days)" value={weekCount} icon={TrendingUp} />
        <StatCard label="Top source" value={topSource?.[0] ?? "—"} hint={topSource ? `${topSource[1]} visits` : undefined} icon={Globe} />
        <StatCard label="Top location" value={topLocation?.[0] ?? "—"} hint={topLocation ? `${topLocation[1]} visits` : undefined} icon={MapPin} />
      </div>

      <VisitsTable visits={visits.map((v) => ({ ...v, visitedAt: v.visitedAt.toISOString() }))} />
    </div>
  );
}
