"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { adminApi, AdminTrip } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiX, FiUpload, FiClock, FiDollarSign } from "react-icons/fi";
import Image from "next/image";

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
    }, [fetchTrips]);

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
    };

    const openCreateModal = () => {
        setEditingTrip(null);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = async (trip: AdminTrip) => {
        setEditingTrip(trip);
        setRemovedImageUrls([]); // Reset removed images
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
        // Count how many existing images have already been removed
        const removedExistingCount = removedImageUrls.length;
        const remainingExistingCount = existingImagesCount - removedExistingCount;

        // If this is an existing server image (not a new upload preview)
        if (index < remainingExistingCount && editingTrip?.images?.includes(imageUrl)) {
            setRemovedImageUrls((prev) => [...prev, imageUrl]);
        }

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));

        // If it's a new image (after existing ones), remove from newImages
        if (index >= remainingExistingCount) {
            const newIndex = index - remainingExistingCount;
            setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.total_price || !formData.city_id) {
            alert("Please fill in required fields (name, price, and city)");
            return;
        }

        setSaving(true);

        const tripData = {
            name: formData.name,
            description: formData.description,
            total_price: formData.total_price,
            voyage_hours: formData.voyage_hours,
            trip_type: formData.trip_type,
            city_id: formData.city_id,
            pax: formData.trip_type === "Fishing" && formData.pax ? formData.pax : undefined,
            guests_on_board: formData.trip_type === "Cruise" && formData.guests_on_board ? formData.guests_on_board : undefined,
            rooms_available: formData.trip_type === "Cruise" && formData.rooms_available ? formData.rooms_available : undefined,
        };

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
        } else {
            alert(response.error || "Failed to save trip");
        }
        setSaving(false);
    };

    const handleDelete = async (tripId: number) => {
        if (!confirm("Are you sure you want to delete this trip?")) return;
        const response = await adminApi.deleteTrip(tripId);
        if (response.success) {
            fetchTrips();
        } else {
            alert(response.error || "Failed to delete trip");
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
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
        <div className="bg-white rounded-[15.09px] p-[26px]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-medium text-lg">Trips Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage all trip packages ({trips.length} shown)
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <FiPlus /> Add Trip
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <select
                    value={cityFilter || ""}
                    onChange={(e) => {
                        setCityFilter(e.target.value ? Number(e.target.value) : undefined);
                        setPage(1);
                    }}
                    className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
                >
                    <option value="">All Cities</option>
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
                    className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
                >
                    <option value="">All Types</option>
                    {TRIP_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No trips found</p>
                    <p className="text-sm">Create your first trip to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
                            <div className="relative h-40 bg-gray-100">
                                {trip.images?.[0] ? (
                                    <Image src={trip.images[0]} alt={trip.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FiImage size={40} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(trip.trip_type)}`}>
                                        {trip.trip_type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-gray-900 truncate">{trip.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{trip.city_name}</p>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                                        <FiDollarSign size={14} />
                                        {formatCurrency(trip.total_price)}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-500">
                                        <FiClock size={14} />
                                        {trip.voyage_hours}h
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                                    <button
                                        onClick={() => openEditModal(trip)}
                                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(trip.id)}
                                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                            <h2 className="text-xl font-semibold">
                                {editingTrip ? "Edit Trip" : "Add New Trip"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter trip name"
                                />
                            </div>

                            {/* Type & City */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type *</label>
                                    <select
                                        value={formData.trip_type}
                                        onChange={(e) => setFormData({ ...formData, trip_type: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        {TRIP_TYPES.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <select
                                        value={formData.city_id}
                                        onChange={(e) => setFormData({ ...formData, city_id: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value={0}>Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Price & Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Price ($) *</label>
                                    <input
                                        type="number"
                                        value={formData.total_price}
                                        onChange={(e) => setFormData({ ...formData, total_price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours) *</label>
                                    <input
                                        type="number"
                                        value={formData.voyage_hours}
                                        onChange={(e) => setFormData({ ...formData, voyage_hours: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Conditional Fields */}
                            {formData.trip_type === "Fishing" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAX (Passengers)</label>
                                    <input
                                        type="number"
                                        value={formData.pax || ""}
                                        onChange={(e) => setFormData({ ...formData, pax: e.target.value ? Number(e.target.value) : null })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        min="1"
                                    />
                                </div>
                            )}

                            {formData.trip_type === "Cruise" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guests On Board</label>
                                        <input
                                            type="number"
                                            value={formData.guests_on_board || ""}
                                            onChange={(e) => setFormData({ ...formData, guests_on_board: e.target.value ? Number(e.target.value) : null })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rooms Available</label>
                                        <input
                                            type="number"
                                            value={formData.rooms_available || ""}
                                            onChange={(e) => setFormData({ ...formData, rooms_available: e.target.value ? Number(e.target.value) : null })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg resize-none"
                                    rows={3}
                                    placeholder="Describe the trip..."
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {imagePreviews.map((preview, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <Image src={preview} alt="Preview" fill className="object-cover" />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <FiX size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
                                    >
                                        <FiUpload size={24} />
                                        <span className="text-xs mt-1">Add</span>
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {editingTrip ? "Update Trip" : "Create Trip"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
