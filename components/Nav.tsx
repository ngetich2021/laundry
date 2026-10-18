"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp, IoCall } from "react-icons/io5";
import PwaInstallButton from "@/components/site/pwa-install-button";
import { SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Our Services" },
  { href: "/pricing/", label: "Our Pricing" },
  { href: "/location/", label: "Our Location" },
  { href: "/contact/", label: "Contact Us" },
  { href: "/referrals/", label: "Refer & Earn" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="relative flex items-center h-16 w-32">
            <Link href="/" aria-label={`${SITE.name} home`}>
              <Image src="/logo.jpeg" alt={`${SITE.name} logo`} fill className="object-contain" priority />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap font-bold transition-colors duration-200 hover:text-indigo-600 ${
                  isActive(link.href) ? "text-indigo-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="flex shrink-0 cursor-pointer gap-2 whitespace-nowrap bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-sm"
            >
              <IoCall size={24} /> Call Us Now
            </a>
            <PwaInstallButton className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50" />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <a
              href={`tel:${SITE.phoneIntl}`}
              className="flex gap-2 whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <IoCall size={24} /> Call Us Now
            </a>
            <PwaInstallButton iconOnly className="text-gray-700 hover:text-indigo-600 transition" />
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-700 hover:text-indigo-600 transition"
              aria-label="Open menu"
            >
              <MdOutlineMenu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="fixed right-0 top-20 h-fit w-fit bg-blue-400 shadow-2xl p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 transition"
              aria-label="Close menu"
            >
              <IoCloseSharp size={28} />
            </button>

            <div className="mt-16 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl text-white font-bold capitalize hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <PwaInstallButton className="flex items-center gap-2 text-xl text-white font-bold capitalize hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
