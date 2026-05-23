"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';
import Image from "next/image";
import { clientApi, Trip, Boat, BASE_URL } from "@/lib/api";

import { normalizeImageUrl } from "@/lib/imageUtils";
import { FiClock, FiMapPin, FiUsers, FiArrowRight } from "react-icons/fi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaStar } from "react-icons/fa";

export default function TripBoatsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tripId = params.tripId as string;
    const minPassengers = searchParams.get("min_passengers");

    const [trip, setTrip] = useState<Trip | null>(null);
    const [boats, setBoats] = useState<Boat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (!trip?.images || trip.images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % trip.images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [trip?.images]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Trip Details
                const tripResponse = await fetch(`${BASE_URL}/client/trips/${tripId}`);
                if (!tripResponse.ok) throw new Error("Failed to fetch trip details");
                const tripData = await tripResponse.json();
                setTrip(tripData);

                // Fetch Boats for this Trip
                const boatsResponse = await clientApi.getBoats(1, 100);
                if (boatsResponse.success && boatsResponse.data) {
                    const boatsForTrip = boatsResponse.data.boats.filter(
                        (boat) => boat.trips?.some((t) => t.id === parseInt(tripId))
                    );

                    // Apply min_passengers filter
                    const filteredBoats = minPassengers
                        ? boatsForTrip.filter((boat) => boat.max_seats >= parseInt(minPassengers))
                        : boatsForTrip;

                    setBoats(filteredBoats);
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load trip details.");
            } finally {
                setLoading(false);
            }
        };

        if (tripId) {
            fetchData();
        }
    }, [tripId, minPassengers]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="text-sky-900 hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const tripImages = trip.images && trip.images.length > 0 ? trip.images : ["/images/placeholder-trip.jpg"];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 1. Full-Width Image Slider */}
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] bg-gray-900 overflow-hidden">
                {tripImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <Image
                            src={normalizeImageUrl(img)}
                            alt={`${trip.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        {/* Dark Overlay for better text visibility if needed, or keeping it clean */}
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                ))}

                {/* Slider Indicators */}
                {tripImages.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                        {tripImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Trip Details (Name, Description, Tags) */}
            <div className="container mx-auto px-4 py-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-sky-900 mb-6 font-poppins">{trip.name}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{trip.description}</p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                        <div className="px-5 py-2.5 bg-sky-50 text-sky-900 rounded-full border border-sky-100 flex items-center gap-2 shadow-sm">
                            <FiClock className="text-lg" />
                            <span>{trip.voyage_hours} Hours</span>
                        </div>
                        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-900 rounded-full border border-emerald-100 flex items-center gap-2 shadow-sm">
                            <MdOutlineAttachMoney className="text-xl" />
                            <span>Starts from EGP {trip.total_price}</span>
                        </div>
                        <div className="px-5 py-2.5 bg-amber-50 text-amber-900 rounded-full border border-amber-100 flex items-center gap-2 shadow-sm">
                            <FiMapPin className="text-lg" />
                            <span>{trip.city_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Boats Selection List */}
            <div className="container mx-auto px-4 mt-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-sky-900 pl-4">Select a Boat for this Trip</h2>

                    {boats.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-300 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No Boats Available</h3>
                            <p className="text-gray-500">There are no boats matching your criteria for this trip right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {boats.map(boat => (
                                <div key={boat.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={boat.images?.[0] ? normalizeImageUrl(boat.images[0]) : "/images/placeholder-boat.jpg"}
                                            alt={boat.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-sm font-bold text-gray-900">{boat.average_rating ?? 0}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">{boat.name}</h3>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                                            <FiUsers className="text-lg" />
                                            <span>Max {boat.max_seats} Guests</span>
                                        </div>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => router.push(`/boat-details/${boat.id}?trip_id=${tripId}${minPassengers ? `&guest_count=${minPassengers}` : ''}`)}
                                                className="w-full py-3 bg-[#0C4A8C] text-white rounded-xl font-medium hover:bg-[#0A3D7A] transition-colors shadow-lg shadow-blue-900/10 flex justify-center items-center gap-2 group-hover:gap-3"
                                            >
                                                <span>Book This Boat</span>
                                                <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
