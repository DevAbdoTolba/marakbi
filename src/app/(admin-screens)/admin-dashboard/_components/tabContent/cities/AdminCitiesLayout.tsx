import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiX, FiAnchor, FiUsers } from "react-icons/fi";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";

interface City {
    id: number;
    name: string;
    created_at: string;
    boats_count?: number;
    trips_count?: number;
}

export default function AdminCitiesLayout() {
    const { showSuccess, showError } = useToast();
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [cityName, setCityName] = useState("");
    const [saving, setSaving] = useState(false);

    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; cityId: number | null; cityName: string }>({
        isOpen: false,
        cityId: null,
        cityName: ""
    });
    const [deleting, setDeleting] = useState(false);

    // City Details Modal State
    const [selectedCityForDetails, setSelectedCityForDetails] = useState<City | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cityBoats, setCityBoats] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cityTrips, setCityTrips] = useState<any[]>([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsTab, setDetailsTab] = useState<'boats' | 'trips'>('boats');

    const fetchCityDetails = async (city: City) => {
        setSelectedCityForDetails(city);
        setDetailsLoading(true);
        try {
            const [boatsResponse, tripsResponse] = await Promise.all([
                adminApi.getBoats(1, 100, { city_id: city.id }),
                adminApi.getTrips(1, 100, { city_id: city.id })
            ]);

            if (boatsResponse.success && boatsResponse.data) {
                setCityBoats(boatsResponse.data.boats);
            }
            if (tripsResponse.success && tripsResponse.data) {
                setCityTrips(tripsResponse.data.trips);
            }
        } catch (error) {
            showError("Failed to fetch city details");
        }
        setDetailsLoading(false);
    };

    const searchParams = useSearchParams();

    // Deep linking: Open city modal
    useEffect(() => {
        const cityIdParam = searchParams.get('openCityId');
        if (cityIdParam && cities.length > 0) {
            const cityId = parseInt(cityIdParam);
            const city = cities.find(c => c.id === cityId);
            if (city) {
                if (selectedCityForDetails?.id !== city.id) {
                    fetchCityDetails(city);
                }
            }
        } else {
            // If no param, ensure modal is closed
            if (selectedCityForDetails) {
                setSelectedCityForDetails(null);
            }
        }
    }, [searchParams, cities, selectedCityForDetails]);

    const fetchCities = useCallback(async () => {
        setLoading(true);
        const response = await adminApi.getCities();
        if (response.success && response.data) {
            setCities(response.data.cities);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCities();
    }, [fetchCities]);

    const openCreateModal = () => {
        setEditingCity(null);
        setCityName("");
        setShowModal(true);
    };

    const openEditModal = (city: City) => {
        setEditingCity(city);
        setCityName(city.name);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!cityName.trim()) {
            showError("Please enter a city name");
            return;
        }

        setSaving(true);

        let response;
        if (editingCity) {
            response = await adminApi.updateCity(editingCity.id, cityName);
        } else {
            response = await adminApi.createCity(cityName);
        }

        if (response.success) {
            setShowModal(false);
            setCityName("");
            setEditingCity(null);
            fetchCities();
            showSuccess(editingCity ? "City updated successfully" : "City created successfully");
        } else {
            showError(response.error || "Failed to save city");
        }
        setSaving(false);
    };

    const handleDeleteClick = (city: City) => {
        setConfirmDelete({ isOpen: true, cityId: city.id, cityName: city.name });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.cityId) return;

        setDeleting(true);
        const response = await adminApi.deleteCity(confirmDelete.cityId);
        if (response.success) {
            // If the deleted city is the one currently open, close the modal
            if (selectedCityForDetails?.id === confirmDelete.cityId) {
                router.push('/admin-dashboard?tab=cities');
                setSelectedCityForDetails(null); // Optimistic close
            }
            fetchCities();
            showSuccess("City deleted successfully");
        } else {
            showError(response.error || "Failed to delete city");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, cityId: null, cityName: "" });
    };

    // Navigation
    const router = useRouter();

    const navigateToDetails = (type: 'boat' | 'trip', id: number) => {
        const cityId = selectedCityForDetails?.id;
        // Close modal
        setSelectedCityForDetails(null);

        // Navigate to respective tab with ID param
        const params = new URLSearchParams();
        if (type === 'boat') {
            params.set('tab', 'boat-listings');
            params.set('boatId', id.toString());
            if (cityId) params.set('returnToCityId', cityId.toString());
        } else {
            params.set('tab', 'trips');
            params.set('tripId', id.toString());
            // Does trips layout support returnToCityId? Probably should check, but let's add it regardless.
            if (cityId) params.set('returnToCityId', cityId.toString());
        }
        router.push(`/admin-dashboard?${params.toString()}`);
    };

    // Helper to get image url safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getImageUrl = (item: any) => {
        if (item.images && item.images.length > 0) return item.images[0];
        if (item.primary_image_url) return item.primary_image_url;
        return null; // or placeholder logic in render
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-bold text-xl">Cities Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage cities for boats and trips ({cities.length} total)
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <FiPlus size={18} /> Add City
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border rounded-xl p-4 h-[120px] animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : cities.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiMapPin className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No cities found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Get started by adding cities where your boats operate.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Add your first city
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cities.map((city) => (
                        <div
                            key={city.id}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 hover:shadow-lg transition cursor-pointer group"
                            onClick={() => router.push(`/admin-dashboard?tab=cities&openCityId=${city.id}`)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FiMapPin className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{city.name}</h3>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                            <span>{city.boats_count || 0} boats</span>
                                            <span>•</span>
                                            <span>{city.trips_count || 0} trips</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(city);
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-white rounded transition"
                                    aria-label={`Edit ${city.name}`}
                                >
                                    <FiEdit2 size={14} /> Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* City Details Modal */}
            {selectedCityForDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedCityForDetails.name}</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{cityBoats.length} Boats</span>
                                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">{cityTrips.length} Trips</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDeleteClick(selectedCityForDetails)}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                                    title="Delete City"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                                <button
                                    onClick={() => router.push('/admin-dashboard?tab=cities')}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-100 px-6 bg-white sticky top-0 z-10">
                            <div className="flex gap-8">
                                <button
                                    className={`py-4 text-sm font-semibold border-b-2 transition-all ${detailsTab === 'boats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                                    onClick={() => setDetailsTab('boats')}
                                >
                                    Boats Fleet
                                </button>
                                <button
                                    className={`py-4 text-sm font-semibold border-b-2 transition-all ${detailsTab === 'trips' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                                    onClick={() => setDetailsTab('trips')}
                                >
                                    Trip Packages
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
                            {detailsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                    <p className="text-sm text-gray-500 font-medium">Loading details...</p>
                                </div>
                            ) : (
                                <>
                                    {detailsTab === 'boats' && (
                                        cityBoats.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {cityBoats.map(boat => {
                                                    const imgUrl = getImageUrl(boat);
                                                    return (
                                                        <div key={boat.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                                                {imgUrl ? (
                                                                    // Using standard img tag if not using Next Image with known domains, or use API helper
                                                                    <img src={imgUrl} alt={boat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                                        <FiAnchor size={32} />
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                                                <div className="absolute top-3 right-3">
                                                                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                                                                        ${boat.price_per_hour}/hr
                                                                    </span>
                                                                </div>
                                                                <div className="absolute bottom-3 left-3 text-white">
                                                                    <div className="flex items-center gap-1.5 text-xs font-medium bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                                                                        <FiUsers size={12} /> {boat.max_seats} Guests
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="p-5 flex flex-col flex-1">
                                                                <h3 className="font-bold text-gray-900 mb-1 truncate text-lg group-hover:text-blue-600 transition-colors">{boat.name}</h3>
                                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{boat.description || "No description provided."}</p>

                                                                <div className="mt-auto pt-4 border-t border-gray-50">
                                                                    <button
                                                                        onClick={() => navigateToDetails('boat', boat.id)}
                                                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group-hover:border-blue-200 group-hover:text-blue-700"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                    <FiAnchor size={24} />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">No boats found</h3>
                                                <p className="text-gray-500">There are no boats listed in {selectedCityForDetails.name} yet.</p>
                                            </div>
                                        )
                                    )}

                                    {detailsTab === 'trips' && (
                                        cityTrips.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {cityTrips.map(trip => {
                                                    const imgUrl = getImageUrl(trip);
                                                    return (
                                                        <div key={trip.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                                                {imgUrl ? (
                                                                    <img src={imgUrl} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                                        <FiMapPin size={32} />
                                                                    </div>
                                                                )}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                                                <div className="absolute top-3 right-3">
                                                                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                                                                        ${trip.total_price}
                                                                    </span>
                                                                </div>
                                                                <div className="absolute bottom-3 left-3 text-white">
                                                                    <div className="flex gap-2">
                                                                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{trip.trip_type}</span>
                                                                        <span className="bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold">{trip.voyage_hours}h</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="p-5 flex flex-col flex-1">
                                                                <h3 className="font-bold text-gray-900 mb-1 truncate text-lg group-hover:text-blue-600 transition-colors">{trip.name}</h3>
                                                                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{trip.description || "No description provided."}</p>

                                                                <div className="mt-auto pt-4 border-t border-gray-50">
                                                                    <button
                                                                        onClick={() => navigateToDetails('trip', trip.id)}
                                                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group-hover:border-blue-200 group-hover:text-blue-700"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                    <FiMapPin size={24} />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900">No trips found</h3>
                                                <p className="text-gray-500">There are no trips listed in {selectedCityForDetails.name} yet.</p>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold">
                                {editingCity ? "Edit City" : "Add New City"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setCityName("");
                                    setEditingCity(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City Name *
                            </label>
                            <input
                                type="text"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                                placeholder="Enter city name"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSubmit();
                                }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setCityName("");
                                    setEditingCity(null);
                                }}
                                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving || !cityName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {editingCity ? "Update City" : "Create City"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete City"
                message={`Are you sure you want to delete "${confirmDelete.cityName}"? This may affect boats and trips associated with it.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, cityId: null, cityName: "" })}
                isLoading={deleting}
            />
        </div>
    );
}
