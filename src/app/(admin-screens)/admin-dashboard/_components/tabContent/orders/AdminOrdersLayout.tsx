import React from "react";
import DashboardStatsCard from "../../DashboardStatsCard";
import { LuDollarSign } from "react-icons/lu";
import OrdersManagement from "./OrdersManagement";

export default function AdminOrdersLayout() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between flex-col lg:flex-row gap-[17px]">
        <DashboardStatsCard
          trending
          trendingUp
          description="+12.5%"
          icon={LuDollarSign}
          info="$124,500"
          label="Total Revenue"
        />
        <DashboardStatsCard
          trending
          trendingUp
          description="+12.5%"
          icon={LuDollarSign}
          info="$124,500"
          label="Total Revenue"
        />
        <DashboardStatsCard
          trending
          trendingUp
          description="+12.5%"
          icon={LuDollarSign}
          info="$124,500"
          label="Total Revenue"
        />
        <DashboardStatsCard
          trending
          trendingUp
          description="+12.5%"
          icon={LuDollarSign}
          info="$124,500"
          label="Total Revenue"
        />
      </div>
      <OrdersManagement />
    </div>
  );
}
