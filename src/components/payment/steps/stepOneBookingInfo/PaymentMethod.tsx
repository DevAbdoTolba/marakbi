import React, { ReactNode } from "react";

interface PaymentMethodProps {
  label: string;
  imageIcon: ReactNode;
  isChecked?: boolean;
  children: ReactNode;
  onClick: () => void;
}

export default function PaymentMethod({
  label,
  imageIcon,
  isChecked = false,
  children,
  onClick,
}: PaymentMethodProps) {
  return (
    <div
      className={`border px-4 sm:px-6 py-4 sm:py-[13.5px] rounded-lg transition-all duration-200 ${
        isChecked
          ? "border-[#5F9CE5] ring-2 ring-[#5F9CE5]"
          : "border-[#A0A0A0]"
      }`}
    >
      {/* Header (radio + label + icon) */}
      <div
        onClick={onClick}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <input
            type="radio"
            checked={isChecked}
            onChange={onClick}
            className="size-5 sm:size-6 cursor-pointer accent-[#5F9CE5]"
          />
          <label className="text-lg sm:text-[22px] cursor-pointer leading-tight">
            {label}
          </label>
        </div>
        <div className="flex justify-start sm:justify-end">{imageIcon}</div>
      </div>

      {/* Expanded content when selected */}
      {isChecked && (
        <div className="mt-5 sm:mt-7 flex flex-col gap-4 sm:gap-5 w-full">
          {children}
        </div>
      )}
    </div>
  );
}
