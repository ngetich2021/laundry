import { prisma } from "@/lib/prisma";
import { requirePermission, hasPermission } from "@/lib/permissions";
import { StatCard } from "@/components/admin/stat-card";
import { formatKES, adStatus, retentionAccountBalance, loyaltyFreeWashesAvailable, loyaltyPunchesUntilFree } from "@/lib/calc";
import { Users, Wallet, Target, Megaphone, Globe, Gift, Share2 } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function OverviewPage() {
  const session = await requirePermission("dashboard.view");
  const perms = session.user.permissions;
  const today = startOfDay(new Date());

  const [
    clientsCount,
    todayVisits,
    ads,
    activeCampaigns,
    retentionAccounts,
    loyaltyCards,
    pendingReferrals,
  ] = await Promise.all([
    hasPermission(session, "clients.view") ? prisma.client.count() : 0,
    hasPermission(session, "visits.view") ? prisma.siteVisit.count({ where: { visitedAt: { gte: today } } }) : 0,
    hasPermission(session, "ads.view") ? prisma.adCampaign.findMany() : [],
    hasPermission(session, "targets.view")
      ? prisma.campaign.findMany({ where: { status: "ACTIVE" }, include: { _count: { select: { achievements: true } } } })
      : [],
    hasPermission(session, "retention.view")
      ? prisma.retentionAccount.findMany({ where: { status: "ACTIVE" }, include: { invoices: { select: { amountDue: true, amountPaid: true } } } })
      : [],
    hasPermission(session, "loyalty.view") ? prisma.loyaltyCard.findMany() : [],
    hasPermission(session, "referrals.view") ? prisma.referral.count({ where: { status: "PENDING" } }) : 0,
  ]);

  const activeAds = ads.filter((a) => adStatus(a) === "ACTIVE");
  const totalAdSpend = ads.reduce((sum, a) => sum + a.amountSpent, 0);
  const outstandingBalance = retentionAccounts.reduce((sum, a) => sum + retentionAccountBalance(a.invoices), 0);
  const loyaltyReminders = loyaltyCards.filter(
    (c) => loyaltyFreeWashesAvailable(c) > 0 || loyaltyPunchesUntilFree(c) === 1
  ).length;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {perms.includes("clients.view") && (
          <AppLink href="/admin/clients" className="block">
            <StatCard label="Total clients" value={clientsCount} icon={Users} />
          </AppLink>
        )}
        {perms.includes("visits.view") && (
          <AppLink href="/admin/visits" className="block">
            <StatCard label="Visits today" value={todayVisits} icon={Globe} />
          </AppLink>
        )}
        {perms.includes("retention.view") && (
          <AppLink href="/admin/retention" className="block">
            <StatCard
              label="Retention balance owed"
              value={formatKES(outstandingBalance)}
              icon={Wallet}
              tone={outstandingBalance > 0 ? "warning" : "success"}
              hint={`${retentionAccounts.length} active accounts`}
            />
          </AppLink>
        )}
        {perms.includes("targets.view") && (
          <AppLink href="/admin/targets" className="block">
            <StatCard label="Active campaigns" value={activeCampaigns.length} icon={Target} hint="Targets in progress" />
          </AppLink>
        )}
        {perms.includes("ads.view") && (
          <AppLink href="/admin/ads" className="block">
            <StatCard label="Active ads" value={activeAds.length} icon={Megaphone} hint={`${formatKES(totalAdSpend)} total spend`} />
          </AppLink>
        )}
        {perms.includes("loyalty.view") && (
          <AppLink href="/admin/loyalty" className="block">
            <StatCard
              label="Loyalty reminders due"
              value={loyaltyReminders}
              icon={Gift}
              tone={loyaltyReminders > 0 ? "warning" : "default"}
            />
          </AppLink>
        )}
        {perms.includes("referrals.view") && (
          <AppLink href="/admin/referrals" className="block">
            <StatCard label="Pending referrals" value={pendingReferrals} icon={Share2} />
          </AppLink>
        )}
      </div>
    </div>
  );
}
