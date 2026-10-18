// app/(site)/about/page.tsx  →  /about/
import Link from "next/link";
import { Leaf, Truck, BadgeCheck, Users } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us: Rock Centre, Iten Road",
  description:
    "A local Eldoret team washing, ironing and caring for clothes for homes and businesses. Trusted by over 2,800 customers, with free pickup.",
  path: "/about/",
  image: "/og/og-home.jpg",
});

const VALUES = [
  { icon: Leaf, title: "Eco-friendly cleaning", text: "Quality detergents and careful washing that is kind to your clothes." },
  { icon: Truck, title: "Free pickup & delivery", text: "We come to your door, so laundry never eats into your day." },
  { icon: BadgeCheck, title: "Fair, clear prices", text: "From KES 100 per kg, with no hidden charges." },
  { icon: Users, title: "Trusted locally", text: "Over 2,800 customers in Eldoret trust us with their laundry." },
];

export default function AboutPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "About", path: "/about/" }]} />
      <PageHeader
        title="About Royal Laundry & Dry Cleaners"
        subtitle="Laundry? Let's make it ROYAL. Premium wash, dry, iron, fold and pick-up service in Eldoret."
        crumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
        image="/images/shop/shop-front.webp"
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          <article className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shop/shop-front.webp"
                alt="Royal Laundry & Dry Cleaners shop front on Eldoret–Iten Road"
                className="h-64 w-full object-cover"
              />
              <div className="space-y-4 p-6 text-gray-700">
                <p className="text-lg font-medium text-gray-900">
                  Royal Laundry &amp; Dry Cleaners is a laundry and dry cleaning shop on Eldoret–Iten Road, serving
                  both homes and businesses.
                </p>
                <p>
                  We wash, dry, iron and fold everyday clothes, clean duvets, blankets and curtains, dry clean suits and
                  gowns, and look after uniforms and linen for offices, schools, hotels and salons.
                </p>
                <p>
                  You can walk in to our shop at {SITE.address.short}, or book a free pickup and we will collect your
                  laundry and bring it back fresh and ready to wear.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <v.icon className="size-7 text-blue-600" />
                  <h2 className="mt-2 font-bold text-gray-900">{v.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{v.text}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-700">
              See our <Link href="/services/" className="font-semibold text-blue-700 hover:underline">services</Link>,{" "}
              <Link href="/pricing/" className="font-semibold text-blue-700 hover:underline">prices</Link> or{" "}
              <Link href="/location/" className="font-semibold text-blue-700 hover:underline">how to find us</Link>.
            </p>
          </article>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <ContactCard email="info" emailLabel="General enquiries" heading="Get in touch" />
          </div>
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
