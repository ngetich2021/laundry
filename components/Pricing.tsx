'use client';

import React, { useState } from 'react';
import { Package, WashingMachine, Shirt, Sparkles, Droplets, Wind, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Book from './Book'; // Your modal component
import Feedback from './Feedback';
import { formatKES } from '@/lib/calc';

const ICONS: Record<string, LucideIcon> = { Package, WashingMachine, Shirt, Sparkles, Droplets, Wind };

export interface PriceItemData {
  id: string;
  label: string;
  price: number;
  unit: string | null;
}

export interface ServiceCategoryData {
  id: string;
  name: string;
  icon: string;
  displayStyle: string;
  items: PriceItemData[];
}

const ACCENTS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
];

export default function Pricing({ categories }: { categories?: ServiceCategoryData[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const hasData = categories && categories.length > 0;

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
            {hasData ? (
              categories!.map((category, i) => {
                const Icon = ICONS[category.icon] ?? Package;
                const accent = ACCENTS[i % ACCENTS.length];
                const isSingle = category.displayStyle === 'SINGLE' && category.items.length === 1;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 ${accent.bg} rounded-lg`}>
                        <Icon className={`w-5 h-5 ${accent.text}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    {isSingle ? (
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${accent.text}`}>{formatKES(category.items[0].price)}</div>
                        {category.items[0].unit && <div className="text-sm text-gray-600">{category.items[0].unit}</div>}
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-gray-600">{item.label}</span>
                            <span className={`font-medium ${accent.text}`}>
                              {formatKES(item.price)}
                              {item.unit ? ` ${item.unit}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <>
                {/* Fallback Duvet Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Duvet Cleaning</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">4x6</span>
                      <span className="font-medium text-blue-600">KSh.400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">5x6</span>
                      <span className="font-medium text-blue-600">KSh.500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">6x6</span>
                      <span className="font-medium text-blue-600">KSh.600</span>
                    </div>
                  </div>
                </div>

                {/* Fallback Bulk Laundry Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <WashingMachine className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Bulk Laundry</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">KSh.100</div>
                    <div className="text-sm text-gray-600">per kg</div>
                  </div>
                </div>
              </>
            )}
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
