"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentHeader from "./PaymentHeader";
import useFormStep from "@/hooks/useFormStep";
import useBookingStore from "@/hooks/useBookingStore";
import StepOneBookingInfo from "./steps/stepOneBookingInfo/StepOneBookingInfo";
import StepTwoPersonalInfo from "./steps/stepTwoPersonalInfo/StepTwoPersonalInfo";
import StepThreePaymentInfo from "./steps/stepThreePaymentInfo/StepThreePaymentInfo";

export default function PaymentLayout() {
  const router = useRouter();
  const { currentStep } = useFormStep();
  const bookingData = useBookingStore((s) => s.bookingData);
  const setBookingData = useBookingStore((s) => s.setBookingData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // If store already has data, we're good
    if (bookingData) {
      setHydrated(true);
      return;
    }

    // Check for pending_booking_data (login redirect flow)
    const pending = localStorage.getItem('pending_booking_data');
    if (pending) {
      setBookingData(JSON.parse(pending));
      localStorage.removeItem('pending_booking_data');
      setHydrated(true);
      return;
    }

    // No data at all — redirect home
    router.replace('/');
  }, [bookingData, setBookingData, router]);

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    );
  }

  return (
    <div
      className="
        w-full 
        px-4 sm:px-6 md:px-10 lg:px-16 
        py-6 sm:py-8 md:py-10 
        max-w-7xl 
        mx-auto
      "
    >
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <PaymentHeader />
      </div>

      {/* Dynamic Step Section */}
      <div className="w-full">
        {currentStep === 1 && <StepOneBookingInfo />}
        {currentStep === 2 && <StepTwoPersonalInfo />}
        {currentStep === 3 && <StepThreePaymentInfo />}
      </div>
    </div>
  );
}
