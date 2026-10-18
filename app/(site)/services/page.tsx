// app/(site)/services/page.tsx  →  /services/
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { SERVICES } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Laundry & Dry Cleaning Services in Eldoret",
  description:
    "Wash & fold, ironing, dry cleaning, duvet and curtain cleaning, office & uniform laundry, plus free pickup and delivery in Eldoret.",
  path: "/services/",
  image: "/og/og-services.jpg",
});

export default function ServicesPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }]} />
      <PageHeader
        title="Our laundry & dry cleaning services"
        subtitle="Domestic and commercial laundry in Eldoret, done with care. We wash, dry, iron and fold, and we collect and deliver for free."
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        image="/wash.jpeg"
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={`${s.name} at ${"Royal Laundry"} Eldoret`} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-900">{s.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">{s.intro}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ContactCard email="order" emailLabel="Orders & pickups" />
          </div>
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
