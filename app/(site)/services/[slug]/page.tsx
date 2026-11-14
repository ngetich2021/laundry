// app/(site)/services/[slug]/page.tsx  →  /services/wash-and-fold/, /services/ironing/, ...
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import ContactCard from "@/components/site/contact-card";
import { BreadcrumbJsonLd, JsonLd } from "@/components/site/structured-data";
import { SERVICES, SITE, getService } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({
    title: s.title,
    description: s.description,
    path: `/services/${s.slug}/`,
    image: s.ogImage,
  });
}

const EMAIL_LABEL: Record<string, string> = {
  order: "Orders & pickups",
  sales: "Business & commercial enquiries",
  info: "General enquiries",
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const others = SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services/" },
          { name: s.name, path: `/services/${s.slug}/` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: s.name,
          description: s.description,
          url: `${SITE.url}/services/${s.slug}/`,
          areaServed: { "@type": "City", name: "Eldoret" },
          provider: { "@id": `${SITE.url}/#business` },
        }}
      />

      <PageHeader
        title={`${s.name} in Eldoret`}
        subtitle={s.headline}
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }, { name: s.name }]}
        image={s.image}
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          <article className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt={`${s.name} service at Royal Laundry, Eldoret`} className="h-64 w-full object-cover" />
              <div className="space-y-4 p-6 text-gray-700">
                <p className="text-lg font-medium text-gray-900">{s.intro}</p>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">What&apos;s included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {s.price && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Price</h2>
                <dl className="mt-4 divide-y divide-gray-100">
                  {s.price.map((row) => (
                    <div key={row.label} className="flex justify-between py-3">
                      <dt className="text-gray-600">{row.label}</dt>
                      <dd className="font-bold text-blue-700">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/pricing/" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">
                  See all prices →
                </Link>
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Other services</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/services/${o.slug}/`}
                      className="inline-block rounded-full border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <ContactCard
              email={s.email}
              emailLabel={EMAIL_LABEL[s.email] ?? "Email"}
              whatsappText={`Hi Royal Laundry! I'd like to book ${s.name.toLowerCase()}.`}
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
