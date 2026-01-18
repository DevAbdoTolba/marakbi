"use client";
import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiX } from "react-icons/fi";

interface City {
    id: number;
    name: string;
    created_at: string;
}

export default function AdminCitiesLayout() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [cityName, setCityName] = useState("");
    const [saving, setSaving] = useState(false);

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
            alert("Please enter a city name");
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
        } else {
            alert(response.error || "Failed to save city");
        }
        setSaving(false);
    };

    const handleDelete = async (cityId: number) => {
        if (!confirm("Are you sure you want to delete this city? This may affect boats and trips associated with it.")) return;
        const response = await adminApi.deleteCity(cityId);
        if (response.success) {
            fetchCities();
        } else {
            alert(response.error || "Failed to delete city");
        }
    };

    return (
        <div className="bg-white rounded-[15.09px] p-[26px]">
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
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : cities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <FiMapPin size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No cities found</p>
                    <p className="text-sm">Add your first city to get started</p>
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
                                        <p className="text-xs text-gray-500">
                                            Added {new Date(city.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-100">
                                <button
                                    onClick={() => openEditModal(city)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-white rounded transition"
                                >
                                    <FiEdit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(city.id)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
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
        </div>
    );
}
