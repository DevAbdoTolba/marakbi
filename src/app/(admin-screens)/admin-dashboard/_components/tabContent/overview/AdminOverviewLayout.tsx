"use client";
import React from "react";
import DashboardStatsCard from "../../DashboardStatsCard";
import { LuDollarSign, LuClock, LuShip } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { AdminStats } from "@/lib/api";

interface AdminOverviewLayoutProps {
  stats: AdminStats | null;
}

export default function AdminOverviewLayout({ stats }: AdminOverviewLayoutProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards Row */}
      <div className="flex justify-between flex-col lg:flex-row gap-[17px]">
        <DashboardStatsCard
          trending={false}
          trendingUp={false}
          description="From paid orders"
          icon={LuDollarSign}
          info={formatCurrency(stats?.total_revenue || 0)}
          label="Total Revenue"
        />
        <DashboardStatsCard
          trending={false}
          trendingUp={false}
          description="Awaiting confirmation"
          icon={LuClock}
          info={String(stats?.pending_orders || 0)}
          label="Pending Orders"
        />
        <DashboardStatsCard
          trending={false}
          trendingUp={false}
          description="Currently ongoing"
          icon={LuShip}
          info={String(stats?.active_rentals || 0)}
          label="Active Rentals"
        />
        <DashboardStatsCard
          trending={false}
          trendingUp={false}
          description="Successfully finished"
          icon={FiCheckCircle}
          info={String(stats?.completed_orders || 0)}
          label="Completed"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Bookings</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.total_bookings || 0}</p>
          <p className="text-xs text-green-600 mt-1">+{stats?.new_bookings_this_month || 0} this month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Active Boats</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.total_boats || 0}</p>
          <p className="text-xs text-green-600 mt-1">+{stats?.new_boats_this_month || 0} this month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Registered Users</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.total_users || 0}</p>
          <p className="text-xs text-green-600 mt-1">+{stats?.new_users_this_month || 0} this month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Monthly Revenue</h3>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats?.monthly_revenue || 0)}</p>
          <p className="text-xs text-gray-500 mt-1">Current month</p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-medium">{stats?.pending_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-lg font-medium">{stats?.confirmed_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-lg font-medium">{stats?.cancelled_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-medium">{stats?.completed_orders || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
