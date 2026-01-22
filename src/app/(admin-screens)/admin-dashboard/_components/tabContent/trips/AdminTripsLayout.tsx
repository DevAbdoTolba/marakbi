"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi, AdminTrip } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX, FiUpload, FiClock, FiDollarSign, FiMapPin, FiStar, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import Image from "next/image";
import ConfirmModal from "../../ConfirmModal";
import { useToast } from "../../ToastProvider";

interface TripFormData {
    name: string;
    description: string;
    total_price: number;
    voyage_hours: number;
    trip_type: string;
    city_id: number;
    pax: number | null;
    guests_on_board: number | null;
    rooms_available: number | null;
}

const TRIP_TYPES = ["Voyage", "Fishing", "Occasion", "Cruise", "Water_activities"];

export default function AdminTripsLayout() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Also initializing this since it was imported and might be needed, though deep linking mainly uses searchParams.
    const [trips, setTrips] = useState<AdminTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [cityFilter, setCityFilter] = useState<number | undefined>();
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [editingTrip, setEditingTrip] = useState<AdminTrip | null>(null);
    const [saving, setSaving] = useState(false);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showSuccess, showError } = useToast();

    // View Details Modal State
    const [viewDetailsTrip, setViewDetailsTrip] = useState<AdminTrip | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [activeTab, setActiveTab] = useState<'details' | 'photos'>('details');
    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; tripId: number | null }>({
        isOpen: false,
        tripId: null
    });
    const [deleting, setDeleting] = useState(false);

    // Primary Image State
    const [primaryNewImageIndex, setPrimaryNewImageIndex] = useState<number>(0);
    const [primaryExistingUrl, setPrimaryExistingUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState<TripFormData>({
        name: "",
        description: "",
        total_price: 0,
        voyage_hours: 1,
        trip_type: "Voyage",
        city_id: 0,
        pax: null,
        guests_on_board: null,
        rooms_available: null,
    });

    const fetchTrips = useCallback(async () => {
        setLoading(true);
        const filters: { city_id?: number; trip_type?: string } = {};
        if (cityFilter) filters.city_id = cityFilter;
        if (typeFilter) filters.trip_type = typeFilter;

        const response = await adminApi.getTrips(page, 10, filters);
        if (response.success && response.data) {
            setTrips(response.data.trips);
            setTotalPages(response.data.pages);
        }
        setLoading(false);
    }, [page, cityFilter, typeFilter]);

    const fetchCities = async () => {
        const response = await adminApi.getCities();
        if (response.success && response.data) {
            setCities(response.data.cities);
        }
    };

    useEffect(() => {
        fetchTrips();
        fetchCities();

        // Check for tripId in URL
        const tripIdParam = searchParams.get("tripId");
        if (tripIdParam) {
            const tripId = Number(tripIdParam);
            if (!isNaN(tripId)) {
                // Fetch trip details to open modal
                const fetchTripForModal = async () => {
                    const response = await adminApi.getTrip(tripId);
                    if (response.success && response.data) {
                        setViewDetailsTrip(response.data);
                    }
                };
                fetchTripForModal();
            }
        }
    }, [fetchTrips, searchParams]);

    // Reset image index when opening details modal
    useEffect(() => {
        if (viewDetailsTrip) {
            setCurrentImageIndex(0);
        }
    }, [viewDetailsTrip]);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            total_price: 0,
            voyage_hours: 1,
            trip_type: "Voyage",
            city_id: cities[0]?.id || 0,
            pax: null,
            guests_on_board: null,
            rooms_available: null,
        });
        setNewImages([]);
        setImagePreviews([]);
        setRemovedImageUrls([]);
        setActiveTab('details');
        setPrimaryExistingUrl(null);
        setPrimaryNewImageIndex(0);
    };

    const openCreateModal = () => {
        setEditingTrip(null);
        resetForm();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();

        // Handle navigation back or clear params
        const returnToCityId = searchParams.get('returnToCityId');
        const returnTab = searchParams.get('returnTab');
        const returnOrderId = searchParams.get('returnOrderId');

        if (returnToCityId) {
            router.push(`/admin-dashboard?tab=cities&openCityId=${returnToCityId}`);
        } else if (returnTab && returnOrderId) {
            router.push(`/admin-dashboard?tab=${returnTab}&openOrderId=${returnOrderId}`);
        } else {
            // Remove tripId param from URL if it exists
            const params = new URLSearchParams(searchParams.toString());
            if (params.get('tripId')) {
                params.delete('tripId');
                router.push(`/admin-dashboard?${params.toString()}`);
            }
        }
    };

    const openEditModal = async (trip: AdminTrip) => {
        setEditingTrip(trip);
        setRemovedImageUrls([]); // Reset removed images
        setActiveTab('details');
        setPrimaryExistingUrl(null);
        setPrimaryNewImageIndex(0);

        const response = await adminApi.getTrip(trip.id);
        if (response.success && response.data) {
            const data = response.data;
            setFormData({
                name: data.name,
                description: data.description || "",
                total_price: data.total_price,
                voyage_hours: data.voyage_hours,
                trip_type: data.trip_type,
                city_id: data.city_id,
                pax: data.pax || null,
                guests_on_board: data.guests_on_board || null,
                rooms_available: data.rooms_available || null,
            });
            setImagePreviews(data.images || []);

            // Set initial primary image if exists
            if (data.images && data.images.length > 0) {
                setPrimaryExistingUrl(data.images[0]);
            }
        }
        setShowModal(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewImages((prev) => [...prev, ...files]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const imageUrl = imagePreviews[index];
        const existingImagesCount = editingTrip?.images?.length || 0;
        const removedExistingCount = removedImageUrls.length;
        const remainingExistingCount = existingImagesCount - removedExistingCount;

        // Handle Primary Image Removal Logic
        if (imageUrl === primaryExistingUrl) {
            setPrimaryExistingUrl(null);
            setPrimaryNewImageIndex(0); // Reset new image primary index too
        }

        // Check if we are removing a new image that was selected as primary
        if (index >= remainingExistingCount) {
            const newIndex = index - remainingExistingCount;
            if (newIndex === primaryNewImageIndex) {
                setPrimaryNewImageIndex(0); // Reset if the primary new image is removed
            } else if (newIndex < primaryNewImageIndex) {
                setPrimaryNewImageIndex(prev => Math.max(0, prev - 1)); // Adjust index if a new image before it is removed
            }
        }

        if (index < remainingExistingCount && editingTrip?.images?.includes(imageUrl)) {
            setRemovedImageUrls((prev) => [...prev, imageUrl]);
        }

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));

        if (index >= remainingExistingCount) {
            const newIndex = index - remainingExistingCount;
            setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.total_price || !formData.city_id) {
            showError("Please fill in required fields (name, price, and city)");
            return;
        }

        setSaving(true);

        const tripData: any = { // Using any to append extra fields if needed by backend, matching boat logic pattern if API supports it
            name: formData.name,
            description: formData.description,
            total_price: formData.total_price,
            voyage_hours: formData.voyage_hours,
            trip_type: formData.trip_type,
            city_id: formData.city_id,
            pax: formData.trip_type === "Fishing" && formData.pax ? formData.pax : undefined,
            guests_on_board: formData.trip_type === "Cruise" && formData.guests_on_board ? formData.guests_on_board : undefined,
            rooms_available: formData.trip_type === "Cruise" && formData.rooms_available ? formData.rooms_available : undefined,
            // Note: API wrapper createTrip/updateTrip might not support these primary image fields directly
            // unless updated. However, assuming similar backend logic or future update:
            primary_image_url: primaryExistingUrl || undefined,
            primary_new_image_index: !primaryExistingUrl ? primaryNewImageIndex : undefined,
        };

        // IMPORTANT: The current adminApi.createTrip/updateTrip helper uses a strictly typed object
        // that DOES NOT include primary_image_url/index. 
        // We might need to manually append these to FormData inside the API function or cast here if the API allows extras.
        // For now, let's assume the API function will just ignore them if not typed, 
        // BUT we need to pass them.
        // Let's rely on the previous Turn where I checked api.ts and it iterates Object.entries(tripData).
        // Since I'm using `any` cast above, it should pass these fields to FormData!

        let response;
        if (editingTrip) {
            response = await adminApi.updateTrip(
                editingTrip.id,
                tripData,
                newImages.length > 0 ? newImages : undefined,
                removedImageUrls.length > 0 ? removedImageUrls : undefined
            );
        } else {
            response = await adminApi.createTrip(tripData, newImages.length > 0 ? newImages : undefined);
        }

        if (response.success) {
            setShowModal(false);
            resetForm();
            fetchTrips();
            showSuccess(editingTrip ? "Trip updated successfully" : "Trip created successfully");
        } else {
            showError(response.error || "Failed to save trip");
        }
        setSaving(false);
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.tripId) return;

        setDeleting(true);
        const response = await adminApi.deleteTrip(confirmDelete.tripId);
        if (response.success) {
            fetchTrips();
            showSuccess("Trip deleted successfully");
        } else {
            showError(response.error || "Failed to delete trip");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, tripId: null });
        if (showModal) setShowModal(false); // Close modal if deleting from there
    };

    const handleViewTrip = async (tripId: number) => {
        setLoadingDetails(true);
        // Show partial data immediately if needed
        const listTrip = trips.find(t => t.id === tripId);
        if (listTrip) setViewDetailsTrip(listTrip);

        const response = await adminApi.getTrip(tripId);
        if (response.success && response.data) {
            setViewDetailsTrip(response.data);
        }
        setLoadingDetails(false);
    };

    const handleCloseDetailsModal = () => {
        setViewDetailsTrip(null);
        const returnTab = searchParams.get('returnTab');
        const returnOrderId = searchParams.get('returnOrderId');

        if (returnTab && returnOrderId) {
            router.push(`/admin-dashboard?tab=${returnTab}&openOrderId=${returnOrderId}`);
        } else {
            const params = new URLSearchParams(searchParams.toString());
            if (params.get('tripId')) {
                params.delete('tripId');
                router.push(`/admin-dashboard?${params.toString()}`);
            }
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EGP",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            Voyage: "bg-blue-100 text-blue-700",
            Fishing: "bg-green-100 text-green-700",
            Occasion: "bg-purple-100 text-purple-700",
            Cruise: "bg-orange-100 text-orange-700",
            Water_activities: "bg-cyan-100 text-cyan-700",
        };
        return colors[type] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {/* View Details Modal with Image Slider */}
            {viewDetailsTrip && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleCloseDetailsModal();
                    }}
                >
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6 pb-2 border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{viewDetailsTrip.name}</h2>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getTypeColor(viewDetailsTrip.trip_type).replace('text-', 'bg-opacity-20 text-')}`}>
                                        {viewDetailsTrip.trip_type}
                                    </span>
                                    • {viewDetailsTrip.city_name || "Unknown City"}
                                </p>
                            </div>
                            <button onClick={handleCloseDetailsModal} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>

                        {loadingDetails ? (
                            <div className="p-12 flex flex-col items-center justify-center space-y-3 flex-1 overflow-y-auto">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
                                <p className="text-sm text-gray-500">Loading trip details...</p>
                            </div>
                        ) : (
                            <div className="p-6 pt-4 flex-1 overflow-y-auto">
                                {/* Image Slider */}
                                <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100 group">
                                    {viewDetailsTrip.images && viewDetailsTrip.images.length > 0 ? (
                                        <>
                                            <Image
                                                src={viewDetailsTrip.images[currentImageIndex]}
                                                alt={`${viewDetailsTrip.name} - Image ${currentImageIndex + 1}`}
                                                fill
                                                className="object-cover transition-opacity duration-300"
                                                priority
                                            />
                                            {/* Navigation Arrows */}
                                            {viewDetailsTrip.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentImageIndex((prev) => (prev - 1 + viewDetailsTrip.images!.length) % viewDetailsTrip.images!.length);
                                                        }}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
                                                    >
                                                        <FiChevronLeft size={24} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentImageIndex((prev) => (prev + 1) % viewDetailsTrip.images!.length);
                                                        }}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-105 z-10"
                                                    >
                                                        <FiChevronRight size={24} />
                                                    </button>
                                                    {/* Indicators */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                        {viewDetailsTrip.images.map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setCurrentImageIndex(idx);
                                                                }}
                                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FiImage size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Details</h3>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Price</span>
                                                <span className="text-lg font-bold text-gray-900">{formatCurrency(viewDetailsTrip.total_price)}</span>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Duration</span>
                                                <span className="text-lg font-bold text-gray-900">{viewDetailsTrip.voyage_hours} Hours</span>
                                            </div>
                                            {/* Dynamic Fields */}
                                            {viewDetailsTrip.pax && (
                                                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Guests (Pax)</span>
                                                    <span className="text-lg font-bold text-gray-900">{viewDetailsTrip.pax}</span>
                                                </div>
                                            )}
                                            {viewDetailsTrip.guests_on_board && (
                                                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Guests on Board</span>
                                                    <span className="text-lg font-bold text-gray-900">{viewDetailsTrip.guests_on_board}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Description</h3>
                                        <p className="text-sm leading-relaxed text-gray-600">
                                            {viewDetailsTrip.description || "No description provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex-shrink-0">
                            <button
                                onClick={handleCloseDetailsModal}
                                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setViewDetailsTrip(null);
                                    openEditModal(viewDetailsTrip);
                                }}
                                className="px-6 py-2.5 text-sm font-medium bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200 flex items-center gap-2"
                            >
                                <FiEdit2 size={16} /> Edit Trip
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-8 justify-between gap-6">
                <div>
                    <p className="text-[#0A0A0A] font-bold text-xl">Trip Packages</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage your fleet's predefined trip packages and offerings.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <FiPlus size={18} /> New Trip
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search trips..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 text-gray-900 placeholder:text-gray-400"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={cityFilter || ""}
                        onChange={(e) => {
                            setCityFilter(e.target.value ? Number(e.target.value) : undefined);
                            setPage(1);
                        }}
                        className="bg-gray-50 px-5 py-3 rounded-xl text-sm font-medium text-gray-700 border-none outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Locations</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setPage(1);
                        }}
                        className="bg-gray-50 px-5 py-3 rounded-xl text-sm font-medium text-gray-700 border-none outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Types</option>
                        {TRIP_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border border-gray-100 rounded-2xl h-[320px] animate-pulse bg-gray-50 overflow-hidden">
                            <div className="h-48 bg-gray-200 w-full mb-4"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <FiMapPin className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No trips found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Get started by creating your first trip package.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Create Trip
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <div key={trip.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                            {/* Image Area */}
                            <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                                {trip.images?.[0] ? (
                                    <Image src={trip.images[0]} alt={trip.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                        <FiImage size={32} />
                                    </div>
                                )}
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                                {/* Badges */}
                                <div className="absolute top-3 right-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-sm">
                                        {trip.trip_type}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3 text-white">
                                    <div className="flex items-center gap-1.5 text-xs font-medium bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg">
                                        <FiClock size={12} />
                                        {trip.voyage_hours} hours
                                    </div>
                                </div>
                                <div className="absolute bottom-3 right-3">
                                    <span className="px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                                        {formatCurrency(trip.total_price)}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{trip.name}</h3>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <FiMapPin size={12} />
                                            {trip.city_name}
                                        </div>
                                    </div>
                                </div>



                                <div className="mt-auto pt-4 border-t border-gray-50">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewTrip(trip.id);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                    >
                                        <FiEye size={14} /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 hover:bg-gray-50 text-sm font-medium"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'details' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <FiEdit2 className="inline mr-2" /> Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('photos')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'photos' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <FiImage className="inline mr-2" /> Photos
                                </button>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">

                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Trip Details</h3>
                                        <p className="text-sm text-gray-500 mb-6">Basic information about this trip package.</p>

                                        {/* Name */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                placeholder="e.g. Sunset Felucca Ride"
                                            />
                                        </div>

                                        {/* Type & City */}
                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Type *</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.trip_type}
                                                        onChange={(e) => setFormData({ ...formData, trip_type: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                                                    >
                                                        {TRIP_TYPES.map((type) => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.city_id}
                                                        onChange={(e) => setFormData({ ...formData, city_id: Number(e.target.value) })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                                                    >
                                                        <option value={0}>Select City</option>
                                                        {cities.map((city) => (
                                                            <option key={city.id} value={city.id}>{city.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Price (EGP) *</label>
                                                <input
                                                    type="number"
                                                    value={formData.total_price}
                                                    onChange={(e) => setFormData({ ...formData, total_price: Number(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Hours) *</label>
                                                <input
                                                    type="number"
                                                    value={formData.voyage_hours}
                                                    onChange={(e) => setFormData({ ...formData, voyage_hours: Number(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        {/* Dynamic Fields based on Trip Type */}
                                        {formData.trip_type === "Fishing" && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Guests (Pax) *</label>
                                                <input
                                                    type="number"
                                                    value={formData.pax || ""}
                                                    onChange={(e) => setFormData({ ...formData, pax: e.target.value ? Number(e.target.value) : null })}
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                    placeholder="Number of guests"
                                                    min="1"
                                                />
                                            </div>
                                        )}

                                        {formData.trip_type === "Cruise" && (
                                            <div className="grid grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Guests on Board *</label>
                                                    <input
                                                        type="number"
                                                        value={formData.guests_on_board || ""}
                                                        onChange={(e) => setFormData({ ...formData, guests_on_board: e.target.value ? Number(e.target.value) : null })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                        min="1"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rooms Available *</label>
                                                    <input
                                                        type="number"
                                                        value={formData.rooms_available || ""}
                                                        onChange={(e) => setFormData({ ...formData, rooms_available: e.target.value ? Number(e.target.value) : null })}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                                        min="1"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                                rows={4}
                                                placeholder="Describe the trip experience..."
                                            />
                                        </div>

                                        {/* Danger Zone - Only show when editing */}
                                        {editingTrip && (
                                            <div className="mt-8 pt-8 border-t border-gray-100">
                                                <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">Delete this trip</p>
                                                        <p className="text-xs text-red-500">This action cannot be undone.</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDelete({ isOpen: true, tripId: editingTrip.id })}
                                                        className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm flex items-center gap-2"
                                                    >
                                                        <FiTrash2 size={16} />
                                                        Delete Trip
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'photos' && (
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <FiImage size={20} className="text-gray-900" />
                                        <h3 className="text-lg font-bold text-gray-900">Manage Photos</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-6 font-bold flex justify-between items-center">
                                        Upload photos for this trip package.
                                        <span className="text-xs font-normal text-gray-500 flex items-center gap-1"><FiStar className="text-orange-400 fill-orange-400" /> = Primary photo</span>
                                    </p>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group mb-8"
                                    >
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 group-hover:scale-110 transition-transform">
                                            <FiUpload size={24} />
                                        </div>
                                        <h4 className="text-base font-semibold text-gray-900 mb-1">Drag and drop photos here, or <span className="text-blue-600">browse</span></h4>
                                        <button className="mt-4 px-6 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-medium shadow-sm group-hover:shadow-md transition-all">
                                            + Choose Photos
                                        </button>
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, i) => {
                                            const existingImagesCount = editingTrip?.images?.length || 0;
                                            const removedExistingCount = removedImageUrls.length;
                                            const remainingExistingCount = existingImagesCount - removedExistingCount;

                                            const isExistingImage = i < remainingExistingCount;
                                            const isNewImage = !isExistingImage;

                                            const isSelectedPrimary =
                                                (isExistingImage && preview === primaryExistingUrl) ||
                                                (isNewImage && (i - remainingExistingCount) === primaryNewImageIndex && !primaryExistingUrl);

                                            return (
                                                <div key={i} className={`relative aspect-[4/3] rounded-xl overflow-hidden group border-2 ${isSelectedPrimary ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'}`}>
                                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                                    <button
                                                        onClick={() => removeImage(i)}
                                                        className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-lg p-1.5 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>

                                                    {/* Bottom Left: Primary Badge or Button */}
                                                    <div className="absolute bottom-2 left-2 right-2 z-10">
                                                        {isSelectedPrimary ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-400 text-white text-[10px] font-bold rounded shadow-sm">
                                                                <FiStar size={10} fill="currentColor" /> Primary
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    if (isExistingImage) {
                                                                        setPrimaryExistingUrl(preview);
                                                                        setPrimaryNewImageIndex(0); // Reset new image primary index
                                                                    } else { // It's a new image
                                                                        setPrimaryExistingUrl(null);
                                                                        const newImgIndex = i - remainingExistingCount;
                                                                        setPrimaryNewImageIndex(newImgIndex);
                                                                    }
                                                                }}
                                                                className="w-full py-1.5 bg-white/90 text-gray-900 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                                            >
                                                                Set Primary
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-6 py-2.5 text-sm font-medium bg-[#0F172A] text-white rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200 flex items-center gap-2"
                            >
                                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {editingTrip ? "Update Trip" : "Create Trip"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete Trip"
                message="Are you sure you want to delete this trip? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, tripId: null })}
                isLoading={deleting}
            />
        </div>
    );
}
