"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value = "", onChange, placeholder }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [localValue, onChange, value]);

  return (
    <div className="bg-[#F3F3F5] flex items-center gap-2 px-3 py-2 rounded-lg w-full">
      <CiSearch className="text-[#717182] text-lg" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || "Search by order #, customer, or boat..."}
        className="bg-transparent outline-none text-sm flex-1"
      />
    </div>
  );
}
