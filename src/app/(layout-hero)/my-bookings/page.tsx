"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { customerApi, Order } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface BookingCardProps {
  order: Order;
}

function BookingCard({ order }: BookingCardProps) {
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
    ? `${durationDays} Day${durationDays > 1 ? 's' : ''} ${remainingHours} Hour${remainingHours !== 1 ? 's' : ''}`
    : `${durationHours} Hour${durationHours !== 1 ? 's' : ''}`;

  // Format date
  const dayOfMonth = startDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'short' });
  const dayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'short' });
  const time = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Get price per hour/day
  const priceDisplay = order.booking_type === 'hourly' || order.booking_type === 'trip'
    ? `${order.boat.price_per_hour} EGP/hour`
    : `${order.boat.price_per_day || order.boat.price_per_hour} EGP/day`;

  return (
    <div className="relative bg-white rounded-lg overflow-hidden w-[427px] h-[394px]" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.1)" }}>
      {/* Boat Image */}
      <div className="relative w-full h-[240px] rounded-t-[10px] overflow-hidden">
        <Image
          src={normalizeImageUrl(order.boat.images?.[0] || null)}
          alt={order.boat.name}
          fill
          className="object-cover"
        />
        {/* Image count badge */}
        <div className="absolute bottom-[38px] right-[12px] h-8 rounded-md px-2 py-1 flex items-center gap-1" style={{ backgroundColor: "rgba(34, 33, 33, 0.07)", backdropFilter: "blur(2px)" }}>
          <Image
            src="/icons/photo_library_24px.svg"
            alt="Image Count"
            width={24}
            height={24}
          />
          <span className="text-white text-sm font-medium">
            1/1
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 pt-4 pb-2 relative h-[154px]">
        {/* Left Side - Boat Details */}
        <div className="flex flex-col gap-3 w-[280px]">
          <h3 className="text-lg font-medium text-black font-poppins tracking-[0.38px] leading-6">
            {order.boat.name}
          </h3>

          <div className="flex flex-col gap-1.5">
            {/* Passengers */}
            <div className="flex items-center gap-[3px]">
              <Image
                src="/icons/people-svgrepo-com (1) 2.svg"
                alt="Passengers"
                width={24}
                height={24}
              />
              <span className="text-sm text-[#989898] capitalize font-inter font-normal">
                {order.guest_count} Passenger{order.guest_count > 1 ? 's' : ''}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-[3px]">
              <span className="text-sm text-[#989898] capitalize font-inter font-normal">
                {durationText}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-[3px]">
              <span className="text-sm text-[#106BD8] capitalize font-inter font-medium">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Date and Price */}
        <div className="absolute right-2 top-4 flex flex-col items-end gap-1 w-[92px]">
          {/* Date Card */}
          <div className="bg-white rounded-lg p-1 flex flex-col items-center justify-center w-full h-[84px]" style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.35)" }}>
            <div className="text-center flex flex-col items-center gap-1">
              <p className="text-[40px] font-bold text-[#106BD8] leading-[0.78] font-poppins">
                {dayOfMonth}
              </p>
              <p className="text-sm font-normal font-poppins leading-5">
                <span className="text-[#106BD8]">{dayOfWeek}</span>
                <span className="text-[#8A8A8F]"> {month}</span>
              </p>
            </div>
            <p className="text-sm text-[#989898] capitalize font-inter font-normal">
              {time}
            </p>
          </div>

          {/* Price */}
          <p className="text-sm font-medium text-[#106BD8] font-inter tracking-[0.38px] leading-6">
            {priceDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "past">("ongoing");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await customerApi.getOrders();
        if (response.success && response.data) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on activeTab
  // Ongoing: end_date is in the future AND status is not cancelled
  // Past: end_date is in the past OR status is cancelled or completed
  const filteredOrders = orders.filter((order) => {
    const endDate = new Date(order.end_date);
    const now = new Date();
    
    // Check if booking has ended
    const hasEnded = endDate < now;
    
    // Check if booking is cancelled or completed
    const isCancelledOrCompleted = order.status === 'cancelled' || order.status === 'completed';
    
    if (activeTab === "ongoing") {
      // Ongoing: hasn't ended yet AND not cancelled/completed
      return !hasEnded && !isCancelledOrCompleted;
    } else {
      // Past: has ended OR cancelled/completed
      return hasEnded || isCancelledOrCompleted;
    }
  });

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Tabs */}
        <div className="flex items-center">
          {/* Ongoing Bookings Tab */}
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex items-center gap-2 px-[30px] py-3 transition-all ${activeTab === "ongoing"
              ? "border-b-4 border-[#106BD8]"
              : "border-b-0"
              }`}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 11.3333V6.66667C28 5.2 26.8 4 25.3333 4H6.66667C5.2 4 4 5.2 4 6.66667V11.3333C5.46667 11.3333 6.66667 12.5333 6.66667 14C6.66667 15.4667 5.46667 16.6667 4 16.6667V21.3333C4 22.8 5.2 24 6.66667 24H25.3333C26.8 24 28 22.8 28 21.3333V16.6667C26.5333 16.6667 25.3333 15.4667 25.3333 14C25.3333 12.5333 26.5333 11.3333 28 11.3333Z"
                stroke={activeTab === "ongoing" ? "#106BD8" : "#8C8C8C"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`text-2xl font-medium font-barlow leading-6 tracking-[-0.4084px] ${activeTab === "ongoing" ? "text-[#106BD8]" : "text-[#8C8C8C]"
                }`}
            >
              Ongoing Bookings
            </span>
          </button>

          {/* Past Booking Tab */}
          <button
            onClick={() => setActiveTab("past")}
            className={`flex items-center justify-center gap-2 pl-10 pr-9 py-3 transition-all ${activeTab === "past"
              ? "border-b-4 border-[#106BD8]"
              : "border-b-0"
              }`}
          >
            <Image
              src="/icons/gift2.svg"
              alt="Past Booking"
              width={32}
              height={32}
            />
            <span
              className={`text-center justify-start text-2xl font-medium font-barlow leading-6 ${activeTab === "past" ? "text-blue-600" : "text-[#8C8C8C]"
                }`}
            >
              Past Booking
            </span>
          </button>
        </div>
      </div>

      {/* Horizontal line separator - Full width */}
      <div className="w-full h-px bg-gray-900 mb-[52px]"></div>

      <div className="max-w-[1440px] mx-auto px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-900"></div>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && (
          <div className="flex flex-wrap gap-4">
            {filteredOrders.map((order) => (
              <BookingCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 font-poppins">
              No {activeTab} bookings found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
