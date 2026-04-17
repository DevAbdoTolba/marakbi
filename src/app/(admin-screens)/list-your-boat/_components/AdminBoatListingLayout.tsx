"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AdminButton from "../../_components/AdminButton";
import AdminFormStepCounter from "./AdminFormStepCounter";
import useAdminFormStep from "../_hooks/useAdminFormStep";
import BasicInfoStep1 from "./AdminFormSteps/BasicInfoStep1";
import AdminFormContainer from "../../_components/AdminFormContainer";
import SpecificationsStep2 from "./AdminFormSteps/SpecificationsStep2";
import PhotosFeaturesStep4 from "./AdminFormSteps/PhotosFeaturesStep4";
import LocationPricingStep3 from "./AdminFormSteps/LocationPricingStep3";

type stepInfo = {
  title: string;
  subtitle: string;
};

export default function AdminBoatListingLayout() {
  const methods = useForm();

  const [stepInfo, setStepInfo] = useState<stepInfo>({
    title: "Basic Info",
    subtitle: "Tell us about your boat",
  });

  const { currentStep, setStep } = useAdminFormStep();

  const steps = useMemo(
    () => [
      {
        stepNumber: 1,
        id: "Step 1",
        name: "Basic Info",
        title: "Basic Information",
        subtitle: "Tell us about your boat",
        fields: ["boatName", "boatType", "boatDescription"],
      },
      {
        stepNumber: 2,
        id: "Step 2",
        name: "Specifications",
        title: "Boat Specifications",
        subtitle: "Provide technical details about your boat",
        fields: [
          "numberOfBathrooms",
          "numberOfCabins",
          "passengerCapacity",
          "yearBuilt",
          "boatLength",
        ],
      },
      {
        stepNumber: 3,
        id: "Step 3",
        name: "Location and Pricing",
        title: "Location & Pricing",
        subtitle: "Where is your boat located and how much do you charge?",
        fields: [
          "harborName",
          "city",
          "state",
          "pricePerDay",
          "pricePerWeek",
          "securityDeposit",
          "minimumRental",
        ],
      },
      {
        stepNumber: 4,
        id: "Step 4",
        name: "Photos and Features",
        title: "Photos & Features",
        subtitle:
          "Add photos and select features to make your listing stand out",
        fields: ["photos", "boatFeatures", "noApprovalRent"],
      },
    ],
    []
  );

  const next = async () => {
    if (currentStep === 4) return;

    // Correct indexing
    const fields = steps[currentStep - 1].fields;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valid = await methods.trigger(fields as any, {
      shouldFocus: true,
    });

    if (!valid) return; // <-- stop if validation failed

    setStep(currentStep + 1);
  };

  const previous = () => {
    if (currentStep === 1) return;
    setStep(currentStep - 1);
  };

  useEffect(() => {
    setStepInfo({
      title: steps[currentStep - 1].title,
      subtitle: steps[currentStep - 1].subtitle,
    });
  }, [currentStep, steps]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) => console.log(data))}
        className="flex flex-col items-center min-h-screen py-[42px] bg-[#F7F7F7]"
      >
        <AdminFormStepCounter />

        <div className="w-full lg:px-[150px] md:px-[100px] sm:px-[50px] px-[10px]">
          <AdminFormContainer
            title={stepInfo?.title}
            subtitle={stepInfo?.subtitle}
          >
            {currentStep === 1 && <BasicInfoStep1 />}
            {currentStep === 2 && <SpecificationsStep2 />}
            {currentStep === 3 && <LocationPricingStep3 />}
            {currentStep === 4 && <PhotosFeaturesStep4 />}

            <div
              className={`mt-6 flex ${
                currentStep !== 1 ? "justify-between" : "justify-end"
              }`}
            >
              {currentStep !== 1 && (
                <AdminButton
                  label="Previous"
                  onClick={previous}
                  type="button"
                  variant="outline"
                />
              )}

              {currentStep === 4 ? (
                <AdminButton
                  label="Submit"
                  onClick={next}
                  type="button"
                  variant="primary"
                />
              ) : (
                <AdminButton
                  label="Next Step"
                  onClick={next}
                  type="button"
                  variant="primary"
                />
              )}
            </div>
          </AdminFormContainer>
        </div>
      </form>
    </FormProvider>
  );
}
