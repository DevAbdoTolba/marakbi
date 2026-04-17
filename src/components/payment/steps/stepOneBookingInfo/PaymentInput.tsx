import React from "react";

interface PaymentInputProps {
  label: string;
  placeholder: string;
  id?: string;
}

export default function PaymentInput({
  label,
  placeholder,
  id,
}: PaymentInputProps) {
  return (
    <div className="flex flex-col w-full gap-1.5 sm:gap-2">
      <label
        htmlFor={id}
        className="text-xs sm:text-sm md:text-base font-semibold text-[#616161]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="text-[#7D7D7D] px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base rounded-lg bg-[#F7F7F7] outline-none focus:ring-2 focus:ring-[#CEAF6E] transition"
      />
    </div>
  );
}
