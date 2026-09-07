"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, CheckCircle2, Gift, Phone, Loader2, Sparkles } from "lucide-react";
import { getReferralProgress, type ReferralProgress } from "@/actions/public-referrals";
import { format } from "date-fns";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending signup",
  CONVERTED: "Signed up",
  REWARD_APPLIED: "Reward paid",
  EXPIRED: "Expired",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONVERTED: "bg-blue-100 text-blue-700",
  REWARD_APPLIED: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-red-100 text-red-600",
};

function barColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 75) return "bg-lime-500";
  if (pct >= 50) return "bg-amber-500";
  if (pct >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function textColor(pct: number) {
  if (pct >= 100) return "text-emerald-600";
  if (pct >= 75) return "text-lime-600";
  if (pct >= 50) return "text-amber-600";
  if (pct >= 25) return "text-orange-600";
  return "text-red-600";
}

export default function ReferralTracker() {
  const [phone, setPhone] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ReferralProgress | null>(null);
  const [tab, setTab] = useState<"overview" | "history">("overview");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const r = await getReferralProgress(phone);
        setResult(r);
        setTab("overview");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="track-phone" className="mb-1.5 block text-sm font-semibold text-gray-900">
            Your phone number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <input
              id="track-phone"
              type="tel"
              inputMode="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0712 345 678"
              className="w-full rounded-full border border-gray-200 py-2.5 pr-4 pl-10 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          {pending ? "Checking..." : "Check progress"}
        </button>
      </form>

      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.found ? "found" : "empty"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5"
          >
            {!result.found ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <Gift className="mx-auto mb-3 size-8 text-indigo-400" />
                <p className="font-semibold text-gray-900">No referrals found for {result.phoneMasked || "that number"} yet</p>
                <p className="mt-1 text-sm text-gray-600">
                  Refer a friend to Royal Laundry &amp; start earning rewards &mdash; ask our front desk to record your first referral.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-4 text-white">
                  <div className="flex size-11 items-center justify-center rounded-full bg-white/15">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{result.name}</p>
                    <p className="text-xs text-indigo-100">{result.phoneMasked}</p>
                  </div>
                </div>

                <div className="flex gap-1 border-b border-gray-100 px-3 pt-2">
                  {(["overview", "history"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {t === "overview" ? "Overview" : `History (${result.history.length})`}
                    </button>
                  ))}
                </div>

                {tab === "overview" ? (
                  <div className="space-y-5 p-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <StatTile icon={<Users className="size-4" />} value={result.totalReferred} label="Referred" />
                      <StatTile icon={<CheckCircle2 className="size-4" />} value={result.converted} label="Signed up" />
                      <StatTile icon={<Gift className="size-4" />} value={result.rewardsApplied} label="Rewards paid" />
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Conversion rate</span>
                        <span className={`font-bold tabular-nums ${textColor(result.conversionPct)}`}>{result.conversionPct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor(result.conversionPct)}`}
                          style={{ width: `${result.conversionPct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-gray-500">
                        {result.converted} of {result.totalReferred} friends you referred have signed up.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-96 space-y-2 overflow-y-auto p-4">
                    {result.history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{h.referredName}</p>
                          <p className="text-xs text-gray-500">{h.referredPhoneMasked} &middot; {format(new Date(h.createdAt), "d MMM yyyy")}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[h.status]}`}>{STATUS_LABEL[h.status]}</span>
                          <span className="text-xs text-gray-500">{h.rewardPercent}% reward</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-lg bg-gray-50 py-3">
      <div className="mx-auto mb-1 flex size-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">{icon}</div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
