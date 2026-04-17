import React, { ReactNode } from "react";

interface AdminFormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AdminFormContainer({
  title,
  subtitle,
  children,
}: AdminFormContainerProps) {
  return (
    <div className="rounded-[14px] w-full p-6 border border-[#0000001A] bg-white">
      <div className="text-base text-[#0A0A0A] mb-1.5 font-medium">
        {title}
      </div>
      <div className="text-[#717182] mb-6 text-base font-normal">
        {subtitle}
      </div>
      {children}
    </div>
  );
}
