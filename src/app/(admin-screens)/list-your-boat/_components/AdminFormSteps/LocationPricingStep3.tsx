import AdminInput from "@/app/(admin-screens)/_components/AdminInput";
import React from "react";
import { useFormContext } from "react-hook-form";

type LocationPricingStepFields = {
  harborName: string;
  city: string;
  state: string;
  pricePerDay: number;
  pricePerWeek?: number;
  securityDeposit: number;
  minimumRental?: number;
};

export default function LocationPricingStep3() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LocationPricingStepFields>();

  return (
    <div className="flex flex-col gap-6">
      <AdminInput
        id="harborName"
        label="Marina/Harbor Name *"
        placeholder="e.g., Miami Beach Marina"
        registration={register("harborName", {
          required: "Marina/Harbor name is required",
        })}
        error={errors.harborName}
      />

      <div className="flex justify-between md:gap-6 gap-2">
        <AdminInput
          id="city"
          label="City *"
          placeholder="e.g., Miami"
          registration={register("city", {
            required: "City is required",
          })}
          error={errors.city}
        />
        <AdminInput
          id="state"
          label="State *"
          placeholder="e.g., Florida"
          registration={register("state", {
            required: "State is required",
          })}
          error={errors.state}
        />
      </div>

      <div className="my-6 h-[1px] w-full bg-[#0000001A]" />

      <div>
        <p className="text-[#0A0A0A] mb-6 sm:text-base text-sm">
          Pricing Information
        </p>

        <div className="flex justify-between md:gap-6 gap-2">
          <AdminInput
            id="pricePerDay"
            label="Price per Day ($) *"
            placeholder="e.g., 500"
            registration={register("pricePerDay", {
              required: "Price per day is required",
            })}
            error={errors.pricePerDay}
          />
          <AdminInput
            id="pricePerWeek"
            label="Price per Week ($)"
            placeholder="e.g., 3000"
            registration={register("pricePerWeek", {
              required: "Price per Week is required",
            })}
            error={errors.pricePerWeek}
          />
        </div>
      </div>

      <div className="flex justify-between md:gap-6 gap-2">
        <AdminInput
          id="securityDeposit"
          label="Security Deposit ($) *"
          placeholder="e.g., 1000"
          registration={register("securityDeposit", {
            required: "Security deposit is required",
          })}
          error={errors.securityDeposit}
        />
        <AdminInput
          id="minimumRental"
          label="Minimum Rental (days)"
          placeholder="1 day"
          registration={register("minimumRental", {
            required: "Minimum Rental is required",
          })}
          error={errors.minimumRental}
        />
      </div>
    </div>
  );
}
