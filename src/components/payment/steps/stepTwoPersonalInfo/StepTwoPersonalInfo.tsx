"use client";

import React, { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import useFormStep from "@/hooks/useFormStep";

export default function StepTwoPersonalInfo() {
  const { setStep } = useFormStep();
  const [loading, setLoading] = useState(true);
  const [bookingFor, setBookingFor] = useState<'self' | 'other'>('self');

  // Fields for self booking
  const [selfPhone, setSelfPhone] = useState("");

  // Fields for booking for someone else
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherPhone, setOtherPhone] = useState("");

  // Notes field (for both)
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await customerApi.getProfile();
        if (response.success && response.data) {
          // Pre-fill phone from profile
          setSelfPhone(response.data.phone || "");
        }
      } catch {
        console.log("No profile found");
      } finally {
        setLoading(false);
      }
    };

    // Check if there's already saved contact info
    const savedBooking = localStorage.getItem('booking_data');
    if (savedBooking) {
      const data = JSON.parse(savedBooking);
      if (data.booking_for) {
        setBookingFor(data.booking_for);
      }
      if (data.contact_phone) {
        if (data.booking_for === 'self') {
          setSelfPhone(data.contact_phone);
        } else {
          setOtherPhone(data.contact_phone);
        }
      }
      if (data.contact_first_name) setFirstName(data.contact_first_name);
      if (data.contact_last_name) setLastName(data.contact_last_name);
      if (data.booking_notes) setNotes(data.booking_notes);
    }

    loadProfile();
  }, []);

  const handleContinue = async () => {
    setError("");

    // Validation
    if (bookingFor === 'self') {
      if (!selfPhone) {
        setError("Phone number is required");
        return;
      }
    } else {
      if (!firstName || !lastName || !otherPhone) {
        setError("First name, last name, and phone number are required");
        return;
      }
    }

    // Save contact info to localStorage for step 3
    const savedBooking = localStorage.getItem('booking_data');
    const bookingData = savedBooking ? JSON.parse(savedBooking) : {};

    bookingData.booking_for = bookingFor;
    bookingData.contact_first_name = bookingFor === 'other' ? firstName : null;
    bookingData.contact_last_name = bookingFor === 'other' ? lastName : null;
    bookingData.contact_phone = bookingFor === 'self' ? selfPhone : otherPhone;
    bookingData.booking_notes = notes || null;

    localStorage.setItem('booking_data', JSON.stringify(bookingData));
    setStep(3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 font-poppins">Contact Information</h2>

      {/* Booking For Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Who is this booking for?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setBookingFor('self')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${bookingFor === 'self'
                ? 'border-sky-900 bg-sky-50 text-sky-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
          >
            For Me
          </button>
          <button
            type="button"
            onClick={() => setBookingFor('other')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${bookingFor === 'other'
                ? 'border-sky-900 bg-sky-50 text-sky-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
          >
            For Someone Else
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {bookingFor === 'self' ? (
          /* Fields for self booking */
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={selfPhone}
              onChange={(e) => setSelfPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This phone number will be shared with the boat owner
            </p>
          </div>
        ) : (
          /* Fields for booking for someone else */
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={otherPhone}
                onChange={(e) => setOtherPhone(e.target.value)}
                placeholder="Their phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
                required
              />
            </div>
          </>
        )}

        {/* Notes field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or notes for the boat owner"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-900 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 bg-sky-900 text-white rounded-lg hover:bg-sky-800 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
