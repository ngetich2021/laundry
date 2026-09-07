import type { RetentionInvoice, LoyaltyCard, Campaign } from "@prisma/client";

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

export function formatKES(amount: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);
}
