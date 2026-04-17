import React from "react";
import { FiUpload } from "react-icons/fi";
import { useFormContext } from "react-hook-form";

type PhotosFeaturesStepFields = {
  photos: FileList;
  boatFeatures: string[];
  noApprovalRent: boolean;
};

export default function PhotosFeaturesStep4() {
  const boatFeatures = [
    "GPS Navigation",
    "Fishing Equipment",
    "Water Sports Equipment",
    "Kitchen/Galley",
    "Air Conditioning",
    "Heating",
    "WiFi",
    "Sound System",
    "BBQ Grill",
    "Snorkeling Gear",
    "Life Jackets",
    "Anchor",
    "Swim Platform",
    "Shower",
    "Refrigerator",
  ];

  const {
    register,
    formState: { errors },
  } = useFormContext<PhotosFeaturesStepFields>();

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Photos */}
      <div>
        <p className="mb-2 font-medium text-[#0A0A0A]">Upload Photos *</p>
        <input
          type="file"
          id="photos"
          className="hidden"
          multiple
          {...register("photos", {
            required: "Please upload at least one photo",
          })}
        />
        <label
          htmlFor="photos"
          className={`border-2 p-[34px] border-[#0000001A] flex flex-col gap-4 items-center justify-center rounded-[10px] cursor-pointer hover:border-black ${
            errors.photos ? "border-red-500" : ""
          }`}
        >
          <FiUpload color="#717182" size={48} />
          <p className="text-base text-[#0A0A0A] font-normal">
            Click to upload photos
          </p>
          <p className="text-[#717182] text-base font-normal">
            PNG, JPG up to 10MB (max 10 photos)
          </p>
        </label>
        {errors.photos && (
          <p className="text-red-500 text-sm mt-1">{errors.photos.message}</p>
        )}
      </div>

      <div className="my-6 h-[1px] w-full bg-[#0000001A]" />

      {/* Boat Features */}
      <div>
        <p className="text-[#0A0A0A] mb-6 sm:text-base text-sm font-medium">
          Boat Features & Amenities
        </p>
        <div className="flex flex-wrap md:flex-row flex-col justify-between gap-4">
          {boatFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex gap-2 md:w-1/4 items-center text-[#0A0A0A] mb-4 sm:text-base text-sm"
            >
              <input
                {...register("boatFeatures")}
                name="boatFeatures"
                value={feature}
                id={feature}
                type="checkbox"
                className="w-4 h-4 border border-[#0000001A] rounded bg-[#F3F3F5] checked:bg-black checked:border-black cursor-pointer"
              />
              <label htmlFor={feature} className="cursor-pointer">
                {feature}
              </label>
            </div>
          ))}
        </div>
        {errors.boatFeatures && (
          <p className="text-red-500 text-sm mt-1">
            {errors.boatFeatures.message}
          </p>
        )}
      </div>

      <div className="my-6 h-[1px] w-full bg-[#0000001A]" />

      {/* Instant Booking */}
      <div className="flex gap-2 items-center text-[#0A0A0A] sm:text-base text-sm">
        <input
          {...register("noApprovalRent")}
          value="noApprovalRent"
          id="noApprovalRent"
          type="checkbox"
          className="w-4 h-4 border border-[#0000001A] rounded bg-[#F3F3F5] checked:bg-black checked:border-black cursor-pointer"
        />
        <label htmlFor="noApprovalRent" className="cursor-pointer">
          Enable instant booking (renters can book without approval)
        </label>
      </div>
    </div>
  );
}
