"use client";
import { IconType } from "react-icons";

interface FilterButtonProps {
  icon?: IconType;
  label: string;
  onClick: () => void;
}

export default function FilterButton({
  icon: Icon,
  label,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center border-[#A0A0A0] text-gray-800 hover:bg-gray-100 gap-2 px-4 sm:px-6 py-2 border rounded-md text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0`}
    >
      {Icon && <Icon size={18} />}
      <span className="truncate">{label}</span>
    </button>
  );
}
