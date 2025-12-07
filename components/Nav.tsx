"use client";

import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import Image from "next/image";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "0743180071";

  const navLinks = [
    { href: "/#home",      label: "Home",          key: "home" },
    { href: "/#footer",    label: "Our Locations", key: "locations" },
    { href: "/#work",      label: "Our Services",  key: "services" },
    { href: "/#footer",    label: "Contact Us",    key: "contact" },
    { href: "/#pricing",   label: "Our Pricing",   key: "pricing" },
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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}   
                href={link.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-bold"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phoneNumber}`}
              className="flex cursor-pointer gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-sm"
            >
              <IoCall size={24} /> Call Us Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <a
              href={`tel:${phoneNumber}`}
              className="flex gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <IoCall size={24} /> Call Us Now
            </a>
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
        <div className="fixed inset-0 z-50 md:hidden">
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}