import React from "react";

interface AdminButtonProps {
  label: string;
  onClick: () => void;
  variant: "primary" | "outline";
  type: "submit" | "reset" | "button" | undefined;
}

export default function AdminButton({
  label,
  onClick,
  variant,
  type,
}: AdminButtonProps) {
  const buttonStyle =
    (variant === "primary" && " bg-[#0C4C99] text-white") ||
    (variant === "outline" &&
      " bg-white text-[#0A0A0A] border-[#0000001A] border");
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        buttonStyle +
        " text-sm py-[11px] px-[41px] rounded-lg font-medium"
      }
    >
      {label}
    </button>
  );
}
