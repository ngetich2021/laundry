// app/(site)/contact/page.tsx  →  /contact/
import { Mail, Phone, Clock } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import Footer from "@/components/Footer";
import PageHeader from "@/components/site/page-header";
import BookButton from "@/components/site/book-button";
import { BreadcrumbJsonLd } from "@/components/site/structured-data";
import { SITE, whatsappLink } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact: Call or WhatsApp 0790 212 210",
  description:
    "Book a pickup or ask a question. Email info@ or order@drycleaners.co.ke, or visit us at Rock Centre, Iten Road. Mon–Sat, 8am–5pm.",
  path: "/contact/",
  image: "/og/og-contact.jpg",
});

const MAILBOXES: { key: keyof typeof SITE.emails; label: string; text: string }[] = [
  { key: "info", label: "General enquiries", text: "Questions, feedback and anything else." },
  { key: "order", label: "Orders & pickups", text: "Book a pickup or ask about an order." },
  { key: "sales", label: "Business & commercial", text: "Offices, schools, hotels and salons." },
  { key: "finance", label: "Payments & invoices", text: "Receipts, invoices and account queries." },
  { key: "hr", label: "Careers", text: "Job applications and staff matters." },
];

export default function ContactPage() {
  return (
    <main>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }]} />
      <PageHeader
        title="Contact Royal Laundry"
        subtitle="Book a pickup, ask about prices or send us your feedback. We respond quickly."
        crumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
        image="/images/shop/shop-front.webp"
      />

      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <a href={`tel:${SITE.phoneIntl}`} className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <Phone className="size-7 text-blue-600" />
              <h2 className="mt-2 font-bold text-gray-900">Call us</h2>
              <p className="text-lg font-semibold text-blue-700">{SITE.phoneDisplay}</p>
            </a>
            <a
              href={whatsappLink("Hi Royal Laundry! I'd like to book a pickup.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <RiWhatsappFill className="size-7 text-green-500" />
              <h2 className="mt-2 font-bold text-gray-900">WhatsApp</h2>
              <p className="text-lg font-semibold text-green-600">{SITE.phoneDisplay}</p>
            </a>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Clock className="size-7 text-blue-600" />
              <h2 className="mt-2 font-bold text-gray-900">Opening hours</h2>
              <p className="text-gray-700">{SITE.hours.label}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Email the right team</h2>
            <ul className="mt-4 divide-y divide-gray-100">
              {MAILBOXES.map((m) => (
                <li key={m.key} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <span className="block font-semibold text-gray-900">{m.label}</span>
                    <span className="text-sm text-gray-500">{m.text}</span>
                  </span>
                  <a
                    href={`mailto:${SITE.emails[m.key]}`}
                    className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
                  >
                    <Mail className="size-4" /> {SITE.emails[m.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl bg-blue-900 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Prefer to book online?</h2>
            <p className="text-sky-100">Send us your details and we&apos;ll arrange a free pickup.</p>
            <BookButton />
          </div>
        </div>
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
