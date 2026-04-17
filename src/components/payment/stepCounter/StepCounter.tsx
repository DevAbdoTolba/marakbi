"use client";
import useFormStep from "@/hooks/useFormStep";
import StepCounterItem from "./StepCounterItem";

interface StepCounterProps {
  steps: {
    id: string;
    label: string;
    stepNumber: number;
  }[];
}

export default function StepCounter({ steps }: StepCounterProps) {
  const { setStep, currentStep, completedStep } = useFormStep();

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-2">
      {/* Progress Line */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 -translate-y-1/2 w-[40%] h-0.5 bg-[#D1D1D1] -z-10" />

      {steps.map((step) => {
        // Allow clicking steps that have been completed, or the next step after completed
        const canNavigate = step.stepNumber <= completedStep + 1;
        return (
          <StepCounterItem
            key={step.id}
            onClick={() => setStep(step.stepNumber)}
            label={step.label}
            isActive={step.stepNumber <= currentStep}
            disabled={!canNavigate}
          />
        );
      })}
    </div>
  );
}
