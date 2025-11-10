'use client';

import React, { useState } from 'react';
import { IoCall } from 'react-icons/io5';
import { RiWhatsappFill } from "react-icons/ri";
import { CiMail } from "react-icons/ci";
import Book from './Book'; // Your modal component

export default function Sticky() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const iconBaseClasses = "p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer";
  const iconSize = 40;

  return (
    <>
      <main>
        {/* Primary Floating WhatsApp Icon (Bottom Left) */}
        <div className='fixed left-4 bottom-8 z-50'>
          <a 
            href="https://wa.me/254743180071" // Replace with your number
            target="_blank" 
            rel="noopener noreferrer"
            title="Chat with us on WhatsApp"
          >
            <RiWhatsappFill 
              className={`${iconBaseClasses} text-white bg-green-500 hover:bg-green-600 animate-pulse`} 
              size={64}
            />
          </a>
        </div>

        {/* Secondary Contact Stack (Top Right) */}
        <div className='fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3 p-2 bg-white/90 backdrop-blur-sm rounded-l-lg shadow-2xl border-l border-t border-b border-gray-200'>
          
          {/* Email Icon – Opens Book Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            title="Book via Email Form"
            className="flex items-center justify-center"
          >
            <CiMail 
              className={`${iconBaseClasses} text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-blue-50`} 
              size={iconSize} 
            />
          </button>

          {/* WhatsApp Icon */}
          <a 
            href="https://wa.me/254743180071" // Replace with your number
            target="_blank" 
            rel="noopener noreferrer"
            title="WhatsApp Chat"
          >
            <RiWhatsappFill 
              className={`${iconBaseClasses} text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100`} 
              size={iconSize}
            />
          </a>

          {/* Phone Call Icon */}
          <a 
            href="tel:+254743180071" // Replace with your number
            title="Call us"
          >
            <IoCall 
              className={`${iconBaseClasses} text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100`} 
              size={iconSize} 
            />
          </a>
        </div>
      </main>

      {/* Book Modal – Triggered by Email Icon */}
      <Book
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}