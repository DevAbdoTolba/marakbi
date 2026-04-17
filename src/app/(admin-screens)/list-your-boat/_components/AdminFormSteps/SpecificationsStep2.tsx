import AdminInput from "@/app/(admin-screens)/_components/AdminInput";
import React from "react";
import { useFormContext } from "react-hook-form";

type SpecificationsStepFields = {
  numberOfBathrooms: number;
  numberOfCabins: number;
  passengerCapacity: number;
  yearBuilt: number;
  boatLength: number;
};

export default function SpecificationsStep2() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SpecificationsStepFields>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between md:gap-6 gap-2">
        <AdminInput
          id="boatLength"
          label="Length (feet) *"
          placeholder="e.g., 35"
          registration={register("boatLength", {
            required: "Boat length is required",
          })}
          error={errors.boatLength}
        />
        <AdminInput
          id="yearBuilt"
          label="Year Built *"
          placeholder="e.g., 2020"
          registration={register("yearBuilt", {
            required: "Year built is required",
          })}
          error={errors.yearBuilt}
        />
      </div>

      <div className="flex justify-between md:gap-6 gap-2">
        <AdminInput
          id="passengerCapacity"
          label="Passenger Capacity *"
          placeholder="e.g., 8"
          registration={register("passengerCapacity", {
            required: "Passenger capacity is required",
          })}
          error={errors.passengerCapacity}
        />
        <AdminInput
          id="numberOfCabins"
          label="Number of Cabins"
          placeholder="e.g., 2"
          registration={register("numberOfCabins", {
            required: "Number of cabins is required",
          })}
          error={errors.numberOfCabins}
        />
      </div>

      <div className="w-[49%]">
        <AdminInput
          id="numberOfBathrooms"
          label="Number of Bathrooms"
          placeholder="e.g., 1"
          registration={register("numberOfBathrooms", {
            required: "Number of bathrooms is required",
          })}
          error={errors.numberOfBathrooms}
        />
      </div>
    </div>
  );
}
