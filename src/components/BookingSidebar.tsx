"use client";

import { useState } from "react";
import Image from "next/image";

interface BookingSidebarProps {
    boatId: number;
    boatName: string;
    pricePerHour: number;
    pricePerDay?: number;
    maxGuests: number;
    onBookingRequest: (bookingData: BookingData) => void;
}

export interface BookingData {
    boat_id: number;
    boat_name: string;
    guest_count: number;
    rental_type: "hourly" | "daily";
    hours?: number;
    start_date: string;
    end_date: string;
    days?: number;
    base_price: number;
    service_fee: number;
    total_price: number;
}

type RentalType = "hour" | "day" | "week";

export default function BookingSidebar({
    boatId,
    boatName,
    pricePerHour,
    pricePerDay,
    maxGuests,
    onBookingRequest,
}: BookingSidebarProps) {
    const [rentalType, setRentalType] = useState<RentalType>("hour");
    const [guestCount, setGuestCount] = useState(2);
    const [hours, setHours] = useState(1);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Calculate price
    const calculatePrice = () => {
        let basePrice = 0;
        let days = 0;

        if (rentalType === "hour") {
            basePrice = pricePerHour * hours;
        } else if (rentalType === "day" || rentalType === "week") {
            if (selectedDates.length === 2) {
                const start = selectedDates[0];
                const end = selectedDates[1];
                days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const effectivePrice = pricePerDay || pricePerHour * 8;
                basePrice = effectivePrice * days;
            }
        }

        const total = basePrice;

        return { basePrice, total, days };
    };

    const { basePrice, total, days } = calculatePrice();

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(year, month, day);

        if (rentalType === "hour") {
            // Single date selection for hourly
            setSelectedDates([clickedDate]);
        } else {
            // Range selection for daily/weekly
            if (selectedDates.length === 0 || selectedDates.length === 2) {
                setSelectedDates([clickedDate]);
            } else if (selectedDates.length === 1) {
                const start = selectedDates[0];
                if (clickedDate < start) {
                    setSelectedDates([clickedDate, start]);
                } else {
                    setSelectedDates([start, clickedDate]);
                }
            }
        }
    };

    const isDateSelected = (day: number) => {
        return selectedDates.some(
            (selectedDate) =>
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year
        );
    };

    const isDateInRange = (day: number) => {
        if (selectedDates.length !== 2) return false;
        const date = new Date(year, month, day);
        const [start, end] = selectedDates;
        return date >= start && date <= end;
    };

    const handleRequestToBook = () => {
        if (selectedDates.length === 0) {
            alert("Please select a date");
            return;
        }

        // Check if user is authenticated
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (!accessToken) {
            // User not logged in - save booking data and redirect to login
            const bookingData: BookingData = {
                boat_id: boatId,
                boat_name: boatName,
                guest_count: guestCount,
                rental_type: rentalType === "hour" ? "hourly" : "daily",
                hours: rentalType === "hour" ? hours : undefined,
                start_date: selectedDates[0].toISOString(),
                end_date: (selectedDates[1] || selectedDates[0]).toISOString(),
                days: days > 0 ? days : undefined,
                base_price: basePrice,
                service_fee: 0,
                total_price: total,
            };

            // Save booking data to localStorage
            localStorage.setItem('pending_booking_data', JSON.stringify(bookingData));
            // Save intended URL to return to after login
            localStorage.setItem('intended_url', '/payment');
            // Redirect to login
            window.location.href = '/login';
            return;
        }

        // User is authenticated - proceed with booking
        const bookingData: BookingData = {
            boat_id: boatId,
            boat_name: boatName,
            guest_count: guestCount,
            rental_type: rentalType === "hour" ? "hourly" : "daily",
            hours: rentalType === "hour" ? hours : undefined,
            start_date: selectedDates[0].toISOString(),
            end_date: (selectedDates[1] || selectedDates[0]).toISOString(),
            days: days > 0 ? days : undefined,
            base_price: basePrice,
            service_fee: 0,
            total_price: total,
        };

        onBookingRequest(bookingData);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const effectivePrice = rentalType === "hour"
        ? pricePerHour
        : (pricePerDay || pricePerHour * 8);

    return (
        <div className="bg-white rounded-lg border border-stone-300 p-4 shadow-lg">
            {/* Rental Type Tabs */}
            <div className="flex justify-start items-center gap-2 mb-6">
                <button
                    onClick={() => {
                        setRentalType("hour");
                        setSelectedDates([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-normal font-poppins transition-colors ${rentalType === "hour"
                        ? "bg-[#0F3875] text-white"
                        : "border border-zinc-400 text-zinc-500 hover:bg-gray-50"
                        }`}
                >
                    Per Hour
                </button>
                <button
                    onClick={() => {
                        setRentalType("day");
                        setSelectedDates([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-normal font-poppins transition-colors ${rentalType === "day"
                        ? "bg-[#0F3875] text-white"
                        : "border border-zinc-400 text-zinc-500 hover:bg-gray-50"
                        }`}
                >
                    Per Day
                </button>
                <button
                    onClick={() => {
                        setRentalType("week");
                        setSelectedDates([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-normal font-poppins transition-colors ${rentalType === "week"
                        ? "bg-[#0F3875] text-white"
                        : "border border-zinc-400 text-zinc-500 hover:bg-gray-50"
                        }`}
                >
                    Per Week
                </button>
            </div>

            {/* Pricing Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-black text-2xl font-medium font-poppins">Pricing</h3>
                <div>
                    <span className="text-blue-700 text-2xl font-medium font-poppins">
                        {effectivePrice}
                    </span>
                    <span className="text-black text-base font-medium font-poppins">
                        {" "}EGP/
                        {rentalType === "hour" ? "Hour" : rentalType === "day" ? "Day" : "Week"}
                    </span>
                </div>
            </div>

            {/* Calendar */}
            <div className="flex flex-col gap-4 mb-6">
                {/* Month Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentMonth(new Date(year, month - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                    >
                        <span className="text-xl">&lt;</span>
                    </button>
                    <h4 className="text-zinc-900 text-sm font-semibold font-poppins">
                        {monthNames[month]} {year}
                    </h4>
                    <button
                        onClick={() => setCurrentMonth(new Date(year, month + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                    >
                        <span className="text-xl">&gt;</span>
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                        <div
                            key={day}
                            className="text-center text-gray-500 text-sm font-medium font-poppins p-1"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const selected = isDateSelected(day);
                        const inRange = isDateInRange(day);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`p-2 rounded text-sm font-medium font-poppins transition-colors ${selected
                                    ? "bg-blue-700 text-white"
                                    : inRange
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-zinc-900 hover:bg-gray-100"
                                    }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Number of Hours (only for hourly) */}
            {rentalType === "hour" && (
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.33" />
                            <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" />
                        </svg>
                        <label className="text-gray-500 text-base font-normal font-poppins">
                            Number of hours
                        </label>
                    </div>
                    <div className="h-14 px-3 rounded-[10px] border border-black/10 flex justify-between items-center">
                        <button
                            onClick={() => setHours(Math.max(1, hours - 1))}
                            className="w-8 h-8 flex justify-center items-center text-neutral-950 text-xl font-medium"
                        >
                            -
                        </button>
                        <span className="text-neutral-950 text-base font-normal font-poppins">
                            {hours}
                        </span>
                        <button
                            onClick={() => setHours(Math.min(24, hours + 1))}
                            className="w-8 h-8 flex justify-center items-center text-neutral-950 text-xl font-medium"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            {/* Number of Guests */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
                        <path
                            d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                            stroke="currentColor"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M13.5 14C13.5 11.5147 11.0899 9.5 8 9.5C4.91015 9.5 2.5 11.5147 2.5 14"
                            stroke="currentColor"
                            strokeWidth="1.33"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <label className="text-gray-500 text-base font-normal font-poppins">
                        Number of guests
                    </label>
                </div>
                <div className="h-14 px-3 rounded-[10px] border border-black/10 flex justify-between items-center">
                    <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-8 h-8 flex justify-center items-center text-neutral-950 text-xl font-medium"
                    >
                        -
                    </button>
                    <span className="text-neutral-950 text-base font-normal font-poppins">
                        {guestCount}
                    </span>
                    <button
                        onClick={() => setGuestCount(Math.min(maxGuests, guestCount + 1))}
                        className="w-8 h-8 flex justify-center items-center text-neutral-950 text-xl font-medium"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between items-start">
                    <span className="text-gray-500 text-base font-normal font-poppins">
                        E£ {effectivePrice} × {rentalType === "hour" ? `${hours} hour${hours > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''}`}
                    </span>
                    <span className="text-neutral-950 text-base font-normal font-poppins">
                        E£ {basePrice.toFixed(0)}
                    </span>
                </div>
                <div className="h-px bg-black/10"></div>
                <div className="flex justify-between items-start">
                    <span className="text-neutral-950 text-base font-medium font-poppins">
                        Total
                    </span>
                    <span className="text-neutral-950 text-base font-medium font-poppins">
                        E£ {total.toFixed(0)}
                    </span>
                </div>
            </div>

            {/* Request to Book Button */}
            <button
                onClick={handleRequestToBook}
                className="w-full h-12 px-3.5 py-2 bg-sky-900 rounded flex justify-center items-center gap-1 mb-3 hover:bg-sky-800 transition-colors"
            >
                <span className="text-center text-white text-base font-semibold font-poppins">
                    Request to Book
                </span>
            </button>

            {/* Info Message */}
            <div className="flex items-start gap-2">
                <Image
                    src="/icons/whiteShield.svg"
                    alt="Safety Info"
                    width={20}
                    height={20}
                    className="mt-1"
                />
                <p className="text-gray-500 text-sm font-normal font-poppins leading-6">
                    You won&apos;t be charged yet. The host will review your request.
                </p>
            </div>
        </div>
    );
}
