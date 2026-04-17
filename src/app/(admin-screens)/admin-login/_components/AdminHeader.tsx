import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

interface AdminHeaderProps {
  listing?: boolean;
}

export default function AdminHeader({ listing }: AdminHeaderProps) {
  return (
    <header className="bg-white gap-4 md:py-6 py-3 flex flex-col items-center justify-center flex-shrink-0">
      <Link
        href={"/"}
        className="flex gap-4 w-[33%] h-fit items-center"
      >
        <FaArrowLeft size={16} />
        <span className="font-medium text-xs sm:text-sm md:text-base">
          Back to Home
        </span>
      </Link>

      <div>
        {listing && (
          <div className="flex flex-col gap-2">
            <p className="font-medium  md:text-2xl sm:text-xl text-lg text-[#0A0A0A]">
              List Your Boat
            </p>
            <p className="md:text-base sm:text-sm text-xs font-normal text-[#717182]">
              Share your boat with thousands of renters and start earning today
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
