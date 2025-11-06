'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shirt, Droplets, Wind, Package, ArrowRight } from 'lucide-react';
import Book from './Book'; // ← Your modal component

export default function Work() {
  const [isModalOpen, setIsModalOpen] = useState(false); // ← modal state

  const services = [
    { icon: Droplets, title: 'Wash', desc: 'Eco-friendly deep clean' },
    { icon: Wind, title: 'Dry', desc: 'Fast & gentle' },
    { icon: Shirt, title: 'Iron', desc: 'Crisp press' },
    { icon: Package, title: 'Fold', desc: 'Ready to wear' },
  ];

  return (
    <>
      <main className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Compact Hero */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center shadow-xl">
                <Shirt className="w-8 h-8 text-blue-900" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-black text-white"
            >
              Laundry. Done.
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-base text-blue-100 max-w-xl mx-auto"
            >
              We wash, dry, iron, and fold. You relax.
            </motion.p>
          </div>

          {/* Compact Service Flow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="w-12 h-12 mx-auto bg-cyan-400 rounded-full flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">{service.title}</h3>
                <p className="text-xs text-blue-200 mt-1">{service.desc}</p>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-5 h-5 text-cyan-400 opacity-60" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Compact CTA – Now opens modal */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center space-y-3"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 bg-cyan-400 text-blue-900 font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span>Wash for Me</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </button>
            <p className="text-xs text-blue-200">Trusted by 2,800+ customers</p>
          </motion.div>
        </div>
      </main>

      {/* Book Modal – opens from this CTA */}
      <Book
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}