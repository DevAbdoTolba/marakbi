"use client";
import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiX } from "react-icons/fi";
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
            fetchCities();
            showSuccess("City deleted successfully");
        } else {
            showError(response.error || "Failed to delete city");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, cityId: null, cityName: "" });
    };

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-medium text-lg">Cities Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage cities for boats and trips ({cities.length} total)
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <FiPlus /> Add City
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
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 hover:shadow-lg transition"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
                                    onClick={() => openEditModal(city)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-white rounded transition"
                                    aria-label={`Edit ${city.name}`}
                                >
                                    <FiEdit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(city)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                                    aria-label={`Delete ${city.name}`}
                                >
                                    <FiTrash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
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
