"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineMenu, MdLogin } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import Image from "next/image";
import { AppLink } from "@/components/ui/app-link";
import PwaInstallButton from "@/components/site/pwa-install-button";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "0790212210";

  const navLinks = [
    { href: "/#home",      label: "Home",          key: "home" },
    { href: "/#footer",    label: "Our Locations", key: "locations" },
    { href: "/#work",      label: "Our Services",  key: "services" },
    { href: "/#footer",    label: "Contact Us",    key: "contact" },
    { href: "/#pricing",   label: "Our Pricing",   key: "pricing" },
    { href: "/referrals",  label: "Track Referral", key: "referrals" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* logo */}          
          <div className="relative flex items-center h-16 w-32">
            <Link href="/#home">
              <Image src="/logo.jpeg" alt="Logo" fill className="object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <AppLink
                key={link.key}
                href={link.href}
                className="whitespace-nowrap text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-bold"
              >
                {link.label}
              </AppLink>
            ))}
            <a
              href={`tel:${phoneNumber}`}
              className="flex shrink-0 cursor-pointer gap-2 whitespace-nowrap bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-sm"
            >
              <IoCall size={24} /> Call Us Now
            </a>
            <PwaInstallButton className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50" />
            <AppLink
              href="/login"
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors duration-200 font-semibold"
            >
              <MdLogin size={20} /> Staff Login
            </AppLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <a
              href={`tel:${phoneNumber}`}
              className="flex gap-2 whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <IoCall size={24} /> Call Us Now
            </a>
            <PwaInstallButton
              iconOnly
              className="text-gray-700 hover:text-indigo-600 transition"
            />
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

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl text-white font-bold capitalize hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <PwaInstallButton className="flex items-center gap-2 text-xl text-white font-bold capitalize hover:text-indigo-600 transition-colors" />

              {/* Menu stays open (no immediate close) so the loading overlay
                  below is visible while /login is fetched, instead of the
                  menu vanishing and leaving no feedback that anything happened. */}
              <AppLink
                href="/login"
                className="flex items-center gap-2 text-xl text-white font-bold capitalize hover:text-indigo-600 transition-colors"
              >
                <MdLogin size={22} /> Staff Login
              </AppLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}