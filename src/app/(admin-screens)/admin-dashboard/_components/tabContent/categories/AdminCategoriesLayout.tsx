import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi, AdminCategory } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiX, FiAnchor, FiUsers, FiUpload } from "react-icons/fi";
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
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; categoryId: number | null; categoryName: string }>({
        isOpen: false,
        categoryId: null,
        categoryName: ""
    });
    const [deleting, setDeleting] = useState(false);

    // Category Details Modal State
    const [selectedCategoryForDetails, setSelectedCategoryForDetails] = useState<AdminCategory | null>(null);
    const [categoryBoats, setCategoryBoats] = useState<any[]>([]);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Navigation
    const router = useRouter();
    const searchParams = useSearchParams();

    // Deep linking: Open category modal
    useEffect(() => {
        const categoryIdParam = searchParams.get('openCategoryId');
        if (categoryIdParam && categories.length > 0) {
            const categoryId = parseInt(categoryIdParam);
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                if (selectedCategoryForDetails?.id !== category.id) {
                    fetchCategoryDetails(category);
                }
            }
        } else {
            // URL param missing, ensure modal is closed
            if (selectedCategoryForDetails) {
                setSelectedCategoryForDetails(null);
            }
        }
    }, [searchParams, categories, selectedCategoryForDetails]);

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

    const fetchCategoryDetails = async (category: AdminCategory) => {
        setSelectedCategoryForDetails(category);
        setDetailsLoading(true);
        try {
            // Fetch boats for this category
            const boatsResponse = await adminApi.getBoats(1, 100, { category_id: category.id });
            if (boatsResponse.success && boatsResponse.data) {
                setCategoryBoats(boatsResponse.data.boats);
            }
        } catch (error) {
            showError("Failed to fetch category details");
        }
        setDetailsLoading(false);
    };

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
            if (selectedCategoryForDetails?.id === confirmDelete.categoryId) {
                router.push('/admin-dashboard?tab=categories');
                setSelectedCategoryForDetails(null);
            }
            fetchCategories();
            showSuccess("Category deleted successfully");
        } else {
            showError(response.error || "Failed to delete category");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, categoryId: null, categoryName: "" });
    };

    const navigateToDetails = (id: number) => {
        const returnCategoryId = selectedCategoryForDetails?.id;

        // Close modal
        setSelectedCategoryForDetails(null);

        // Navigate to boat tab with ID param AND return info
        const params = new URLSearchParams();
        params.set('tab', 'boat-listings');
        params.set('boatId', id.toString());

        // Add return param
        if (returnCategoryId) {
            params.set('returnToCategoryId', returnCategoryId.toString()); // Note: need to support this param in boat listing too? Or just reuse returnToCityId concept?
            // Actually, AdminBoatListingLayout supports 'returnToCityId'.
            // I should either update AdminBoatListingLayout to support 'returnToCategoryId' or hack it.
            // Let's implement 'returnToCategoryId' support in AdminBoatListingLayout next or rename to generic 'returnToId' and 'returnToType'.
            // For now, let's call it returnToCategoryId and I will update AdminBoatListingLayout.
        }

        router.push(`/admin-dashboard?${params.toString()}`);
    };

    // Helper for image url
    const getImageUrl = (item: any) => {
        if (item.images && item.images.length > 0) return item.images[0];
        if (item.primary_image_url) return item.primary_image_url;
        return null;
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-bold text-xl">Categories Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage boat categories ({categories.length} categories)
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <FiPlus size={18} /> Add Category
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
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 hover:shadow-lg transition cursor-pointer group"
                            onClick={() => router.push(`/admin-dashboard?tab=categories&openCategoryId=${category.id}`)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white shadow-sm">
                                    {category.image ? (
                                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiTag size={24} className="text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{category.boats_count || 0} boats</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-blue-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(category);
                                    }}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600 hover:bg-white rounded transition font-medium"
                                    aria-label={`Edit ${category.name}`}
                                >
                                    <FiEdit2 size={12} /> Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Details Modal */}
            {selectedCategoryForDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedCategoryForDetails.name}</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{categoryBoats.length} Boats</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDeleteClick(selectedCategoryForDetails)}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                                    title="Delete Category"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                                <button
                                    onClick={() => router.push('/admin-dashboard?tab=categories')}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX size={24} />
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
                                categoryBoats.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryBoats.map(boat => {
                                            const imgUrl = getImageUrl(boat);
                                            return (
                                                <div key={boat.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                                        {imgUrl ? (
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
                                                                onClick={() => navigateToDetails(boat.id)}
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
                                            <FiTag size={24} />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No boats found</h3>
                                        <p className="text-gray-500">There are no boats in the {selectedCategoryForDetails.name} category yet.</p>
                                    </div>
                                )
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
