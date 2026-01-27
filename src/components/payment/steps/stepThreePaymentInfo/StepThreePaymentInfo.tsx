"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { customerApi, clientApi, type TripBookingRequest } from "@/lib/api";
import useFormStep from "@/hooks/useFormStep";
import toast from "react-hot-toast";

export default function StepThreePaymentInfo() {
  const router = useRouter();
  const { setStep } = useFormStep();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    // تحميل بيانات الحجز من localStorage
    // Check for pending booking data first (from login redirect)
    let savedBooking = localStorage.getItem('pending_booking_data');
    if (savedBooking) {
      // Move pending booking to active booking
      localStorage.setItem('booking_data', savedBooking);
      localStorage.removeItem('pending_booking_data');
    } else {
      savedBooking = localStorage.getItem('booking_data');
    }

    if (savedBooking) {
      setBookingData(JSON.parse(savedBooking));
    } else {
      // لو مفيش بيانات حجز، رجع للصفحة الأولى
      setStep(1);
    }
  }, [setStep]);

  const handleConfirmPayment = async () => {
    if (!bookingData) return;

    setError("");
    setProcessing(true);

    try {
      // حساب start_date و end_date بشكل صحيح
      let startDate: string;
      let endDate: string;

      if (bookingData.start_date && bookingData.end_date) {
        // استخدام التواريخ المحفوظة في bookingData
        startDate = new Date(bookingData.start_date as string).toISOString();

        // إذا كان hourly، نحسب end_date بناءً على عدد الساعات
        if (bookingData.rental_type === 'hourly' && bookingData.hours) {
          const start = new Date(bookingData.start_date as string);
          const hours = bookingData.hours as number;
          endDate = new Date(start.getTime() + hours * 60 * 60 * 1000).toISOString();
        } else {
          // للـ daily، نستخدم end_date المحفوظ
          endDate = new Date(bookingData.end_date as string).toISOString();
        }
      } else {
        // Fallback: استخدام التاريخ الحالي (يجب ألا يحدث هذا)
        startDate = new Date().toISOString();
        if (bookingData.rental_type === 'hourly' && bookingData.hours) {
          const hours = bookingData.hours as number;
          endDate = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        } else {
          endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        }
      }

      let response;

      if (bookingData.rental_type === 'trip') {
        if (!bookingData.trip_id) {
          setError("Missing trip details for booking");
          setProcessing(false);
          return;
        }
        const tripBookingData: TripBookingRequest = {
          boat_id: bookingData.boat_id as number,
          start_date: startDate,
          guest_count: bookingData.guest_count as number,
          payment_method: paymentMethod,
          platform: 'web',
          trip_id: bookingData.trip_id as number,
          // Contact info
          booking_for: bookingData.booking_for as string,
          contact_first_name: bookingData.contact_first_name as string,
          contact_last_name: bookingData.contact_last_name as string,
          contact_phone: bookingData.contact_phone as string,
          booking_notes: bookingData.booking_notes as string
        };
        response = await clientApi.bookTrip(bookingData.trip_id as number, tripBookingData);
      } else {
        // نرسل total_price كحقل إضافي لضمان أن الـ API يستخدم السعر الصحيح
        const orderData = {
          boat_id: bookingData.boat_id as number,
          start_date: startDate,
          end_date: endDate,
          rental_type: bookingData.rental_type as 'daily' | 'hourly',
          guest_count: bookingData.guest_count as number,
          payment_method: paymentMethod,
          platform: 'web' as const,
          voyage_type: 'Private' as const,
          trip_id: bookingData.trip_id as number | undefined,
          total_price: (bookingData.total_price as number) || (bookingData.base_price as number),
          // Contact info
          booking_for: bookingData.booking_for as string,
          contact_first_name: bookingData.contact_first_name as string,
          contact_last_name: bookingData.contact_last_name as string,
          contact_phone: bookingData.contact_phone as string,
          booking_notes: bookingData.booking_notes as string
        };
        response = await customerApi.createOrder(orderData);
      }

      if (response.success && response.data) {
        // ... rest of success logic
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response.data as any;
        // Check for payment_url in both possible locations (payment_data for regular orders, payment for trips)
        const paymentUrl = responseData.payment_data?.payment_url || responseData.payment?.payment_url;

        if (paymentMethod === 'card' && paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          localStorage.removeItem('booking_data');
          toast.success('Booking created successfully! Payment will be collected in cash.');
          router.push('/my-bookings');
        }
      } else {
        setError(response.error || "Failed to create order");
      }
    } catch (err) {
      console.error("Order creation error:", err);
      setError("An error occurred while processing your order");
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 font-poppins">Payment Method</h2>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2 font-poppins">Booking Summary</h3>
        <p className="text-sm text-gray-600">Boat: {String(bookingData.boat_name || '')}</p>
        <p className="text-sm text-gray-600">Guests: {String(bookingData.guest_count || 0)}</p>

        <p className="text-sm text-gray-600">
          Rental Type: {
            bookingData.rental_type === 'hourly' ? 'Per Hour' :
              bookingData.rental_type === 'trip' ? 'Trip' : 'Per Day'
          }
        </p>

        {bookingData.rental_type === 'trip' && !!bookingData.trip_name && (
          <p className="text-sm font-medium text-sky-900 border-b border-gray-200 pb-2 mb-2">
            Trip: {String(bookingData.trip_name)}
          </p>
        )}

        {!!bookingData.hours && (
          <p className="text-sm text-gray-600">
            Duration: {String(bookingData.hours)} hour{Number(bookingData.hours) > 1 ? 's' : ''}
          </p>
        )}
        {!!bookingData.days && (
          <p className="text-sm text-gray-600">
            Duration: {String(bookingData.days)} day{Number(bookingData.days) > 1 ? 's' : ''}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
          {typeof bookingData.base_price === 'number' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price:</span>
              <span className="font-medium">{bookingData.base_price.toFixed(0)} EGP</span>
            </div>
          )}
          {typeof bookingData.service_fee === 'number' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium">{bookingData.service_fee.toFixed(0)} EGP</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-sky-900">
              {typeof bookingData.total_price === 'number' ? bookingData.total_price.toFixed(0) : (typeof bookingData.base_price === 'number' ? bookingData.base_price.toFixed(0) : '0')} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4 mb-6">
        <div
          onClick={() => setPaymentMethod('card')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-sky-900 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-sky-900 bg-sky-900' : 'border-gray-300'
              }`}>
              {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <div>
              <p className="font-semibold">Pay by Card</p>
              <p className="text-sm text-gray-600">Secure online payment via Fawaterak</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setPaymentMethod('cash')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-sky-900 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-sky-900 bg-sky-900' : 'border-gray-300'
              }`}>
              {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
            </div>
            <div>
              <p className="font-semibold">Pay in Cash</p>
              <p className="text-sm text-gray-600">Pay when you receive the service</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmPayment}
          disabled={processing}
          className="flex-1 px-6 py-3 bg-sky-900 text-white rounded-lg hover:bg-sky-800 transition-colors disabled:opacity-50"
        >
          {processing ? "Processing..." : `Confirm & ${paymentMethod === 'card' ? 'Pay' : 'Book'}`}
        </button>
      </div>
    </div>
  );
}
