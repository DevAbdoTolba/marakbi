"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { adminApi, BoatServiceDef } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload, FiDollarSign, FiHelpCircle, FiImage } from "react-icons/fi";
import Image from "next/image";
import ConfirmModal from "../../ConfirmModal";
import { useToast } from "../../ToastProvider";

const PRICE_MODES = [
  { value: "per_trip", label: "Per Trip" },
  { value: "per_person", label: "Per Person" },
  { value: "per_person_per_time", label: "Per Person / Hour (or Day)" },
];

interface ServiceFormData {
  name: string;
  description: string;
  default_price: number | null;
  price_mode: string;
}

export default function AdminServicesLayout() {
  const { showSuccess, showError } = useToast();
  const [services, setServices] = useState<BoatServiceDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<BoatServiceDef | null>(null);
  const [saving, setSaving] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; serviceId: number | null }>({ isOpen: false, serviceId: null });
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    default_price: null,
    price_mode: "per_trip",
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const response = await adminApi.getServices();
    if (response.success && response.data) {
      setServices(response.data.services);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const resetForm = () => {
    setFormData({ name: "", description: "", default_price: null, price_mode: "per_trip" });
    setIconFile(null);
    setIconPreview(null);
    setEditingService(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (service: BoatServiceDef) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      default_price: service.default_price,
      price_mode: service.price_mode,
    });
    setIconPreview(service.icon_url);
    setIconFile(null);
    setShowModal(true);
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setIconPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Service name is required");
      return;
    }
    setSaving(true);

    try {
      let response;
      if (editingService) {
        response = await adminApi.updateService(
          editingService.id,
          {
            name: formData.name,
            description: formData.description,
            default_price: formData.default_price,
            price_mode: formData.price_mode,
            icon_url: editingService.icon_url || undefined,
          },
          iconFile || undefined
        );
      } else {
        response = await adminApi.createService(
          {
            name: formData.name,
            description: formData.description,
            default_price: formData.default_price,
            price_mode: formData.price_mode,
          },
          iconFile || undefined
        );
      }

      if (response.success) {
        showSuccess(editingService ? "Service updated successfully" : "Service created successfully");
        setShowModal(false);
        resetForm();
        fetchServices();
      } else {
        showError(response.error || "Failed to save service");
      }
    } catch {
      showError("An error occurred");
    }
    setSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete.serviceId) return;
    setDeleting(true);
    const response = await adminApi.deleteService(confirmDelete.serviceId);
    if (response.success) {
      fetchServices();
      showSuccess("Service deleted successfully");
    } else {
      showError(response.error || "Failed to delete service");
    }
    setDeleting(false);
    setConfirmDelete({ isOpen: false, serviceId: null });
  };

  const getPriceModeLabel = (mode: string) => {
    return PRICE_MODES.find((m) => m.value === mode)?.label || mode;
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#0A0A0A] font-bold text-xl">Boat Services</p>
          <p className="text-[#717182] font-normal text-sm">
            Manage optional services that can be added to boats. These appear as badges on boat cards.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#1E293B] text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors text-sm font-medium shadow-lg shadow-gray-200"
        >
          <FiPlus size={16} /> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-50 flex items-center gap-3 px-4 py-2.5 rounded-lg max-w-md border border-transparent focus-within:border-gray-200 transition-colors">
        <FiSearch className="text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="bg-transparent outline-none text-sm text-gray-900 w-full placeholder:text-gray-500"
        />
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse h-48">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <FiHelpCircle className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-gray-500 text-sm">
            {search ? "No services match your search." : "No services created yet. Click 'Add Service' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group relative"
            >
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  title="Edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => setConfirmDelete({ isOpen: true, serviceId: service.id })}
                  className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-3">
                {service.icon_url ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    <Image src={service.icon_url} alt={service.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FiDollarSign className="text-blue-500" size={18} />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{service.name}</h3>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {getPriceModeLabel(service.price_mode)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {service.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.description}</p>
              )}

              {/* Price */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">Default Price</span>
                <span className="text-sm font-bold text-gray-900">
                  {service.default_price !== null && service.default_price !== undefined
                    ? `${service.default_price.toLocaleString()} EGP`
                    : "—"}
                </span>
              </div>
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
                {editingService ? "Edit Service" : "Create Service"}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="e.g. Fishing Equipment, DJ, Catering"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                  <span className="text-gray-400 font-normal text-xs ml-1">(shown as tooltip on boat card)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Describe what this service includes..."
                />
              </div>

              {/* Price Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing Model *</label>
                <select
                  value={formData.price_mode}
                  onChange={(e) => setFormData({ ...formData, price_mode: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  {PRICE_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Default Price (EGP)
                  <span className="text-gray-400 font-normal text-xs ml-1">(can be overridden per boat)</span>
                </label>
                <input
                  type="number"
                  value={formData.default_price ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      default_price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  min="0"
                  placeholder="e.g. 200"
                />
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon
                  <span className="text-gray-400 font-normal text-xs ml-1">(optional, shown on badge)</span>
                </label>
                <div className="flex items-center gap-4">
                  {iconPreview ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      <Image src={iconPreview} alt="Icon preview" fill className="object-cover" />
                      <button
                        onClick={() => {
                          setIconFile(null);
                          setIconPreview(null);
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
                      {iconPreview ? "Change icon" : "Upload icon"}
                    </button>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG. Max 2MB.</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconSelect}
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
                {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service? It will be removed from all boats that use it."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, serviceId: null })}
        isLoading={deleting}
      />
    </div>
  );
}
