"use client";
import { useEffect, useState } from "react";
import DashboardStatsCard from "./DashboardStatsCard";
import { LuDollarSign, LuShip, LuCalendar, LuUsers } from "react-icons/lu";
import AdminDashboardNavbar from "./navbar/AdminDashboardNavbar";
import useAdminTab from "../_hooks/useAdminTab";
import AdminOverviewLayout from "./tabContent/overview/AdminOverviewLayout";
import AdminBoatListingLayout from "./tabContent/boatListings/AdminBoatListingLayout";
import AdminTripsLayout from "./tabContent/trips/AdminTripsLayout";
import AdminBookingsLayout from "./tabContent/bookings/AdminBookingsLayout";
import AdminUsersLayout from "./tabContent/users/AdminUsersLayout";
import AdminCitiesLayout from "./tabContent/cities/AdminCitiesLayout";
import AdminReviewsLayout from "./tabContent/reviews/AdminReviewsLayout";
import AdminVoyagesLayout from "./tabContent/voyages/AdminVoyagesLayout";
import AdminCategoriesLayout from "./tabContent/categories/AdminCategoriesLayout";
import { adminApi, AdminStats } from "@/lib/api";

export default function AdminDashboardLayout() {
  const { currentTab } = useAdminTab();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const response = await adminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="px-[30px] py-[65px]">
      <div className="bg-[#ECECF04D] p-[26px] flex flex-col gap-[26px]">
        <div className="flex justify-between flex-col lg:flex-row gap-[17px]">
          <DashboardStatsCard
            trending
            trendingUp={stats ? stats.monthly_revenue > 0 : true}
            description={stats ? `${formatCurrency(stats.monthly_revenue)} this month` : "Loading..."}
            icon={LuDollarSign}
            info={loading ? "..." : formatCurrency(stats?.total_revenue || 0)}
            label="Total Revenue"
          />
          <DashboardStatsCard
            trending
            trendingUp={stats ? stats.new_boats_this_month > 0 : true}
            description={stats ? `+${stats.new_boats_this_month} this month` : "Loading..."}
            icon={LuShip}
            info={loading ? "..." : String(stats?.total_boats || 0)}
            label="Active Boats"
          />
          <DashboardStatsCard
            trending
            trendingUp={stats ? stats.new_bookings_this_month > 0 : true}
            description={stats ? `+${stats.new_bookings_this_month} this month` : "Loading..."}
            icon={LuCalendar}
            info={loading ? "..." : String(stats?.total_bookings || 0)}
            label="Total Bookings"
          />
          <DashboardStatsCard
            trending
            trendingUp={stats ? stats.new_users_this_month > 0 : true}
            description={stats ? `+${stats.new_users_this_month} this month` : "Loading..."}
            icon={LuUsers}
            info={loading ? "..." : String(stats?.total_users || 0)}
            label="Registered Users"
          />
        </div>
        <AdminDashboardNavbar />
        <div>
          {currentTab === "overview" && <AdminOverviewLayout stats={stats} />}
          {currentTab === "boat-listings" && <AdminBoatListingLayout />}
          {currentTab === "trips" && <AdminTripsLayout />}
          {currentTab === "bookings" && <AdminBookingsLayout />}
          {currentTab === "users" && <AdminUsersLayout />}
          {currentTab === "cities" && <AdminCitiesLayout />}
          {currentTab === "reviews" && <AdminReviewsLayout />}
          {currentTab === "voyages" && <AdminVoyagesLayout />}
          {currentTab === "categories" && <AdminCategoriesLayout />}
        </div>
      </div>
    </div>
  );
}
