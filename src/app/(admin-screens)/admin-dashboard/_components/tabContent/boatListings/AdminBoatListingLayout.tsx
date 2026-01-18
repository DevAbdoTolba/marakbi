"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi, AdminBoat, AdminCategory } from "@/lib/api";
import { FiEdit2, FiTrash2, FiSearch, FiImage, FiX, FiUpload } from "react-icons/fi";
import Image from "next/image";

interface BoatFormData {
  name: string;
  price_per_hour: number;
  price_per_day: number | null;
  max_seats: number;
  max_seats_stay: number;
  description: string;
  categories: number[];
  cities: number[];
  user_id: number;
}

export default function AdminBoatListingLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [boats, setBoats] = useState<AdminBoat[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [editingBoat, setEditingBoat] = useState<AdminBoat | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BoatFormData>({
    name: "",
    price_per_hour: 0,
    price_per_day: null,
    max_seats: 10,
    max_seats_stay: 6,
    description: "",
    categories: [],
    cities: [],
    user_id: 1,
  });

  // User filter from URL
  const [userFilter, setUserFilter] = useState<number | undefined>();
  const [userFilterName, setUserFilterName] = useState<string>("");

  // Read user param from URL on mount
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId && !searchParams.get("action")) {
      setUserFilter(parseInt(userId, 10));
      // Fetch user name for display
      adminApi.getUser(parseInt(userId, 10)).then((res) => {
        if (res.success && res.data) {
          setUserFilterName(res.data.username);
        }
      });
    }
  }, [searchParams]);

  const fetchBoats = useCallback(async () => {
    setLoading(true);
    const filters: { search?: string; category_id?: number; user_id?: number } = {};
    if (search) filters.search = search;
    if (categoryFilter) filters.category_id = categoryFilter;
    if (userFilter) filters.user_id = userFilter;

    const response = await adminApi.getBoats(page, 10, filters);
    if (response.success && response.data) {
      setBoats(response.data.boats);
      setTotalPages(response.data.pages);
    }
    setLoading(false);
  }, [page, search, categoryFilter, userFilter]);

  const fetchCategories = async () => {
    const response = await adminApi.getCategories();
    if (response.success && response.data) {
      setCategories(response.data.categories);
    }
  };

  const fetchCities = async () => {
    const response = await adminApi.getCities();
    if (response.success && response.data) {
      setCities(response.data.cities);
    }
  };

  useEffect(() => {
    fetchBoats();
    fetchCategories();
    fetchCities();
  }, [fetchBoats]);

  // Handle URL parameters - auto-open Add Boat modal when action=add&user=X
  useEffect(() => {
    const action = searchParams.get("action");
    const userId = searchParams.get("user");

    if (action === "add" && userId) {
      setEditingBoat(null);
      setFormData({
        name: "",
        price_per_hour: 0,
        price_per_day: null,
        max_seats: 10,
        max_seats_stay: 6,
        description: "",
        categories: [],
        cities: [],
        user_id: parseInt(userId, 10),
      });
      setNewImages([]);
      setImagePreviews([]);
      setShowModal(true);

      // Clear URL params to prevent modal from reopening on refresh
      router.replace("/admin-dashboard?tab=boat-listings", { scroll: false });
    }
  }, [searchParams, router]);

  const resetForm = () => {
    setFormData({
      name: "",
      price_per_hour: 0,
      price_per_day: null,
      max_seats: 10,
      max_seats_stay: 6,
      description: "",
      categories: [],
      cities: [],
      user_id: 1,
    });
    setNewImages([]);
    setImagePreviews([]);
  };

  const openCreateModal = () => {
    setEditingBoat(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = async (boat: AdminBoat) => {
    setEditingBoat(boat);
    setRemovedImageUrls([]); // Reset removed images
    // Fetch full boat details
    const response = await adminApi.getBoat(boat.id);
    if (response.success && response.data) {
      const data = response.data;
      // Extract city IDs from the cities array that contains {id, name} objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cityIds = ((data as any).cities as { id: number; name: string }[])?.map((c) => c.id) || [];
      setFormData({
        name: data.name,
        price_per_hour: data.price_per_hour,
        price_per_day: data.price_per_day,
        max_seats: data.max_seats,
        max_seats_stay: data.max_seats_stay,
        description: data.description || "",
        categories: data.categories_full?.map((c) => c.id) || [],
        cities: cityIds,
        user_id: data.owner?.id || 1,
      });
      setImagePreviews(data.images || []);
    }
    setShowModal(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = async (index: number) => {
    const imageUrl = imagePreviews[index];
    const existingImagesCount = editingBoat?.images?.length || 0;
    // Count how many existing images have already been removed
    const removedExistingCount = removedImageUrls.length;
    const remainingExistingCount = existingImagesCount - removedExistingCount;

    // If this is an existing server image (not a new upload preview)
    if (index < remainingExistingCount && editingBoat?.images?.includes(imageUrl)) {
      setRemovedImageUrls((prev) => [...prev, imageUrl]);
      console.log("Marked for removal:", imageUrl);
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // If it's a new image (after existing ones), remove from newImages
    if (index >= remainingExistingCount) {
      const newIndex = index - remainingExistingCount;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price_per_hour) {
      alert("Please fill in required fields (name and price per hour)");
      return;
    }

    setSaving(true);

    const boatData = {
      name: formData.name,
      price_per_hour: formData.price_per_hour,
      price_per_day: formData.price_per_day || undefined,
      max_seats: formData.max_seats,
      max_seats_stay: formData.max_seats_stay,
      description: formData.description,
      categories: formData.categories,
      cities: formData.cities,
      boat_images: newImages.length > 0 ? newImages : undefined,
      removed_images: removedImageUrls.length > 0 ? removedImageUrls : undefined,
    };

    let response;
    if (editingBoat) {
      response = await adminApi.updateBoat(editingBoat.id, boatData);
    } else {
      response = await adminApi.createBoat(formData.user_id, boatData);
    }

    if (response.success) {
      setShowModal(false);
      resetForm();
      setRemovedImageUrls([]);
      fetchBoats();
    } else {
      alert(response.error || "Failed to save boat");
    }
    setSaving(false);
  };

  const handleDelete = async (boatId: number) => {
    if (!confirm("Are you sure you want to delete this boat? This action cannot be undone.")) return;
    const response = await adminApi.deleteBoat(boatId);
    if (response.success) {
      fetchBoats();
    } else {
      alert(response.error || "Failed to delete boat");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-[15.09px] p-[26px]">
      {/* User Filter Banner */}
      {userFilter && userFilterName && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-medium">
              Showing boats owned by: {userFilterName}
            </span>
          </div>
          <button
            onClick={() => {
              setUserFilter(undefined);
              setUserFilterName("");
              router.replace("/admin-dashboard?tab=boat-listings", { scroll: false });
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            <FiX size={16} /> Clear Filter
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-medium text-lg">Boat Listings</p>
          <p className="text-[#717182] font-normal text-sm">
            Manage all boat listings ({boats.length} shown)
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="bg-[#F3F3F5] flex items-center gap-2 px-3 py-2 rounded-lg flex-1">
          <FiSearch className="text-[#717182]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search boats..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <select
          value={categoryFilter || ""}
          onChange={(e) => {
            setCategoryFilter(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : boats.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No boats found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boats.map((boat) => (
            <div key={boat.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
              <div className="relative h-40 bg-gray-100">
                {boat.images?.[0] ? (
                  <Image src={boat.images[0]} alt={boat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiImage size={40} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {boat.categories?.slice(0, 2).map((cat, i) => (
                    <span key={i} className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{boat.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Owner: {boat.owner_username || "Unknown"}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 font-medium">
                    {formatCurrency(boat.price_per_hour)}/hr
                  </span>
                  <span className="text-gray-500">
                    {boat.max_seats} seats
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => openEditModal(boat)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(boat.id)}
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
                {editingBoat ? "Edit Boat" : "Add New Boat"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Boat Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter boat name"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Hour * ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({ ...formData, price_per_hour: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Day ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price_per_day || ""}
                    onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Seats (Day)
                  </label>
                  <input
                    type="number"
                    value={formData.max_seats}
                    onChange={(e) => setFormData({ ...formData, max_seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Seats (Stay)
                  </label>
                  <input
                    type="number"
                    value={formData.max_seats_stay}
                    onChange={(e) => setFormData({ ...formData, max_seats_stay: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="1"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows={4}
                  placeholder="Describe the boat..."
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        const newCategories = formData.categories.includes(cat.id)
                          ? formData.categories.filter((id) => id !== cat.id)
                          : [...formData.categories, cat.id];
                        setFormData({ ...formData, categories: newCategories });
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition ${formData.categories.includes(cat.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cities
                </label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => {
                        const newCities = formData.cities.includes(city.id)
                          ? formData.cities.filter((id) => id !== city.id)
                          : [...formData.cities, city.id];
                        setFormData({ ...formData, cities: newCities });
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition ${formData.cities.includes(city.id)
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
                        }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
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
                {editingBoat ? "Update Boat" : "Create Boat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
