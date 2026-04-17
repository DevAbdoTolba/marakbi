"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
// import type { Metadata } from "next";
import Logo from "@/components/Logo";

// export const metadata: Metadata = {
//   title: "Payment Failed",
//   description: "Your payment could not be completed.",
// };

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const reason =
    searchParams.get("reason") ||
    searchParams.get("payment_status") ||
    "Payment could not be completed.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7F1D1D] via-[#450A0A] to-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 hidden sm:block">
        <Logo width={40} height={100} />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-6 py-8 sm:px-8 sm:py-10 text-center">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9l6 6m0-6-6 6"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 font-poppins">
          Payment Failed
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Unfortunately, we couldn&apos;t complete your payment. You can try
          again or choose another payment method.
        </p>

        {/* Details */}
        <div className="bg-gray-50 rounded-2xl px-4 py-3 text-left mb-6 border border-gray-100 space-y-1.5">
          {orderId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900">#{orderId}</span>
            </div>
          )}
          {reason && (
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Reason: </span>
              <span className="capitalize">{reason}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/payment")}
            className="w-full h-11 rounded-xl bg-[#0C4A8C] text-white font-medium font-poppins hover:bg-[#0A3D7A] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/my-bookings")}
            className="w-full h-11 rounded-xl border border-gray-300 text-gray-700 font-medium font-poppins hover:bg-gray-50 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-6 text-xs sm:text-sm text-white/80 text-center max-w-md">
        If the amount was deducted from your card and you still see this page,
        please contact support with your order ID and we&apos;ll help you
        verify the payment.
      </p>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#7F1D1D] via-[#450A0A] to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
