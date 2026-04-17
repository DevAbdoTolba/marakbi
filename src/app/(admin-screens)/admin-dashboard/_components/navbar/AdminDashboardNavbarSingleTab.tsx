import React from "react";

interface AdminDashboardNavbarSingleTabProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export default function AdminDashboardNavbarSingleTab({
  label,
  isActive = false,
  onClick,
}: AdminDashboardNavbarSingleTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap 
        inline-flex items-center justify-center
        rounded-2xl 
        transition-all 
        font-medium 
        cursor-pointer
        
        ${
          isActive
            ? "bg-white text-[#0A0A0A] shadow-sm"
            : "bg-transparent text-[#4B4B4B] hover:bg-white/60"
        }

        px-4 py-2 text-sm     /* mobile styles */
        sm:px-6 sm:py-2 sm:text-base   /* tablet */
        lg:px-8 lg:py-2 lg:text-base   /* desktop */
      `}
    >
      {label}
    </button>
  );
}
