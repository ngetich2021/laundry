import Link from "next/link";
import {
  FaAngleDoubleRight,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTiktok,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { SITE, SERVICES } from "@/lib/site";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Location", href: "/location/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "About Us", href: "/about/" },
  { label: "Refer & Earn", href: "/referrals/" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand & about */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            {SITE.name}
          </h2>
          <p className="text-sm leading-relaxed">
            Laundry? Let&apos;s make it <span className="font-semibold text-yellow-400">ROYAL</span>. Premium wash, dry,
            iron, fold &amp; pick-up service in Eldoret.
          </p>
          <p className="flex items-center gap-2 text-sm">
            <FaClock className="text-yellow-500" /> {SITE.hours.label}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200 group"
                >
                  <FaAngleDoubleRight className="text-yellow-500 text-xs group-hover:translate-x-1 transition-transform" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Location & contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-500" />
            Find Us
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-400">{SITE.address.street}, {SITE.address.city}</p>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-600 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-yellow-500 transition-colors"
            >
              <FaMapMarkerAlt />
              Open in Maps
            </a>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <FaPhone className="text-yellow-500" />
              <a href={`tel:${SITE.phoneIntl}`} className="hover:text-yellow-400">
                {SITE.phoneDisplay}
              </a>
            </p>
            {[SITE.emails.info, SITE.emails.order].map((email) => (
              <p key={email} className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-yellow-400 whitespace-nowrap text-sm">
                  {email}
                </a>
              </p>
            ))}
          </div>
        </div>

        {/* Services + socials */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Our Services</h2>
          <ul className="space-y-2 text-sm mb-6">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/`}
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors before:content-[''] before:w-1 before:h-1 before:bg-yellow-500 before:rounded-full"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold text-white mb-3">Follow Us</h2>
          <div className="flex gap-4 text-2xl">
            <a href={SITE.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href={SITE.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={SITE.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Facebook">
              <FaFacebook />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">DM to book your pickup! Fresh mood guaranteed.</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} <span className="text-yellow-400 font-medium">{SITE.name}</span>. All rights
          reserved. | {SITE.address.city}, Kenya
        </p>
      </div>
    </footer>
  );
}
