"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { adminApi, AdminCategory } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiX, FiUpload } from "react-icons/fi";
import Image from "next/image";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";

export default function AdminCategoriesLayout() {
    const { showSuccess, showError } = useToast();
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; categoryId: number | null; categoryName: string }>({
        isOpen: false,
        categoryId: null,
        categoryName: ""
    });
    const [deleting, setDeleting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const response = await adminApi.getCategories();
        if (response.success && response.data) {
            setCategories(response.data.categories);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const openCreateModal = () => {
        setEditingCategory(null);
        setCategoryName("");
        setCategoryImage(null);
        setImagePreview("");
        setShowModal(true);
    };

    const openEditModal = (category: AdminCategory) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setCategoryImage(null);
        setImagePreview(category.image || "");
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCategoryImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!categoryName.trim()) {
            showError("Please enter a category name");
            return;
        }

        setSaving(true);

        let response;
        if (editingCategory) {
            response = await adminApi.updateCategory(editingCategory.id, categoryName, categoryImage || undefined);
        } else {
            response = await adminApi.createCategory(categoryName, categoryImage || undefined);
        }

        if (response.success) {
            setShowModal(false);
            setCategoryName("");
            setCategoryImage(null);
            setImagePreview("");
            setEditingCategory(null);
            fetchCategories();
            showSuccess(editingCategory ? "Category updated successfully" : "Category created successfully");
        } else {
            showError(response.error || "Failed to save category");
        }
        setSaving(false);
    };

    const handleDeleteClick = (category: AdminCategory) => {
        setConfirmDelete({ isOpen: true, categoryId: category.id, categoryName: category.name });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.categoryId) return;

        setDeleting(true);
        const response = await adminApi.deleteCategory(confirmDelete.categoryId);
        if (response.success) {
            fetchCategories();
            showSuccess("Category deleted successfully");
        } else {
            showError(response.error || "Failed to delete category");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, categoryId: null, categoryName: "" });
    };

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-medium text-lg">Categories Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage boat categories ({categories.length} categories)
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <FiPlus /> Add Category
                </button>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border rounded-xl p-4 h-[120px] animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiTag className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Organize your boats by adding categories like 'Yacht', 'Speedboat', etc.
                    </p>
                    <button
                        onClick={openCreateModal}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Add your first category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white">
                                    {category.image ? (
                                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiTag size={24} className="text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <p className="text-xs text-gray-500">{(category as AdminCategory & { boats_count?: number }).boats_count || 0} boats</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-blue-100">
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-white rounded transition"
                                    aria-label={`Edit ${category.name}`}
                                >
                                    <FiEdit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(category)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                                    aria-label={`Delete ${category.name}`}
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
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setCategoryName("");
                                    setCategoryImage(null);
                                    setImagePreview("");
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter category name"
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Image
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-400"
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-32">
                                            <Image src={imagePreview} alt="Preview" fill className="object-contain rounded" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <FiUpload size={24} />
                                            <span className="text-sm">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setCategoryName("");
                                    setCategoryImage(null);
                                    setImagePreview("");
                                }}
                                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {editingCategory ? "Update Category" : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete Category"
                message={`Are you sure you want to delete "${confirmDelete.categoryName}"? This may affect boats associated with it.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, categoryId: null, categoryName: "" })}
                isLoading={deleting}
            />
        </div>
    );
}
