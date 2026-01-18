"use client";
import React from "react";

interface FilterComponentProps {
  selectItems: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function FilterComponent({ selectItems, value, onChange }: FilterComponentProps) {
  return (
    <div className="flex flex-col gap-1">
      <select
        value={value || selectItems[0]}
        onChange={(e) => onChange?.(e.target.value)}
        className="
          bg-[#F3F3F5] 
          px-3 py-2 
          rounded-lg 
          text-sm 
          outline-none
          cursor-pointer
          min-w-[140px]
        "
      >
        {selectItems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
