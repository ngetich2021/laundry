// app/(site)/referrals/page.tsx  →  /referrals/
import { Gift, Users, Wallet } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refer a Friend & Earn KES 150",
  description:
    "Refer friends to Royal Laundry in Eldoret and earn KES 150 for every 10 kg of laundry they wash. Ask at our front desk or WhatsApp us to check your rewards.",
  path: "/referrals/",
  image: "/og/og-referrals.jpg",
});

const STEPS = [
  { icon: Users, title: "Refer a friend", text: "Tell friends, family or colleagues about Royal Laundry and give them your phone number." },
  { icon: Wallet, title: "They wash with us", text: "When they bring their laundry, they mention your number at the front desk." },
  { icon: Gift, title: "You get rewarded", text: "You earn KES 150 for every 10 kg of laundry your referrals wash." },
];

export default function ReferralsPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Refer & earn", path: "/referrals/" }]} />
      <PageHeader
        title="Refer a friend, get rewarded"
        subtitle="Share Royal Laundry with the people you know and earn KES 150 for every 10 kg they wash."
        crumbs={[{ name: "Home", href: "/" }, { name: "Refer & earn" }]}
        image="/wash.jpeg"
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <div key={s.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-blue-950">
                      {i + 1}
                    </span>
                    <s.icon className="size-6 text-blue-600" />
                  </div>
                  <h2 className="mt-3 font-bold text-gray-900">{s.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-blue-900 p-6 text-white">
              <h2 className="text-xl font-bold">Check your rewards</h2>
              <p className="mt-2 text-sky-100">
                Ask at our front desk, call us or send us a WhatsApp message with your phone number, and we&apos;ll tell
                you how many friends you&apos;ve referred and what you&apos;ve earned.
              </p>
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ContactCard
              email="info"
              emailLabel="General enquiries"
              heading="Check your referrals"
              whatsappText="Hi Royal Laundry! I'd like to check my referral rewards. My number is "
            />
          </div>
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
