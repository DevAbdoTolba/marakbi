"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface AdminInputProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: IconType;
  password?: boolean;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
}

export default function AdminInput({
  id,
  label,
  placeholder,
  icon: Icon,
  password,
  registration,
  error,
}: AdminInputProps) {
  const [showPassword, setShowPassword] = useState(false);

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

        <input
          id={id}
          placeholder={placeholder}
          type={password ? (showPassword ? "text" : "password") : "text"}
          {...registration} // 👈 connect input to react-hook-form
          className={`w-full py-[13px] px-10 text-gray-800 placeholder-gray-400 text-sm sm:text-base bg-transparent outline-none ${
            Icon ? "pl-10" : "pl-4"
          }`}
        />

        {password &&
          (showPassword ? (
            <MdOutlineRemoveRedEye
              onClick={() => setShowPassword(!showPassword)}
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            />
          ) : (
            <MdOutlineVisibilityOff
              onClick={() => setShowPassword(!showPassword)}
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            />
          ))}
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
