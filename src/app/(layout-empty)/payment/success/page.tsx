"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
// import type { Metadata } from "next";
import Logo from "@/components/Logo";

// export const metadata: Metadata = {
//   title: "Payment Successful",
//   description: "Your payment was completed successfully.",
// };

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const paymentStatus = searchParams.get("payment_status") ?? "paid";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C4A8C] via-[#0C4A8C]/90 to-[#021526] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 hidden sm:block">
        <Logo width={40} height={100} />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-6 py-8 sm:px-8 sm:py-10 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75"
            />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 font-poppins">
          Payment Successful
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Thank you! Your payment has been received. Your booking is now{" "}
          <span className="font-semibold text-emerald-600">submitted</span> and
          will be reviewed by our team.
        </p>

        {/* Order info */}
        {(orderId || paymentStatus) && (
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-left mb-6 border border-gray-100">
            {orderId && (
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium text-gray-900">#{orderId}</span>
              </div>
            )}
            {paymentStatus && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-medium capitalize text-emerald-600">
                  {paymentStatus}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/my-bookings")}
            className="w-full h-11 rounded-xl bg-[#0C4A8C] text-white font-medium font-poppins hover:bg-[#0A3D7A] transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full h-11 rounded-xl border border-gray-300 text-gray-700 font-medium font-poppins hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Small helper text */}
      <p className="mt-6 text-xs sm:text-sm text-white/70 text-center max-w-md">
        You will also receive a confirmation via your registered contact
        channels once your trip is verified.
      </p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#0C4A8C] via-[#0C4A8C]/90 to-[#021526] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
