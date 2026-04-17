"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { clientApi, Trip, Boat, City, BASE_URL } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface TripWithBoats extends Trip {
    boats?: Boat[];
}

export default function TripListingLayout() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [trips, setTrips] = useState<TripWithBoats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cities, setCities] = useState<City[]>([]);

    // Filters from URL
    const cityId = searchParams.get("city_id");
    const minPassengers = searchParams.get("min_passengers");

    // Fetch cities on mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await clientApi.getCities();
                if (response.success && response.data) {
                    setCities(response.data.cities);
                }
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        };
        fetchCities();
    }, []);

    // Fetch trips based on filters
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                setError(null);

                // Build query params
                let url = `/client/trips`;
                const params = new URLSearchParams();
                if (cityId) params.append("city_id", cityId);
                if (minPassengers) params.append("min_passengers", minPassengers);

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                // Call getAllTrips with cityId (API will handle min_passengers on backend)
                const response = await fetch(`${BASE_URL}${url}`);
                const data = await response.json();

                if (response.ok) {
                    setTrips(data);
                } else {
                    setError(data.error || "Failed to fetch trips");
                }
            } catch (err) {
                console.error("Error fetching trips:", err);
                setError("Failed to load trips. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [cityId, minPassengers]);

    // Navigate to trip specific boat listing page
    const handleTripClick = (trip: TripWithBoats) => {
        const params = new URLSearchParams();
        if (minPassengers) params.append("min_passengers", minPassengers);
        router.push(`/trip-listing/${trip.id}${params.toString() ? `?${params.toString()}` : ''}`);
    };

    // Get city name by ID
    const getCityName = (id: number) => {
        return cities.find((c) => c.id === id)?.name || "Unknown";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-800"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Trips</h1>
                    <p className="text-gray-600">
                        {cityId && cities.length > 0 && `in ${getCityName(parseInt(cityId))}`}
                        {minPassengers && ` for ${minPassengers}+ passengers`}
                    </p>
                </div>

                {trips.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No trips found matching your criteria.</p>
                        <button
                            onClick={() => router.push("/trip-listing")}
                            className="mt-4 px-6 py-2 bg-sky-900 text-white rounded-lg hover:bg-sky-800"
                        >
                            View All Trips
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1">
                                {/* Trip Card */}
                                <div
                                    className="cursor-pointer"
                                    onClick={() => handleTripClick(trip)}
                                >
                                    {/* Trip Image */}
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={trip.images?.[0] ? normalizeImageUrl(trip.images[0]) : "/images/placeholder-boat.jpg"}
                                            alt={trip.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-sky-900 text-white px-3 py-1 rounded-full text-sm">
                                            {trip.trip_type}
                                        </div>
                                    </div>

                                    {/* Trip Info */}
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.name}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>

                                        <div className="flex justify-between items-center mt-4">
                                            <div>
                                                <span className="text-sky-900 text-xl font-bold">
                                                    E£ {trip.total_price}
                                                </span>
                                                <span className="text-gray-500 text-sm ml-1">
                                                    / {trip.voyage_hours}h
                                                </span>
                                            </div>
                                            <button className="text-sky-900 text-sm font-medium hover:underline">
                                                View Boats →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
