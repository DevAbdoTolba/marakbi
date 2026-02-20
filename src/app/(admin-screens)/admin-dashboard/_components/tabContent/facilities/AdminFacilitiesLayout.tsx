"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { adminApi, BoatFacilityDef } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload, FiHelpCircle, FiGrid } from "react-icons/fi";
import Image from "next/image";
import ConfirmModal from "../../ConfirmModal";
import { useToast } from "../../ToastProvider";

interface FacilityFormData {
    name: string;
    description: string;
}

export default function AdminFacilitiesLayout() {
    const { showSuccess, showError } = useToast();
    const [facilities, setFacilities] = useState<BoatFacilityDef[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState<BoatFacilityDef | null>(null);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; facilityId: number | null }>({ isOpen: false, facilityId: null });
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState<FacilityFormData>({
        name: "",
        description: "",
    });

    const fetchFacilities = useCallback(async () => {
        setLoading(true);
        const response = await adminApi.getFacilities();
        if (response.success && response.data) {
            setFacilities(response.data.facilities);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingFacility(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (facility: BoatFacilityDef) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            description: facility.description || "",
        });
        setImagePreview(facility.image_url);
        setImageFile(null);
        setShowModal(true);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showError("Facility name is required");
            return;
        }
        setSaving(true);

        try {
            let response;
            if (editingFacility) {
                response = await adminApi.updateFacility(
                    editingFacility.id,
                    {
                        name: formData.name,
                        description: formData.description,
                        image_url: editingFacility.image_url || undefined,
                    },
                    imageFile || undefined
                );
            } else {
                response = await adminApi.createFacility(
                    {
                        name: formData.name,
                        description: formData.description,
                    },
                    imageFile || undefined
                );
            }

            if (response.success) {
                showSuccess(editingFacility ? "Facility updated successfully" : "Facility created successfully");
                setShowModal(false);
                resetForm();
                fetchFacilities();
            } else {
                showError(response.error || "Failed to save facility");
            }
        } catch {
            showError("An error occurred");
        }
        setSaving(false);
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.facilityId) return;
        setDeleting(true);
        const response = await adminApi.deleteFacility(confirmDelete.facilityId);
        if (response.success) {
            fetchFacilities();
            showSuccess("Facility deleted successfully");
        } else {
            showError(response.error || "Failed to delete facility");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, facilityId: null });
    };

    const filteredFacilities = facilities.filter(
        (f) =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            (f.description || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[#0A0A0A] font-bold text-xl">Boat Facilities</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage facilities available on boats. These appear as feature badges on the boat details page.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#1E293B] text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors text-sm font-medium shadow-lg shadow-gray-200"
                >
                    <FiPlus size={16} /> Add Facility
                </button>
            </div>

            {/* Search */}
            <div className="bg-gray-50 flex items-center gap-3 px-4 py-2.5 rounded-lg max-w-md border border-transparent focus-within:border-gray-200 transition-colors">
                <FiSearch className="text-gray-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search facilities..."
                    className="bg-transparent outline-none text-sm text-gray-900 w-full placeholder:text-gray-500"
                />
            </div>

            {/* Facilities Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse h-40">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : filteredFacilities.length === 0 ? (
                <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <FiHelpCircle className="mx-auto mb-3 text-gray-300" size={40} />
                    <p className="text-gray-500 text-sm">
                        {search ? "No facilities match your search." : "No facilities created yet. Click 'Add Facility' to get started."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFacilities.map((facility) => (
                        <div
                            key={facility.id}
                            className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group relative"
                        >
                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(facility)}
                                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                    title="Edit"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => setConfirmDelete({ isOpen: true, facilityId: facility.id })}
                                    className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>

                            {/* Image + Name */}
                            <div className="flex items-center gap-3 mb-3">
                                {facility.image_url ? (
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                        <Image src={facility.image_url} alt={facility.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <FiGrid className="text-emerald-500" size={18} />
                                    </div>
                                )}
                                <h3 className="font-bold text-gray-900 text-sm truncate">{facility.name}</h3>
                            </div>

                            {/* Description */}
                            {facility.description && (
                                <p className="text-xs text-gray-500 line-clamp-2">{facility.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingFacility ? "Edit Facility" : "Create Facility"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Facility Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="e.g. Wi-Fi, Air Conditioning, Swimming Pool"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                    <span className="text-gray-400 font-normal text-xs ml-1">(shown as tooltip on hover)</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                    rows={3}
                                    placeholder="Describe this facility..."
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Image
                                    <span className="text-gray-400 font-normal text-xs ml-1">(optional, shown as facility icon)</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    {imagePreview ? (
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                                            <button
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                            >
                                                <FiX size={10} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                                        >
                                            <FiUpload className="text-gray-400" size={20} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            {imagePreview ? "Change image" : "Upload image"}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG. Max 2MB.</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50/50">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="px-6 py-2.5 text-gray-700 font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-6 py-2.5 bg-[#1E293B] text-white font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-gray-200"
                            >
                                {saving ? "Saving..." : editingFacility ? "Update Facility" : "Create Facility"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete Facility"
                message="Are you sure you want to delete this facility? It will be removed from all boats that use it."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, facilityId: null })}
                isLoading={deleting}
            />
        </div>
    );
}
