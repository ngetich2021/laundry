'use client';

import React, { useState } from 'react';
import { Package, WashingMachine, Shirt, Sparkles, Droplets, Wind, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Book from './Book';
import Feedback from './Feedback';
import { PRICES, formatKES } from '@/lib/site';

const ICONS: Record<string, LucideIcon> = { Package, WashingMachine, Shirt, Sparkles, Droplets, Wind };

const ACCENTS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
];

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Pricing</h2>
            <p className="text-sm text-gray-600 mt-1">Simple, transparent rates</p>
          </div>

          {/* Compact Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {PRICES.map((category, i) => {
              const Icon = ICONS[category.icon] ?? Package;
              const accent = ACCENTS[i % ACCENTS.length];
              const single = category.items.length === 1;
              return (
                <div
                  key={category.name}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 ${accent.bg} rounded-lg`}>
                      <Icon className={`w-5 h-5 ${accent.text}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  {single ? (
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${accent.text}`}>{formatKES(category.items[0].price)}</div>
                      {category.items[0].unit && <div className="text-sm text-gray-600">{category.items[0].unit}</div>}
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {category.items.map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className="text-gray-600">{item.label}</span>
                          <span className={`font-medium ${accent.text}`}>
                            {formatKES(item.price)}
                            {item.unit ? ` ${item.unit}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {category.note && <p className="mt-3 text-center text-xs font-semibold text-amber-600">{category.note}</p>}
                </div>
              );
            })}
          </div>

          {/* Cool CTA – Opens Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Book Your Clean Now
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full blur-md"
              />
            </button>
            <p className="mt-2 text-xs text-gray-500">Same-day pickup available!</p>
          </motion.div>
        </div>
        <div>
          <Feedback/>
        </div>
      </div>

      {/* Book Modal */}
      <Book
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
