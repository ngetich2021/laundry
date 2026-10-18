// app/(site)/location/page.tsx  →  /location/
import { MapPin, Navigation } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Find Us: Rock Centre, Eldoret–Iten Road",
  description:
    "Next to Palmcare Sinai Hospital, opposite Zebra Ways Plaza. Open Monday to Saturday, 8am to 5pm. Directions and map inside.",
  path: "/location/",
  image: "/og/og-location.jpg",
});

export default function LocationPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Location", path: "/location/" }]} />
      <PageHeader
        title="Find our laundry in Eldoret"
        subtitle="On Eldoret–Iten Road at Rock Centre, next to Palmcare Sinai Hospital and opposite Zebra Ways Plaza."
        crumbs={[{ name: "Home", href: "/" }, { name: "Location" }]}
        image="/images/shop/shop-front.webp"
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <iframe
                title="Map showing Royal Laundry & Dry Cleaners on Eldoret–Iten Road"
                src={SITE.mapsEmbed}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-gray-700">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-blue-600" />
                  {SITE.address.street}, {SITE.address.city}
                </p>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-yellow-500 px-5 py-2.5 font-bold text-black hover:bg-yellow-400"
                >
                  <Navigation className="size-4" /> Get directions
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shop/shop-front.webp"
                alt="Royal Laundry & Dry Cleaners shop front sign, Rock Centre, Eldoret–Iten Road"
                className="h-72 w-full object-cover"
                loading="lazy"
              />
              <p className="p-6 text-gray-700">
                Look for our <strong>Royal Laundry &amp; Dry Cleaners</strong> sign at Rock Centre. Can&apos;t make it to
                the shop? We offer free pickup and delivery across Eldoret.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <ContactCard email="info" emailLabel="General enquiries" heading="Visit or call us" />
          </div>
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
