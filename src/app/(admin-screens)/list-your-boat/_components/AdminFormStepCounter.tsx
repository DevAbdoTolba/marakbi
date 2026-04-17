import React from "react";
import useAdminFormStep from "../_hooks/useAdminFormStep";

export default function AdminFormStepCounter() {
  const { currentStep, setStep } = useAdminFormStep();

  const steps = [
    { stepNumber: 1, stepLabel: "Basic Info" },
    { stepNumber: 2, stepLabel: "Specifications" },
    { stepNumber: 3, stepLabel: "Location & Pricing" },
    { stepNumber: 4, stepLabel: "Photos & Features" },
  ];

  return (
    <div className="xl:px-[272px] mb-8 lg:px-[172px] md:px-[72px] px-[10px] w-full">
      <div className="flex gap-2 items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.stepNumber}>
            {/* Circle */}
            <div
              onClick={() => setStep(step.stepNumber)}
              className={` ${
                currentStep >= step.stepNumber
                  ? "bg-[#0F61C5]"
                  : "bg-[#ECECF0]"
              } text-white rounded-full transition-all cursor-pointer flex justify-center items-center min-w-10 min-h-10`}
            >
              {step.stepNumber}
            </div>

            {/* Line (not after last step) */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 ${
                  currentStep -1 >= step.stepNumber
                    ? "bg-[#0F61C5]"
                    : "bg-[#ECECF0]"
                } w-full transition-all`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Labels – hidden on mobile */}
      <div className="sm:flex hidden text-[#717182] md:text-base sm:text-sm text-xs justify-between">
        {steps.map((step) => (
          <p key={step.stepNumber}>{step.stepLabel}</p>
        ))}
      </div>
    </div>
  );
}
