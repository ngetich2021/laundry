'use client';

import React from 'react';
import { Calendar, Truck, Sparkles, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Working() {
  const steps = [
    {
      icon: Calendar,
      title: 'Book Online',
      description: 'Set up pickup in seconds',
      color: 'from-blue-400 to-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      cartoon: (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full shadow-sm"
          >
            <span className="text-xs">Fast</span>
          </motion.div>
        </div>
      )
    },
    {
      icon: Truck,
      title: 'We Collect',
      description: 'From your doorstep',
      color: 'from-sky-400 to-sky-500',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      cartoon: (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
            <div className="w-12 h-8 bg-sky-600 rounded-t-xl rounded-br-xl relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-sky-300 rounded-full"></div>
              <div className="absolute top-1 right-1 w-2 h-2 bg-sky-300 rounded-full"></div>
            </div>
          </div>
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-10 left-1/2 transform -translate-x-1/2"
          >
            <Package className="w-5 h-5 text-sky-600" />
          </motion.div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: 'Wash & Fold',
      description: 'Cleaned with care',
      color: 'from-pink-400 to-pink-500',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      cartoon: (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-pink-600" />
            </motion.div>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="absolute -top-1 left-2 w-2 h-2 bg-pink-400 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            className="absolute -top-1 right-2 w-2 h-2 bg-pink-300 rounded-full"
          />
        </div>
      )
    },
    {
      icon: Package,
      title: 'We Deliver',
      description: 'Fresh & ready',
      color: 'from-rose-400 to-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      cartoon: (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl flex items-center justify-center shadow-sm p-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-4 h-4 bg-rose-400 rounded"></div>
              <div className="w-4 h-4 bg-pink-400 rounded"></div>
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <div className="w-4 h-4 bg-green-400 rounded"></div>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-400 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-bold"
          >
            Check
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">Works</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">4 simple steps to fresh laundry</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={`bg-white rounded-2xl p-5 border ${step.border} hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center text-center space-y-3`}>
                <div className="mb-2">
                  {step.cartoon}
                </div>
                <div className={`w-7 h-7 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-tight">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Book Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Now
            </span>
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              initial={false}
            />
            <motion.div
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-white/30 rounded-full blur-md"
            />
          </button>
        </motion.div>
      </div>
    </div>
  );
}