"use client";

import { Gift, Phone } from "lucide-react";

export default function ReferralTracker() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
      <Gift className="mx-auto mb-3 size-8 text-indigo-400" />
      <p className="font-semibold text-gray-900">Check your referral rewards</p>
      <p className="mt-1 text-sm text-gray-600">
        Refer a friend to Royal Laundry &amp; earn rewards. To see your referral progress,
        visit our front desk or give us a call &mdash; we&apos;ll look it up for you.
      </p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
        <Phone className="size-4" /> Ask at the front desk
      </p>
    </div>
  );
}
