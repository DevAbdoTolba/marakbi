"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { customerApi, Order } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { FiClock, FiCalendar, FiMapPin, FiAnchor, FiChevronLeft, FiChevronRight, FiPackage } from "react-icons/fi";

interface BookingCardProps {
  order: Order;
}

function BookingCard({ order }: BookingCardProps) {
  const router = useRouter();

  // Safety check - return null if boat is not available
  if (!order.boat) {
    return null;
  }

  // Calculate duration
  const startDate = new Date(order.start_date);
  const endDate = new Date(order.end_date);
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationDays = Math.floor(durationHours / 24);
  const remainingHours = durationHours % 24;

  const durationText = durationDays > 0
    ? `${durationDays} Day${durationDays > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} Hr${remainingHours > 1 ? 's' : ''}` : ''}`
    : `${durationHours} Hour${durationHours !== 1 ? 's' : ''}`;

  // Format date
  const dayOfMonth = startDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'short' });
  const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'short' });
  const time = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Status colors
  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-green-50 text-green-700 border-green-200",
  };

  const status = order.status || 'pending';
  const statusClass = statusColors[status as keyof typeof statusColors] || statusColors.pending;

  // Booking Type Badge
  const getBookingTypeLabel = () => {
    if (order.trip_id) return "Trip";
    if (order.booking_type === 'daily') return "Daily Rental";
    return "Hourly Rental";
  };

  return (
    <div
      onClick={() => router.push(`/my-bookings/${order.id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={normalizeImageUrl(order.trip?.images?.[0] || order.boat.images?.[0] || null)}
          alt={order.trip?.name || order.boat.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusClass} backdrop-blur-sm`}>
          {status}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-black/60 text-white backdrop-blur-md border border-white/10">
          {getBookingTypeLabel()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 gap-4">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#106BD8] transition-colors">
            {order.trip?.name || order.boat.name}
          </h3>
          <span className="font-bold text-[#106BD8] whitespace-nowrap">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(order.total_price)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiAnchor className="text-gray-400" />
            <span>{durationText}</span>          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-gray-400" />
            <span className="truncate">{order.trip?.city_name || order.boat.cities?.[0] || 'Marina'}</span>
          </div>
          {order.selected_services && order.selected_services.length > 0 && (
            <div className="flex items-center gap-2 col-span-2">
              <FiPackage className="text-gray-400" />
              <span className="truncate text-gray-500">
                {order.selected_services.length} add-on{order.selected_services.length > 1 ? 's' : ''}
                {order.services_total ? ` · ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(order.services_total)}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Order #{order.id}
          </span>
          <div className="flex items-center gap-3">
            {order.boat?.location_url && (
              /* Location link removed as per request */
              null
            )}
            <span className="text-sm font-medium text-[#106BD8] group-hover:translate-x-1 transition-transform flex items-center gap-1">
              View Details <FiChevronRight />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"ongoing" | "past">("ongoing");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync state with URL params if needed in future

  useEffect(() => {
    fetchOrders(page, activeTab);
  }, [page, activeTab]);

  const fetchOrders = async (pageNum: number, status: 'ongoing' | 'past') => {
    try {
      setLoading(true);
      const response = await customerApi.getOrders(pageNum, 9, status); // 9 items per page for grid
      if (response.success && response.data) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on activeTab

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500">Manage and view your upcoming and past trips.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-1.5 inline-flex mb-8 shadow-sm border border-gray-100">
          <button
            onClick={() => {
              setActiveTab("ongoing");
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "ongoing"
              ? "bg-[#106BD8] text-white shadow-md"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            Ongoing Bookings
          </button>
          <button
            onClick={() => {
              setActiveTab("past");
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "past"
              ? "bg-[#106BD8] text-white shadow-md"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            History
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106BD8]"></div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {orders.map((order) => (
                  <BookingCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No {activeTab} bookings</h3>
                <p className="text-gray-500">You don&apos;t have any {activeTab} bookings at the moment.</p>
                {activeTab === 'ongoing' && (
                  <button
                    onClick={() => router.push('/search')}
                    className="mt-6 px-6 py-2.5 bg-[#106BD8] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                  >
                    Explore Boats
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 hover:text-[#106BD8]"
                >
                  <FiChevronLeft size={20} />
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page <span className="text-[#106BD8] font-bold">{page}</span> of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 hover:text-[#106BD8]"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

