// app/(site)/pricing/page.tsx  →  /pricing/
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Laundry Prices in Eldoret – From KES 100 per kg",
  description:
    "Royal Laundry prices: bulk laundry KES 100 per kg, duvets from KES 400 (4x6), 5x6 KES 500, 6x6 KES 600. Free pickup and delivery in Eldoret.",
  path: "/pricing/",
  image: "/og/og-pricing.jpg",
});

export default function PricingPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing/" }]} />
      <PageHeader
        title="Laundry & dry cleaning prices"
        subtitle="Simple, transparent rates. Bulk laundry from KES 100 per kg, and 1 kg free for every 10 kg washed."
        crumbs={[{ name: "Home", href: "/" }, { name: "Pricing" }]}
        image="/wash1.jpeg"
      />

      <Pricing />

      <section className="bg-gray-50 px-4 pb-12">
        <div className="mx-auto max-w-md">
          <ContactCard email="order" emailLabel="Orders & pickups" heading="Ready to book?" />
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
