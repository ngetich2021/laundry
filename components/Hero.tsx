"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Book from './Book';   // ← Your modal component

// ------------------------------------------------------------------
// Slides data – unchanged
// ------------------------------------------------------------------
const herox = [
  {
    id: 1,
    label: "Ironing Perfection, Delivered Fast",
    p_text: "Achieve that crisp, flawless look without lifting a finger. Pure convenience starts here.",
    cta_text: "Schedule Ironing Pickup",
    img: '/iron.jpeg'
  },
  {
    id: 2,
    label: "Washing Made Wonderful & Easy",
    p_text: "Experience deep, eco-friendly cleaning with effortless same-day pickup and delivery.",
    cta_text: "Start Washing Order",
    img: '/wash.jpeg'
  },
  {
    id: 3,
    label: "Experience Unparalleled Convenience",
    p_text: "Our premium laundry services ensure a spotless finish and absolute peace of mind, every time.",
    cta_text: "Book Your Service Now",
    img: '/iron1.jpeg'
  },
  {
    id: 4,
    label: "Care Beyond Compare for Fabrics",
    p_text: "From delicates to heavy linens, trust our experts for gentle treatment and sparkling results.",
    cta_text: "See All Pricing",
    img: '/iron.jpeg'
  },
];

export default function Hero() {
  // ----------------------------------------------------------------
  // State
  // ----------------------------------------------------------------
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTextAnimating, setIsTextAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);   // ← controls Book modal

  // ----------------------------------------------------------------
  // Auto-rotate every 5 seconds
  // ----------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTextAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % herox.length);
        setIsTextAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = herox[currentSlide];
  const contentAnimationClass = `transform transition-all duration-700 ease-in-out 
    ${isTextAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`;

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <>
      {/* ==== HERO SECTION ==== */}
      <section className="relative h-[60vh] md:h-[60%] w-full overflow-hidden">

        {/* Background Images */}
        <div className="absolute inset-0 h-full">
          {herox.map((slide, index) => (
            <Image
              key={slide.id}
              src={slide.img}
              alt={slide.label}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority={index === 0}
              className={`transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-blue-800/50 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-8">

          {/* Headline */}
          <div className="overflow-hidden mb-4 py-1">
            <h1 className={`font-extrabold text-white text-5xl sm:text-6xl md:text-7xl lg:text-7xl leading-tight drop-shadow-lg ${contentAnimationClass}`}>
              {currentHero.label}
            </h1>
          </div>

          {/* Sub-text */}
          <p className={`text-sm sm:text-xl text-sky-200 mb-6 max-w-2xl font-light drop-shadow-md ${contentAnimationClass}`}>
            {currentHero.p_text}
          </p>

          {/* CTA – opens the Book modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`group inline-flex items-center gap-3 
              bg-gradient-to-r from-sky-500 to-blue-600 text-white 
              font-bold text-lg px-8 py-4 rounded-full shadow-2xl 
              hover:from-sky-600 hover:to-blue-700 
              transform hover:scale-105 hover:-translate-y-1 
              transition-all duration-300 ease-out 
              ring-2 ring-sky-300 ring-opacity-50 ${contentAnimationClass}`}
          >
            {currentHero.cta_text}
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {herox.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTextAnimating(true);
                  setTimeout(() => {
                    setCurrentSlide(index);
                    setIsTextAnimating(false);
                  }, 300);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-10 bg-white shadow-md' : 'bg-white bg-opacity-60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==== BOOK MODAL ==== */}
      {/* Only renders when isModalOpen === true */}
      <Book
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}