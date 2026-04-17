import React from "react";
import { IconType } from "react-icons";

interface AdminDashboardButtonProps {
  label: string;
  onClick: () => void;
  icon?: IconType;
}

export default function AdminDashboardButton({
  label,
  icon: Icon,
  onClick,
}: AdminDashboardButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        border
      border-[#0000001A]
        flex items-center justify-between gap-3
        text-[#0A0A0A] 
        px-3 py-2 rounded-lg
        text-sm sm:text-base
        sm:px-4 sm:py-2
        hover:bg-gray-100 transition
        
      "
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className="text-sm font-medium sm:text-base" />}
        {label}
      </span>
    </button>
  );
}
