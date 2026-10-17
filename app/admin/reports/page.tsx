import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { StatCard } from "@/components/admin/stat-card";
import { formatKES } from "@/lib/calc";
import { Users, Wallet, Megaphone, Globe, Gift, Share2, Target, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDateFilter } from "@/components/admin/reports/date-filter";

function dayRange(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`);
  const end = new Date(`${dateStr}T23:59:59.999`);
  return { start, end };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  await requirePermission("reports.view");
  const { date } = await searchParams;
  const selectedDate = date ?? new Date().toISOString().slice(0, 10);
  const { start, end } = dayRange(selectedDate);

  const [
    newClients,
    paidInvoices,
    adsRunningToday,
    achievementsToday,
    visitsToday,
    loyaltyPunchesToday,
    referralsConvertedToday,
    salesToday,
  ] = await Promise.all([
    prisma.client.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.retentionInvoice.findMany({ where: { paidAt: { gte: start, lte: end } }, select: { amountPaid: true } }),
    prisma.adCampaign.findMany({ where: { startDate: { lte: end }, endDate: { gte: start } } }),
    prisma.campaignAchievement.count({ where: { achievedAt: { gte: start, lte: end } } }),
    prisma.siteVisit.findMany({ where: { visitedAt: { gte: start, lte: end } }, select: { utmSource: true, referrer: true } }),
    prisma.loyaltyPunch.count({ where: { visitDate: { gte: start, lte: end } } }),
    prisma.referral.count({ where: { convertedAt: { gte: start, lte: end } } }),
    prisma.sale.findMany({
      where: { createdAt: { gte: start, lte: end }, status: { not: "CANCELLED" } },
      select: { total: true, amountPaid: true },
    }),
  ]);

  const collected = paidInvoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const adSpendToday = adsRunningToday.reduce((sum, a) => sum + a.amountSpent, 0);
  const salesRevenueToday = salesToday.reduce((sum, s) => sum + s.total, 0);
  const salesCollectedToday = salesToday.reduce((sum, s) => sum + s.amountPaid, 0);

  const sourceCounts = new Map<string, number>();
  for (const v of visitsToday) {
    const source = v.utmSource || (v.referrer ? (() => {
      try { return new URL(v.referrer!).hostname.replace("www.", ""); } catch { return v.referrer!; }
    })() : "Direct");
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }
  const topSources = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold">Daily Report</h1>
        <ReportDateFilter selectedDate={selectedDate} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <StatCard label="New clients" value={newClients} icon={Users} />
        <StatCard label="Sales revenue" value={formatKES(salesRevenueToday)} icon={ShoppingCart} hint={`${salesToday.length} sale(s)`} />
        <StatCard label="Sales collected" value={formatKES(salesCollectedToday)} icon={Wallet} />
        <StatCard label="Retention collected" value={formatKES(collected)} icon={Wallet} />
        <StatCard label="Ad spend (running)" value={formatKES(adSpendToday)} icon={Megaphone} hint={`${adsRunningToday.length} ads running`} />
        <StatCard label="Targets logged" value={achievementsToday} icon={Target} />
        <StatCard label="Site visits" value={visitsToday.length} icon={Globe} />
        <StatCard label="Loyalty punches" value={loyaltyPunchesToday} icon={Gift} />
        <StatCard label="Referrals converted" value={referralsConvertedToday} icon={Share2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top visit sources this day</CardTitle>
        </CardHeader>
        <CardContent>
          {topSources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visits recorded on this day.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {topSources.map(([source, count]) => (
                <li key={source} className="flex items-center justify-between">
                  <span>{source}</span>
                  <span className="text-muted-foreground">{count} visits</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
