import React, { ReactNode } from "react";

interface TripDetailsCellProps {
  children: ReactNode;
  grayBg?: boolean;
}

export default function TripDetailsCell({
  children,
  grayBg = false,
}: TripDetailsCellProps) {
  return (
    <div className={`border-b ${grayBg ? "bg-[#f7f7f7]" : ""} border-[#C0C0C0] p-4`}>
      {children}
    </div>
  );
}
