import ReferralTracker from "@/components/site/referral-tracker";

export const metadata = {
  title: "Track your referral | Royal Laundry & Dry Cleaners",
};

export default function ReferralTrackingPage() {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Track your referral rewards</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Enter the phone number you referred friends with to see how many have signed up and what you&apos;ve earned.
        </p>
      </div>
      <div className="mt-8">
        <ReferralTracker />
      </div>
    </main>
  );
}
