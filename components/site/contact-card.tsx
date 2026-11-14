import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import { SITE, whatsappLink } from "@/lib/site";
import BookButton from "@/components/site/book-button";

/**
 * Contact box shown on every inner page. `email` picks which mailbox the page
 * advertises (order@ for services and pricing, sales@ for commercial, info@ for general).
 */
export default function ContactCard({
  email,
  emailLabel,
  whatsappText,
  heading = "Book or ask a question",
}: {
  email: keyof typeof SITE.emails;
  emailLabel: string;
  whatsappText?: string;
  heading?: string;
}) {
  const address = SITE.emails[email];
  return (
    <aside className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{heading}</h2>
      <ul className="mt-4 space-y-3 text-sm text-gray-700">
        <li className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <span>
            <span className="block text-xs uppercase tracking-wide text-gray-500">{emailLabel}</span>
            <a href={`mailto:${address}`} className="font-semibold text-blue-700 hover:underline">
              {address}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <span>
            <span className="block text-xs uppercase tracking-wide text-gray-500">Call</span>
            <a href={`tel:${SITE.phoneIntl}`} className="font-semibold text-gray-900 hover:underline">
              {SITE.phoneDisplay}
            </a>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <span>{SITE.hours.label}</span>
        </li>
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <span>{SITE.address.street}, {SITE.address.city}</span>
        </li>
      </ul>
      <div className="mt-6 flex flex-col gap-3">
        <BookButton className="justify-center" />
        <a
          href={whatsappLink(whatsappText ?? "Hi Royal Laundry! I'd like to book a pickup.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white shadow transition hover:bg-green-600"
        >
          <RiWhatsappFill className="size-5" /> WhatsApp us
        </a>
      </div>
    </aside>
  );
}
