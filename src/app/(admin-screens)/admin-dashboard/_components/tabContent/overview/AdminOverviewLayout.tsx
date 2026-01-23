"use client";
import React from "react";
import { AdminStats } from "@/lib/api";
import useAdminTab from "../../../_hooks/useAdminTab";

interface AdminOverviewLayoutProps {
  stats: AdminStats | null;
}

export default function AdminOverviewLayout({ stats }: AdminOverviewLayoutProps) {
  const { setTab } = useAdminTab();

  return (
    <div className="flex flex-col gap-6">
      {/* Order Status Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 cursor-pointer transition" onClick={() => setTab("bookings")}>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-medium">{stats?.pending_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition" onClick={() => setTab("bookings")}>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-lg font-medium">{stats?.confirmed_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 cursor-pointer transition" onClick={() => setTab("bookings")}>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-lg font-medium">{stats?.cancelled_orders || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition" onClick={() => setTab("bookings")}>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-medium">{stats?.completed_orders || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setTab("bookings")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-blue-700"
          >
            <span className="text-2xl">📋</span>
            <span className="text-sm font-medium">View Bookings</span>
          </button>
          <button
            onClick={() => setTab("boat-listings")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition text-green-700"
          >
            <span className="text-2xl">🚤</span>
            <span className="text-sm font-medium">Manage Boats</span>
          </button>
          <button
            onClick={() => setTab("trips")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition text-purple-700"
          >
            <span className="text-2xl">🏝️</span>
            <span className="text-sm font-medium">Manage Trips</span>
          </button>
          <button
            onClick={() => setTab("users")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition text-orange-700"
          >
            <span className="text-2xl">👥</span>
            <span className="text-sm font-medium">View Users</span>
          </button>
        </div>
      </div>

      {/* Fleet & Content Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet & Content Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            onClick={() => setTab("boat-listings")}
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-blue-600">{stats?.total_boats || 0}</p>
            <p className="text-sm text-blue-700 mt-1 font-medium">Boats</p>
          </div>
          <div
            onClick={() => setTab("trips")}
            className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-purple-600">{stats?.total_trips || 0}</p>
            <p className="text-sm text-purple-700 mt-1 font-medium">Trips</p>
          </div>

          <div
            onClick={() => setTab("categories")}
            className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-teal-600">{stats?.total_categories || 0}</p>
            <p className="text-sm text-teal-700 mt-1 font-medium">Categories</p>
          </div>
          <div
            onClick={() => setTab("cities")}
            className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-orange-600">{stats?.total_cities || 0}</p>
            <p className="text-sm text-orange-700 mt-1 font-medium">Cities</p>
          </div>
          <div
            onClick={() => setTab("reviews")}
            className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl cursor-pointer hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-yellow-600">{stats?.total_reviews || 0}</p>
            <p className="text-sm text-yellow-700 mt-1 font-medium">Reviews</p>
          </div>
        </div>
      </div>

      {/* This Month Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">This Month</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">+{stats?.new_bookings_this_month || 0}</p>
            <p className="text-sm text-gray-500 mt-1">New Bookings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">+{stats?.new_boats_this_month || 0}</p>
            <p className="text-sm text-gray-500 mt-1">New Boats</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">+{stats?.new_users_this_month || 0}</p>
            <p className="text-sm text-gray-500 mt-1">New Users</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{stats?.active_rentals || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active Rentals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

