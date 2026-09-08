import type { RetentionInvoice, LoyaltyCard, Campaign } from "@prisma/client";
import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";

export function invoiceBalance(invoice: Pick<RetentionInvoice, "amountDue" | "amountPaid">) {
  return invoice.amountDue - invoice.amountPaid;
}

export function retentionAccountBalance(invoices: Pick<RetentionInvoice, "amountDue" | "amountPaid">[]) {
  return invoices.reduce((sum, inv) => sum + invoiceBalance(inv), 0);
}

export function loyaltyPunchesIntoCycle(card: Pick<LoyaltyCard, "punchesCount" | "freeWashThreshold">) {
  return card.punchesCount % card.freeWashThreshold;
}

export function loyaltyFreeWashesAvailable(card: Pick<LoyaltyCard, "totalFreeWashesEarned" | "totalFreeWashesRedeemed">) {
  return card.totalFreeWashesEarned - card.totalFreeWashesRedeemed;
}

export function loyaltyPunchesUntilFree(card: Pick<LoyaltyCard, "punchesCount" | "freeWashThreshold">) {
  const into = loyaltyPunchesIntoCycle(card);
  return into === 0 ? card.freeWashThreshold : card.freeWashThreshold - into;
}

export function adStatus(ad: { startDate: Date | string; endDate: Date | string }, now: Date = new Date()) {
  if (now < new Date(ad.startDate)) return "SCHEDULED" as const;
  if (now > new Date(ad.endDate)) return "ENDED" as const;
  return "ACTIVE" as const;
}

export function campaignProgress(campaign: Pick<Campaign, "targetCount">, achievedCount: number) {
  const pct = campaign.targetCount > 0 ? Math.min(100, Math.round((achievedCount / campaign.targetCount) * 100)) : 0;
  return { achievedCount, targetCount: campaign.targetCount, pct };
}

export interface CampaignDayStat {
  date: Date;
  count: number;
  target: number;
  pct: number;
}

/**
 * For a DAILY-cadence campaign, targetCount is the per-day quota (e.g. 3 videos + 3
 * pics = 6/day). The overall target for the campaign window is that quota multiplied
 * by the number of days it runs, and each day's uploads count toward that day's slice.
 * For a ONE_OFF campaign, targetCount stays a single flat total across the whole window.
 */
export function campaignDailyBreakdown(
  campaign: { startDate: Date | string; endDate: Date | string; targetCount: number; cadence: Campaign["cadence"] },
  achievements: { achievedAt: Date | string }[]
) {
  const start = startOfDay(new Date(campaign.startDate));
  const end = startOfDay(new Date(campaign.endDate));
  const totalDays = Math.max(1, differenceInCalendarDays(end, start) + 1);
  const isDaily = campaign.cadence === "DAILY";
  const dailyTarget = campaign.targetCount;

  const countsByDay = new Map<string, number>();
  for (const a of achievements) {
    const key = startOfDay(new Date(a.achievedAt)).toISOString();
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const days: CampaignDayStat[] = [];
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(start, i);
    const count = countsByDay.get(date.toISOString()) ?? 0;
    const target = isDaily ? dailyTarget : 0;
    days.push({ date, count, target, pct: target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0 });
  }

  const totalTarget = isDaily ? dailyTarget * totalDays : campaign.targetCount;
  const totalAchieved = achievements.length;
  const overallPct = totalTarget > 0 ? Math.min(100, Math.round((totalAchieved / totalTarget) * 100)) : 0;

  const today = startOfDay(new Date());
  const daysElapsed = Math.min(totalDays, Math.max(0, differenceInCalendarDays(today, start) + 1));

  return { days, totalDays, daysElapsed, totalTarget, totalAchieved, overallPct, dailyTarget, isDaily };
}

export function formatKES(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);
}
