"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Book from './Book';   // ← Your modal component

// ------------------------------------------------------------------
// Fallback slides – used only if no active slides are published yet
// ------------------------------------------------------------------
const FALLBACK_SLIDES: HeroSlideData[] = [
  {
    id: "fallback-1",
    label: "Ironing Perfection, Delivered Fast",
    body: "Achieve that crisp, flawless look without lifting a finger. Pure convenience starts here.",
    ctaText: "Schedule Ironing Pickup",
    ctaLink: null,
    imageUrl: '/iron.jpeg',
  },
  {
    id: "fallback-2",
    label: "Washing Made Wonderful & Easy",
    body: "Experience deep, eco-friendly cleaning with effortless same-day pickup and delivery.",
    ctaText: "Start Washing Order",
    ctaLink: null,
    imageUrl: '/wash.jpeg',
  },
  {
    id: "fallback-3",
    label: "Experience Unparalleled Convenience",
    body: "Our premium laundry services ensure a spotless finish and absolute peace of mind, every time.",
    ctaText: "Book Your Service Now",
    ctaLink: null,
    imageUrl: '/iron1.jpeg',
  },
  {
    id: "fallback-4",
    label: "Care Beyond Compare for Fabrics",
    body: "From delicates to heavy linens, trust our experts for gentle treatment and sparkling results.",
    ctaText: "See All Pricing",
    ctaLink: "/#pricing",
    imageUrl: '/iron.jpeg',
  },
];

export interface HeroSlideData {
  id: string;
  label: string;
  body: string;
  ctaText: string;
  ctaLink: string | null;
  imageUrl: string;
}

export default function Hero({ slides }: { slides?: HeroSlideData[] }) {
  const herox = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;

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
    if (herox.length <= 1) return;
    const timer = setInterval(() => {
      setIsTextAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % herox.length);
        setIsTextAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, [herox.length]);

  const safeIndex = currentSlide < herox.length ? currentSlide : 0;
  const currentHero = herox[safeIndex];
  const contentAnimationClass = `transform transition-all duration-700 ease-in-out
    ${isTextAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'}`;

  function handleCtaClick() {
    if (currentHero.ctaLink) {
      window.location.href = currentHero.ctaLink;
      return;
    }
    setIsModalOpen(true);
  }

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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.id}
              src={slide.imageUrl}
              alt={slide.label}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
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
            {currentHero.body}
          </p>

          {/* CTA – opens the Book modal, or follows ctaLink if set */}
          <button
            onClick={handleCtaClick}
            className={`group inline-flex items-center gap-3
              bg-gradient-to-r from-sky-500 to-blue-600 text-white
              font-bold text-lg px-8 py-4 rounded-full shadow-2xl
              hover:from-sky-600 hover:to-blue-700
              transform hover:scale-105 hover:-translate-y-1
              transition-all duration-300 ease-out
              ring-2 ring-sky-300 ring-opacity-50 ${contentAnimationClass}`}
          >
            {currentHero.ctaText}
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          {/* Dots */}
          {herox.length > 1 && (
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
          )}
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
