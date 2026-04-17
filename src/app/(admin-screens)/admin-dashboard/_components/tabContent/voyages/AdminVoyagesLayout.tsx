"use client";
import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import { FiCalendar, FiAnchor, FiTrash2 } from "react-icons/fi";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";
import { TableSkeleton } from "../../Skeleton";

interface Voyage {
    id: number;
    boat_id: number;
    boat_name: string | null;
    voyage_type: string;
    start_date: string;
    end_date: string;
    price_per_hour: number;
    status: string;
    created_at: string;
}

export default function AdminVoyagesLayout() {
    const { showSuccess, showError } = useToast();
    const [voyages, setVoyages] = useState<Voyage[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; voyageId: number | null }>({
        isOpen: false,
        voyageId: null
    });
    const [deleting, setDeleting] = useState(false);

    const fetchVoyages = useCallback(async () => {
        setLoading(true);
        const filters: { status?: string; voyage_type?: string } = {};
        if (statusFilter) filters.status = statusFilter;
        if (typeFilter) filters.voyage_type = typeFilter;

        const response = await adminApi.getVoyages(page, 10, filters);
        if (response.success && response.data) {
            setVoyages(response.data.voyages);
            setTotalPages(response.data.pages);
        }
        setLoading(false);
    }, [page, statusFilter, typeFilter]);

    useEffect(() => {
        fetchVoyages();
    }, [fetchVoyages]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleDeleteClick = (voyageId: number) => {
        setConfirmDelete({ isOpen: true, voyageId });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.voyageId) return;

        setDeleting(true);
        const response = await adminApi.deleteVoyage(confirmDelete.voyageId);
        if (response.success) {
            fetchVoyages();
            showSuccess("Voyage deleted successfully");
        } else {
            showError(response.error || "Failed to delete voyage");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, voyageId: null });
    };

    const statusColors: Record<string, string> = {
        available: "bg-green-100 text-green-700",
        booked: "bg-blue-100 text-blue-700",
        completed: "bg-gray-100 text-gray-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const typeColors: Record<string, string> = {
        hourly: "bg-purple-100 text-purple-700",
        daily: "bg-indigo-100 text-indigo-700",
        trip: "bg-teal-100 text-teal-700",
    };

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-medium text-lg">Voyages Management</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage boat availability and scheduled voyages ({voyages.length} shown)
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
                    aria-label="Filter by status"
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => {
                        setTypeFilter(e.target.value);
                        setPage(1);
                    }}
                    className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
                    aria-label="Filter by type"
                >
                    <option value="">All Types</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="trip">Trip</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <TableSkeleton rows={5} columns={6} />
            ) : voyages.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiCalendar className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No voyages found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Voyages will appear here when boats have scheduled availability.
                    </p>
                    {(statusFilter || typeFilter) && (
                        <button
                            onClick={() => {
                                setStatusFilter("");
                                setTypeFilter("");
                            }}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {["Boat", "Type", "Period", "Price/Hour", "Status", "Actions"].map((h) => (
                                    <th key={h} className="py-3 px-4 text-sm font-semibold text-gray-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {voyages.map((voyage) => (
                                <tr key={voyage.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <FiAnchor className="text-blue-600" />
                                            <span className="font-medium">{voyage.boat_name || `Boat #${voyage.boat_id}`}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColors[voyage.voyage_type] || "bg-gray-100"}`}>
                                            {voyage.voyage_type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        <div className="flex flex-col">
                                            <span>{formatDate(voyage.start_date)}</span>
                                            <span className="text-xs text-gray-400">to {formatDate(voyage.end_date)}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-blue-600">
                                        {formatCurrency(voyage.price_per_hour)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[voyage.status] || "bg-gray-100"}`}>
                                            {voyage.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleDeleteClick(voyage.id)}
                                            className="p-1 hover:bg-red-50 rounded text-red-600"
                                            title="Delete"
                                            aria-label={`Delete voyage #${voyage.id}`}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
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

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete Voyage"
                message="Are you sure you want to delete this voyage? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, voyageId: null })}
                isLoading={deleting}
            />
        </div>
    );
}
