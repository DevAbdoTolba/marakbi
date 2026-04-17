"use client";

import PaymentHeader from "./PaymentHeader";
import useFormStep from "@/hooks/useFormStep";
import StepOneBookingInfo from "./steps/stepOneBookingInfo/StepOneBookingInfo";
import StepTwoPersonalInfo from "./steps/stepTwoPersonalInfo/StepTwoPersonalInfo";
import StepThreePaymentInfo from "./steps/stepThreePaymentInfo/StepThreePaymentInfo";

export default function PaymentLayout() {
  const { currentStep } = useFormStep();

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
