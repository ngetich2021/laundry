// components/site/structured-data.tsx
// Google "business card" data (schema.org). Helps the shop show up in local
// search and Maps with address, phone, hours and services.
import { SITE, SERVICES } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "DryCleaningOrLaundry",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icons/icon-512.png`,
    image: [`${SITE.url}/og/og-home.jpg`, `${SITE.url}/og/og-location.jpg`],
    description: SITE.description,
    telephone: SITE.phoneIntl,
    email: SITE.emails.info,
    priceRange: "KES 100 – KES 600",
    currenciesAccepted: "KES",
    paymentAccepted: "Cash, M-Pesa",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsUrl,
    areaServed: { "@type": "City", name: "Eldoret" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SITE.hours.days,
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer service", telephone: SITE.phoneIntl, email: SITE.emails.info, areaServed: "KE" },
      { "@type": "ContactPoint", contactType: "orders", telephone: SITE.phoneIntl, email: SITE.emails.order, areaServed: "KE" },
      { "@type": "ContactPoint", contactType: "sales", email: SITE.emails.sales, areaServed: "KE" },
    ],
    sameAs: Object.values(SITE.socials),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Laundry services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${SITE.url}/services/${s.slug}/` },
      })),
    },
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
