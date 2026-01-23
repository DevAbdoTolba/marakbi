"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TripDetails from "./tripDetails/TripDetails";
import useFormStep from "@/hooks/useFormStep";
import Image from "next/image";

export default function StepOneBookingInfo() {
  const router = useRouter();
  const { setStep } = useFormStep();
  const [bookingData, setBookingData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // Load booking data from localStorage
    const savedBooking = localStorage.getItem('booking_data');
    if (savedBooking) {
      setBookingData(JSON.parse(savedBooking));
    } else {
      // If no booking data, redirect to home
      router.push('/');
    }
  }, [router]);

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    );
  }

  return (
    <div
      className="
        flex flex-col-reverse lg:flex-row 
        justify-between 
        gap-8 md:gap-12 lg:gap-24 xl:gap-32 
        w-full 
        px-4 sm:px-6 lg:px-0
      "
    >
      {/* Left side: Booking details */}
      <div className="w-full lg:w-[60%]">
        <h2 className="text-2xl font-bold mb-6 font-poppins">Booking Information</h2>

        {/* Booking Details */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex gap-4">
            {typeof bookingData.boat_image === 'string' && bookingData.boat_image && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={bookingData.boat_image}
                  alt={String(bookingData.boat_name || 'Boat')}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 font-poppins ">{String(bookingData.boat_name || '')}</h3>
              <div className="space-y-1 text-gray-600">
                <p>Rental Type: {bookingData.rental_type === 'hourly' ? 'Per Hour' : 'Per Day'}</p>
                {!!bookingData.hours && (
                  <p>Duration: {String(bookingData.hours)} hour{Number(bookingData.hours) > 1 ? 's' : ''}</p>
                )}
                {!!bookingData.days && (
                  <p>Duration: {String(bookingData.days)} day{Number(bookingData.days) > 1 ? 's' : ''}</p>
                )}
                <p>Guests: {String(bookingData.guest_count)} / {String(bookingData.max_seats)}</p>
                <p className="text-sm">
                  {new Date(String(bookingData.start_date)).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4 font-poppins">Price Breakdown</h3>
          <div className="space-y-2">
            {typeof bookingData.base_price === 'number' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-semibold">{bookingData.base_price.toFixed(0)} EGP</span>
              </div>
            )}
            {typeof bookingData.service_fee === 'number' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee </span>
                <span className="font-semibold">{bookingData.service_fee.toFixed(0)} EGP</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-sky-900">
                  {typeof bookingData.total_price === 'number' ? bookingData.total_price.toFixed(0) : (typeof bookingData.base_price === 'number' ? bookingData.base_price.toFixed(0) : '0')} EGP
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(2)}
          className="mt-6 w-full px-6 py-3 bg-sky-900 text-white rounded-lg hover:bg-sky-800 transition-colors"
        >
          Continue
        </button>
      </div>

      {/* Right side: Trip details */}
      <div className="w-full lg:w-[40%]">
        <TripDetails />
      </div>
    </div>
  );
}
