'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

// === EMAILJS CONFIG ===
const EMAILJS_SERVICE_ID = 'service_wun6ddi';
const EMAILJS_TEMPLATE_ID = 'template_j4f5ulv';
const EMAILJS_USER_ID = 'Y7vLoMpldI25K2O9k';
// ======================

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(
      /^(\+254|0|7|1)\d{8,9}$/,
      'Valid Kenyan number: 0712345678 or +254712345678'
    ),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function Book() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      const templateParams = {
        from_name: data.name,
        reply_to: data.email,
        phone_number: data.phone,
        message: data.message,
      };

      console.log('Sending:', templateParams);

      const result: EmailJSResponseStatus = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );

      console.log('Success:', result);
      setSubmitSuccess(true);
      reset();
    } catch (error: unknown) {
      // ✅ FIXED: Use EmailJS's official error type
      const emailError = error as EmailJSResponseStatus;
      console.error('EmailJS Error:', emailError);
      
      const errorMessage = emailError.text || 'Failed to send. Try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Book Laundry Service</h2>
      <p className="text-center text-gray-600 mb-6">Fill the form below</p>

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Success! Your booking was sent. Well call you soon.
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone (Kenyan)
          </label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="0712345678"
            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Pickup Details / Message
          </label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder="5 shirts, 2 bedsheets, pickup Friday..."
            className={`mt-1 block w-full px-3 py-2 border rounded-md ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 font-medium text-white rounded-md transition ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Booking'}
        </button>
      </form>

      <p className="mt-6 text-xs text-center text-gray-500">
        Emails sent securely via EmailJS. No data stored.
      </p>
    </div>
  );
}