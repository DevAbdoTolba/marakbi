"use client";
import { IconType } from "react-icons";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";

interface AdminTextAreaProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: IconType;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
  maxLength: number;
}

export default function AdminTextArea({
  id,
  label,
  placeholder,
  icon: Icon,
  registration,
  error,
  maxLength,
}: AdminTextAreaProps) {
  const [text, setText] = useState<string>();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="font-medium text-gray-700 text-sm sm:text-base"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div
        className={`relative bg-[#F3F3F5] rounded-lg border overflow-hidden transition-colors ${
          error
            ? "border-red-500"
            : "border-transparent focus-within:border-black"
        }`}
      >
        {Icon && (
          <Icon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        )}

        <textarea
          maxLength={maxLength}
          onChange={(e) => setText(e.target.value)}
          id={id}
          placeholder={placeholder}
          {...registration} // 👈 connect input to react-hook-form
          className={`w-full py-[13px] px-10 text-gray-800 placeholder-gray-400 text-sm sm:text-base bg-transparent outline-none ${
            Icon ? "pl-10" : "pl-4"
          }`}
        />
      </div>
      <div className="flex mt-2 justify-between">
        <p className="text-[#717182] text-sm sm:text-base">
          {text?.length || 0}/{maxLength} Characters
        </p>
        {/* Error message */}
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
