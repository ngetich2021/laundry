'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { X, Star } from 'lucide-react';

// === EMAILJS CONFIG ===
const EMAILJS_SERVICE_ID = 'service_wun6ddi';
const EMAILJS_TEMPLATE_ID = 'template_j4f5ulv';
const EMAILJS_PUBLIC_KEY = 'Y7vLoMpldI25K2O9k';
// ======================

// Zod Schema
const formSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .regex(/^(\+254|0|7|1)\d{8,9}$/, 'Valid Kenyan number e.g. 0712345678')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10, 'Feedback must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      rating: 0,
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      const templateParams = {
        from_name: data.name?.trim() || 'Anonymous',
        reply_to: data.email?.trim() || 'no-reply@feedback.com',
        phone_number: data.phone?.trim() || 'Not provided',
        rating: data.rating.toString(),
        rating_stars: '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating),
        message: data.message,
        subject: `New Feedback (${data.rating}⭐) - Royal Laundry`,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setSubmitSuccess(true);
      reset();
      setSelectedRating(0);

      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      // Properly typed error (EmailJS throws Error object)
      const err = error as Error;
      setSubmitError(err.message || 'Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Fully Responsive */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:max-w-lg lg:max-w-xl
                     max-h-screen overflow-y-auto animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Feedback Matters</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Help us improve Royal Laundry & Dry Cleaners
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium">
              Thank you! Your feedback was sent successfully.
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Rate Your Experience <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setSelectedRating(star);
                      setValue('rating', star, { shouldValidate: true });
                    }}
                    className="transition-transform hover:scale-125 focus:outline-none focus:ring-4 focus:ring-yellow-200 rounded-full p-2"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                        star <= selectedRating
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-3 text-sm text-red-600">Please select a rating</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="0712345678 or +254712345678"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-800">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="What did you like? How can we improve?"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedRating === 0}
              className={`w-full py-4 px-6 font-bold text-white rounded-xl transition-all shadow-lg
                ${
                  isSubmitting || selectedRating === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
                }`}
            >
              {isSubmitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>

          <p className="mt-8 text-xs text-center text-gray-500">
            Sent securely • Royal Laundry & Dry Cleaners
          </p>
        </div>
      </div>
    </>
  );
}