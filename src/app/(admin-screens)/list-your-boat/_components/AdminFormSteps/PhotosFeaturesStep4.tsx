import React, { useState } from "react";
import { FiUpload, FiPlus, FiTrash2, FiPlay } from "react-icons/fi";
import { useFormContext, useFieldArray } from "react-hook-form";
import Image from "next/image";

type PhotosFeaturesStepFields = {
  photos: FileList;
  boatFeatures: string[];
  noApprovalRent: boolean;
  videoUrls: { url: string }[];
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
    control,
    formState: { errors },
  } = useFormContext<PhotosFeaturesStepFields>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "videoUrls",
  });

  const [newVideoUrl, setNewVideoUrl] = useState("");

  const handleAddVideo = () => {
    if (!newVideoUrl) return;
    
    // Basic YouTube URL validation
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.*$/;
    if (!youtubeRegex.test(newVideoUrl)) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    append({ url: newVideoUrl });
    setNewVideoUrl("");
  };

  const getYouTubeThumbnail = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split("?")[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

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
            required: fields.length === 0 ? "Please upload at least one photo or add a video" : false,
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

      {/* YouTube Videos */}
      <div>
        <p className="mb-2 font-medium text-[#0A0A0A]">YouTube Videos</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="Paste YouTube URL here"
            className="flex-1 border border-[#0000001A] rounded-[10px] px-4 py-2 focus:outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleAddVideo}
            className="bg-black text-white px-4 py-2 rounded-[10px] flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* Video List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fields.map((field, index) => {
            const thumbnail = getYouTubeThumbnail(field.url);
            return (
              <div key={field.id} className="relative group rounded-[10px] overflow-hidden border border-[#0000001A]">
                {thumbnail ? (
                  <div className="relative aspect-video">
                    <Image
                      src={thumbnail}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <FiPlay className="text-white text-3xl opacity-80" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <FiPlay className="text-gray-400 text-3xl" />
                  </div>
                )}
                <div className="p-2 flex justify-between items-center bg-white">
                  <p className="text-xs truncate flex-1 mr-2">{field.url}</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
