"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { RiWhatsappFill } from "react-icons/ri";
import { SITE, whatsappLink } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/location/", label: "Location" },
  { href: "/contact/", label: "Contact" },
  { href: "/referrals/", label: "Refer & Earn" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  // Close the mobile menu on navigation, and stop the page scrolling behind it.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[60] border-b border-slate-200/70 bg-white">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8" aria-label="Main">
        {/* Brand */}
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={`${SITE.name} home`}>
          <Image src="/icons/royal-icon.png" alt="" width={44} height={44} priority className="size-10 shrink-0 sm:size-11" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-extrabold tracking-tight text-[#002C65] sm:text-lg">Royal Laundry</span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2EA3F2] sm:text-[11px]">
              &amp; Dry Cleaners<span className="hidden min-[400px]:inline"> · Eldoret</span>
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                    active ? "text-[#002C65]" : "text-slate-600 hover:bg-slate-100 hover:text-[#002C65]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3.5 -bottom-[3px] h-[3px] rounded-full bg-[#2EA3F2]" aria-hidden="true" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop call button */}
        <a
          href={`tel:${SITE.phoneIntl}`}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-[#002C65] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#003d8a] lg:inline-flex"
        >
          <Phone className="size-4" />
          <span className="xl:hidden">Call us</span>
          <span className="hidden xl:inline">{SITE.phoneDisplay}</span>
        </a>

        {/* Mobile: call icon + menu button */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <a
            href={`tel:${SITE.phoneIntl}`}
            className="inline-flex size-10 items-center justify-center rounded-full bg-[#002C65] text-white sm:size-11"
            aria-label={`Call ${SITE.phoneDisplay}`}
          >
            <Phone className="size-5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-[#002C65] transition hover:bg-slate-100 sm:size-11"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-[72px] z-[60] bg-slate-950/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] z-[61] max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-6 pt-2 shadow-xl lg:hidden"
          >
            <ul className="divide-y divide-slate-100">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-4 text-lg font-semibold ${
                        active ? "text-[#2EA3F2]" : "text-[#002C65]"
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="size-5 opacity-50" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={`tel:${SITE.phoneIntl}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#002C65] py-3 font-bold text-white"
              >
                <Phone className="size-5" /> Call
              </a>
              <a
                href={whatsappLink("Hi Royal Laundry! I'd like to book a pickup.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 font-bold text-white"
              >
                <RiWhatsappFill className="size-5" /> WhatsApp
              </a>
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">
              {SITE.phoneDisplay} · {SITE.hours.label}
            </p>
          </div>
        </>
      )}
    </header>
  );
}
