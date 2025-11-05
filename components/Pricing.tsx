import React from 'react';
import { Package, WashingMachine } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Pricing</h2>
          <p className="text-sm text-gray-600 mt-1">Simple, transparent rates</p>
        </div>

        {/* Compact Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Duvet Card */}
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
                <span className="font-medium text-blue-600">KSh.400+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">5x6</span>
                <span className="font-medium text-blue-600">KSh.500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">6x6</span>
                <span className="font-medium text-blue-600">KSh.600+</span>
              </div>
            </div>
          </div>

          {/* Bulk Laundry Card */}
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
        </div>
      </div>
    </div>
  );
}