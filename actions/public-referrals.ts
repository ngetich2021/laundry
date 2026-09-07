"use server";

import { prisma } from "@/lib/prisma";
import { normalizePhone, maskPhone } from "@/lib/phone";

export interface ReferralHistoryEntry {
  id: string;
  referredName: string;
  referredPhoneMasked: string;
  status: "PENDING" | "CONVERTED" | "REWARD_APPLIED" | "EXPIRED";
  rewardPercent: number;
  createdAt: string;
}

export interface ReferralProgress {
  found: boolean;
  name: string;
  phoneMasked: string;
  totalReferred: number;
  converted: number;
  rewardsApplied: number;
  conversionPct: number;
  history: ReferralHistoryEntry[];
}

const EMPTY: Omit<ReferralProgress, "found" | "phoneMasked"> = {
  name: "",
  totalReferred: 0,
  converted: 0,
  rewardsApplied: 0,
  conversionPct: 0,
  history: [],
};

export async function getReferralProgress(rawPhone: string): Promise<ReferralProgress> {
  const last9 = normalizePhone(rawPhone);
  if (last9.length < 7) {
    return { found: false, phoneMasked: "", ...EMPTY };
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerPhone: { endsWith: last9 } },
    orderBy: { createdAt: "desc" },
  });

  if (referrals.length === 0) {
    return { found: false, phoneMasked: maskPhone(rawPhone), ...EMPTY };
  }

  const converted = referrals.filter((r) => r.status === "CONVERTED" || r.status === "REWARD_APPLIED").length;
  const rewardsApplied = referrals.filter((r) => r.status === "REWARD_APPLIED").length;

  return {
    found: true,
    name: referrals[0].referrerName,
    phoneMasked: maskPhone(referrals[0].referrerPhone),
    totalReferred: referrals.length,
    converted,
    rewardsApplied,
    conversionPct: referrals.length > 0 ? Math.round((converted / referrals.length) * 100) : 0,
    history: referrals.map((r) => ({
      id: r.id,
      referredName: r.referredName,
      referredPhoneMasked: maskPhone(r.referredPhone),
      status: r.status,
      rewardPercent: r.rewardPercent,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}
