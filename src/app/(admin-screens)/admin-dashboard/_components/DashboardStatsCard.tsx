import React from "react";
import { IconType } from "react-icons";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

interface DashboardStatsCardProps {
  label: string;
  icon: IconType;
  info: string;
  description: string;
  trendingUp: boolean;
  trending: boolean;
}

export default function DashboardStatsCard({
  label,
  icon: Icon,
  info,
  description,
  trendingUp = false,
  trending,
}: DashboardStatsCardProps) {
  return (
    <div className="rounded-[15.09px] lg:min-h-[165px] h-full flex flex-col justify-between  w-full bg-white border pt-[17px] px-[26px] pb-[26px] border-[#0000001A]">
      <div className="w-full items-center flex justify-between">
        <p className="text-[#0A0A0A] font-normal text-sm sm:text-base">{label}</p>
        {Icon && <Icon className="text-lg sm:text-xl" />}
      </div>
      <div>
        <p className="text-2xl sm:text-[28px] text-[#0A0A0A]  font-normal">{info}</p>
        <div className="flex items-center gap-1">
          {trending &&
            (trendingUp ? (
              <HiArrowTrendingUp className="text-green-600 w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <HiArrowTrendingDown className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
            ))}
          <p className="text-[#717182] font-normal text-[10px] sm:text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
}
