'use client';

import React, { useState } from 'react';
import { Phone, Mail, Star } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';   // Official WhatsApp icon
import FeedbackForm from './FeedForm';

const phoneNumber = "0743180071";
const whatsappLink = `https://wa.me/254${phoneNumber.replace(/^0/, '')}?text=Hi%20Royal%20Laundry!%20I'd%20like%20to%20share%20my%20feedback%20`;

export default function Feedback() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <div className="w-full text-center py-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-6">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          We Value Your Feedback
        </h2>

        {/* Pure icons only – no background */}
        <div className="flex justify-center items-center gap-8 md:gap-12">
          {/* WhatsApp – real logo */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <SiWhatsapp className="w-12 h-12 md:w-14 md:h-14" />
          </a>

          {/* Call */}
          <a
            href={`tel:+254${phoneNumber.replace(/^0/, '')}`}
            className="text-sky-600 hover:text-sky-700 transition-colors"
            aria-label="Call us"
          >
            <Phone className="w-12 h-12 md:w-14 md:h-14" />
          </a>

          {/* Email Form */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Write feedback"
          >
            <Mail className="w-12 h-12 md:w-14 md:h-14" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Royal Laundry & Dry Cleaners • Eldoret
        </p>
      </div>

      <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}