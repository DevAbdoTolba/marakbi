"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface BookingSidebarProps {
    boatId: number;
    boatName: string;
    pricePerHour: number | null;
    pricePerDay?: number | null;
    maxGuests: number;
    serviceFeeRate: number;
    onBookingRequest: (bookingData: BookingData) => void;
    // New props for Trip Booking
    isTripBooking?: boolean;
    tripDuration?: number;
    tripPrice?: number;
    initialGuestCount?: number;
    locationUrl?: string;
    priceMode?: "per_time" | "per_person" | "per_person_per_time";
}

export interface BookingData {
    boat_id: number;
    boat_name: string;
    guest_count: number;
    rental_type: "hourly" | "daily" | "trip";
    hours?: number;
    start_date: string;
    end_date: string;
    days?: number;
    base_price: number;
    service_fee: number;
    total_price: number;
    trip_id?: number;
}

type RentalType = "hour" | "day" | "trip";

export default function BookingSidebar({
    boatId,
    boatName,
    pricePerHour,
    pricePerDay,
    maxGuests,
    serviceFeeRate,
    onBookingRequest,
    isTripBooking = false,
    tripDuration = 0,
    tripPrice = 0,
    initialGuestCount = 2,
    locationUrl,
    priceMode = "per_time",
}: BookingSidebarProps) {
    const [rentalType, setRentalType] = useState<RentalType>(() => {
        if (isTripBooking) return "trip";
        if (pricePerHour) return "hour";
        return "day";
    });
    const [guestCount, setGuestCount] = useState(initialGuestCount);
    // const [hours, setHours] = useState(1); // Removed in favor of start/end time
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (isTripBooking) {
            setRentalType("trip");
        } else {
            // Reset to defaults if switching back (though unlikely in this flow)
            if (rentalType === 'trip') setRentalType('hour');
        }
    }, [isTripBooking]);

    useEffect(() => {
        if (initialGuestCount) {
            setGuestCount(initialGuestCount);
        }
    }, [initialGuestCount]);

    useEffect(() => {
        // Ensure guestCount is within valid range upon initialization
        if (initialGuestCount > maxGuests) {
            setGuestCount(maxGuests);
        }
    }, [initialGuestCount, maxGuests]);


    // Generate time options (24h format, e.g., "08:00", "09:00")
    const timeOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0");
        return `${hour}:00`;
    });

    // Helper to check if a date should be disabled (today or past)
    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Disable past dates AND today (must be at least tomorrow)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return date < tomorrow;
    };

    // Calculate price
    const calculatePrice = () => {
        let basePrice = 0;
        let days = 0;
        let calculatedHours = 0;

        if (rentalType === "trip") {
            basePrice = tripPrice;
            // Set duration for display/logic
            calculatedHours = tripDuration;
        } else if (rentalType === "hour") {
            if (startTime && endTime) {
                const startHour = parseInt(startTime.split(":")[0]);
                const endHour = parseInt(endTime.split(":")[0]);
                if (endHour > startHour) {
                    calculatedHours = endHour - startHour;

                    if (priceMode === 'per_person') {
                        // Per person (fixed per session/time independent for now, based on user context)
                        basePrice = (pricePerHour || 0) * guestCount;
                    } else if (priceMode === 'per_person_per_time') {
                        // Per person per hour
                        basePrice = (pricePerHour || 0) * guestCount * calculatedHours;
                    } else {
                        // Standard (Per Hour)
                        basePrice = (pricePerHour || 0) * calculatedHours;
                    }
                }
            }
        } else if (rentalType === "day") {
            if (selectedDates.length > 0) {
                if (selectedDates.length === 2) {
                    const start = selectedDates[0];
                    const end = selectedDates[1];
                    days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                } else {
                    days = 1;
                }
                const effectivePrice = pricePerDay || (pricePerHour ? pricePerHour * 8 : 0);

                if (priceMode === 'per_person' || priceMode === 'per_person_per_time') {
                    // If pricing model is per person, apply guest count to daily rate too
                    basePrice = effectivePrice * days * guestCount;
                } else {
                    // Standard Per Day (Flat for the boat)
                    basePrice = effectivePrice * days;
                }
            }
        }

        // Service fee calculation based on base price
        const serviceFee = Math.round(basePrice * serviceFeeRate);
        const total = basePrice + serviceFee;

        return { basePrice, serviceFee, total, days, calculatedHours };
    };

    const { basePrice, serviceFee, total, days, calculatedHours } = calculatePrice();

    // Calendar helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth(); // Keep as number (0-11)
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(year, month, day);

        if (isDateDisabled(clickedDate)) return;

        if (rentalType === "day") {
            // Range selection for daily
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
        } else {
            // Single date selection for hourly OR trip
            setSelectedDates([clickedDate]);
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
            toast.error("Please select a date");
            return;
        }

        if (rentalType === "hour") {
            if (!startTime || !endTime) {
                toast.error("Please select start and end time");
                return;
            }
            const startHour = parseInt(startTime.split(":")[0]);
            const endHour = parseInt(endTime.split(":")[0]);
            if (endHour <= startHour) {
                toast.error("End time must be after start time");
                return;
            }
        }

        if ((rentalType === "day" || rentalType === "trip") && !startTime) {
            toast.error("Please select start time");
            return;
        }

        // Combine date and time
        const formatDateAsUTC = (date: Date, timeStr: string) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const [hours, minutes] = timeStr.split(':');

            return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
        };

        const startDateIso = formatDateAsUTC(selectedDates[0], startTime);

        let endDateIso: string;
        if (rentalType === "hour") {
            endDateIso = formatDateAsUTC(selectedDates[0], endTime);
        } else if (rentalType === "trip") {
            // Calculate end date based on duration
            const startDateTime = new Date(selectedDates[0]);
            const [hours, minutes] = startTime.split(':');
            startDateTime.setHours(parseInt(hours), parseInt(minutes));
            // Add duration hours
            const endDateTime = new Date(startDateTime.getTime() + tripDuration * 60 * 60 * 1000);

            const endYear = endDateTime.getFullYear();
            const endMonth = (endDateTime.getMonth() + 1).toString().padStart(2, '0');
            const endDay = endDateTime.getDate().toString().padStart(2, '0');
            const endH = endDateTime.getHours().toString().padStart(2, '0');
            const endM = endDateTime.getMinutes().toString().padStart(2, '0');
            endDateIso = `${endYear}-${endMonth}-${endDay}T${endH}:${endM}:00.000Z`;

        } else {
            // For daily, use the end date (or start date if single day selected)
            const targetDate = selectedDates.length === 2 ? selectedDates[1] : selectedDates[0];

            // Force end time to 23:59:59 for daily bookings (as per user request)
            const year = targetDate.getFullYear();
            const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
            const day = targetDate.getDate().toString().padStart(2, '0');
            endDateIso = `${year}-${month}-${day}T23:59:59.000Z`;
        }

        // Check if user is authenticated
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        const bookingData: BookingData = {
            boat_id: boatId,
            boat_name: boatName,
            guest_count: guestCount,
            rental_type: rentalType === "hour" ? "hourly" : rentalType === "day" ? "daily" : "trip",
            hours: (rentalType === "hour" || rentalType === "trip") ? calculatedHours : undefined,
            start_date: startDateIso,
            end_date: endDateIso,
            days: days > 0 ? days : undefined,
            base_price: basePrice,
            service_fee: serviceFee,
            total_price: total,
        };

        if (!accessToken) {
            localStorage.setItem('pending_booking_data', JSON.stringify(bookingData));
            localStorage.setItem('intended_url', '/payment');
            window.location.href = '/login';
            return;
        }

        onBookingRequest(bookingData);
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const effectivePrice = rentalType === "hour"
        ? (pricePerHour || 0)
        : (pricePerDay || (pricePerHour ? pricePerHour * 8 : 0));

    // Determine Labels based on Price Mode
    let priceUnitLabel = "/Hour";
    let priceDailyUnitLabel = "/Day"; // Default

    if (priceMode === 'per_person') {
        priceUnitLabel = "/Person";
        priceDailyUnitLabel = "/Person/Day";
    } else if (priceMode === 'per_person_per_time') {
        priceUnitLabel = "/Person/Hr";
        priceDailyUnitLabel = "/Person/Day";
    }

    // End Time Options Logic
    const getEndTimeOptions = () => {
        if (!startTime) return timeOptions;
        const startHour = parseInt(startTime.split(":")[0]);
        // Only show hours AFTER start time
        return timeOptions.filter(time => {
            const endHour = parseInt(time.split(":")[0]);
            return endHour > startHour;
        });
    };

    // Reset end time if it becomes invalid when start time changes
    useEffect(() => {
        if (startTime && endTime) {
            const startHour = parseInt(startTime.split(":")[0]);
            const endHour = parseInt(endTime.split(":")[0]);
            if (endHour <= startHour) {
                setEndTime(""); // Clear invalid end time
            }
        }
    }, [startTime, endTime]);

    const breakdownLabel = () => {
        if (isTripBooking) return 'Flat Rate';
        if (rentalType === 'day') {
            if (priceMode === 'per_person' || priceMode === 'per_person_per_time') {
                return `E£ ${effectivePrice} × ${guestCount} guests × ${days} days`;
            }
            return `E£ ${effectivePrice} × ${days} days`;
        }

        // Hourly Logic Breakdown
        if (priceMode === 'per_person') {
            return `E£ ${pricePerHour || 0} × ${guestCount} guests`;
        } else if (priceMode === 'per_person_per_time') {
            return `E£ ${pricePerHour || 0} × ${guestCount} guests × ${calculatedHours} hours`;
        } else {
            // Standard
            return `E£ ${pricePerHour || 0} × ${calculatedHours} hours`;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-stone-300 p-4 shadow-lg">
            {!isTripBooking ? (
                /* Rental Type Tabs - Hide for Trip Booking */
                <div className="flex justify-start items-center gap-2 mb-6">
                    {pricePerHour && (
                        <button
                            onClick={() => {
                                setRentalType("hour");
                                setSelectedDates([]);
                                setStartTime("");
                                setEndTime("");
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-normal font-poppins transition-colors ${rentalType === "hour"
                                ? "bg-[#0F3875] text-white"
                                : "border border-zinc-400 text-zinc-500 hover:bg-gray-50"
                                }`}
                        >
                            Per Hour
                        </button>
                    )}
                    {pricePerDay && (
                        <button
                            onClick={() => {
                                setRentalType("day");
                                setSelectedDates([]);
                                setStartTime("");
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-normal font-poppins transition-colors ${rentalType === "day"
                                ? "bg-[#0F3875] text-white"
                                : "border border-zinc-400 text-zinc-500 hover:bg-gray-50"
                                }`}
                        >
                            Per Day
                        </button>
                    )}
                </div>
            ) : (
                <div className="mb-4">
                    {/* Trip Info removed as per design */}
                </div>
            )}

            {/* Pricing Display */}
            {!isTripBooking && (
                <div className="flex justify-between items-center mb-6">
                    <div className="text-zinc-950 text-2xl font-semibold font-poppins capitalize">
                        Pricing
                    </div>
                    <div className="text-right">
                        <span className="text-[#106BD8] text-xl font-semibold font-poppins capitalize">
                            {effectivePrice}
                        </span>
                        <span className="text-black text-sm font-normal font-poppins capitalize">
                            {" "}EGP{rentalType === "day" ? priceDailyUnitLabel : priceUnitLabel}
                        </span>
                    </div>
                </div>
            )}

            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1))}
                    className="p-1 hover:bg-gray-100 rounded-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <div className="text-stone-950 text-base font-semibold font-inter">
                    {monthNames[month]} {year}
                </div>
                <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1))}
                    className="p-1 hover:bg-gray-100 rounded-full"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                        <div key={day} className="text-zinc-500 text-xs font-normal font-inter">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startingDayOfWeek - 1 }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(year, month, day);
                        const isDisabled = isDateDisabled(date);
                        const isSelected = isDateSelected(day);
                        const isInRange = isDateInRange(day);

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                disabled={isDisabled}
                                className={`
                                    h-8 w-8 rounded-full flex items-center justify-center text-sm font-inter transition-colors
                                    ${isDisabled
                                        ? "text-gray-300 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-[#0F3875] text-white hover:bg-[#0A2755]"
                                            : isInRange
                                                ? "bg-[#E6F0FF] text-[#0F3875]"
                                                : "text-stone-700 hover:bg-gray-100"
                                    }
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-zinc-500 text-xs font-normal font-poppins mb-1.5">
                        Start Time
                    </label>
                    <div className="relative">
                        <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full h-9 px-3 bg-white rounded border border-neutral-200 text-stone-900 text-sm font-normal font-poppins focus:outline-none focus:border-[#0F3875] appearance-none cursor-pointer"
                        >
                            <option value="">Select</option>
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {rentalType === "hour" && (
                    <div>
                        <label className="block text-zinc-500 text-xs font-normal font-poppins mb-1.5">
                            End Time
                        </label>
                        <div className="relative">
                            <select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full h-9 px-3 bg-white rounded border border-neutral-200 text-stone-900 text-sm font-normal font-poppins focus:outline-none focus:border-[#0F3875] appearance-none cursor-pointer"
                            >
                                <option value="">Select</option>
                                {getEndTimeOptions().map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
                {/* For Trip Type, we hide end time selection as it's calculated */}
            </div>

            {/* Guest Count */}
            <div className="mb-6">
                <label className="flex items-center gap-2 text-stone-700 text-sm font-normal font-poppins mb-3">
                    <span className="text-zinc-500">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 7.8125C9.39844 7.8125 10.9375 6.27344 10.9375 4.375C10.9375 2.47656 9.39844 0.9375 7.5 0.9375C5.60156 0.9375 4.0625 2.47656 4.0625 4.375C4.0625 6.27344 5.60156 7.8125 7.5 7.8125ZM9.80469 8.75H5.19531C2.96484 8.75 1.17188 10.543 1.17188 12.7734V13.4375C1.17188 13.7852 1.45312 14.0625 1.80078 14.0625H13.1992C13.5469 14.0625 13.8281 13.7852 13.8281 13.4375V12.7734C13.8281 10.543 12.0352 8.75 9.80469 8.75Z" fill="#757575" />
                        </svg>
                    </span>
                    Number of guests
                </label>
                <div className="flex items-center justify-between h-11 px-4 py-2.5 bg-white rounded border border-neutral-200">
                    <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="text-stone-900 text-xl font-medium"
                    >
                        −
                    </button>
                    <span className="text-stone-900 text-sm font-medium font-poppins">
                        {guestCount}
                    </span>
                    <button
                        onClick={() => setGuestCount(Math.min(maxGuests, guestCount + 1))}
                        className="text-stone-900 text-xl font-medium"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="mb-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500 text-sm font-normal font-poppins">
                        {breakdownLabel()}
                    </span>
                    <span className="text-stone-900 text-sm font-medium font-poppins">
                        E£ {basePrice}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-500 text-sm font-normal font-poppins">
                        Service fee ({serviceFeeRate * 100}%)
                    </span>
                    <span className="text-stone-900 text-sm font-medium font-poppins">
                        E£ {serviceFee}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-stone-900 text-base font-semibold font-poppins">
                        Total
                    </span>
                    <span className="text-stone-900 text-base font-semibold font-poppins">
                        E£ {total}
                    </span>
                </div>
            </div>

            <button
                onClick={handleRequestToBook}
                className="w-full h-11 px-6 py-2.5 bg-[#0C4A8C] rounded-lg flex justify-center items-center gap-2.5 text-white text-base font-medium font-poppins hover:bg-[#0A3D7A] transition-colors"
            >
                Continue
            </button>

            {locationUrl && (
                <a
                    href={locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 mt-3 px-6 py-2.5 border border-[#0C4A8C] rounded-lg flex justify-center items-center gap-2 text-[#0C4A8C] text-base font-medium font-poppins hover:bg-sky-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    View Meet Location
                </a>
            )}
        </div>
    );
}
