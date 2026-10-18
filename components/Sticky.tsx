'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { RiWhatsappFill } from 'react-icons/ri';
import Book from './Book';
import { whatsappLink } from '@/lib/site';

/**
 * Two floating buttons:
 *  - bottom left:  email / booking form
 *  - bottom right: WhatsApp chat
 * (Calling is in the top menu.)
 */
export default function Sticky() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Email / booking form — bottom left */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 left-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#002C65] text-white shadow-lg transition hover:scale-105 hover:bg-[#003d8a] sm:bottom-6 sm:left-6"
        aria-label="Email us to book a pickup"
        title="Email us / book a pickup"
      >
        <Mail className="size-6" />
      </button>

      {/* WhatsApp — bottom right */}
      <a
        href={whatsappLink("Hi Royal Laundry! I'd like to book a pickup.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-105 hover:bg-green-600 sm:bottom-6 sm:right-6"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <RiWhatsappFill className="size-8" />
      </a>

      <Book isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}