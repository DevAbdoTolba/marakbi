"use client";
import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api";
import { FiStar, FiTrash2, FiSearch, FiUser, FiAnchor } from "react-icons/fi";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";

interface BoatReview {
    id: number;
    boat_id: number;
    boat_name: string | null;
    user_id: number;
    username: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function AdminReviewsLayout() {
    const { showSuccess, showError } = useToast();
    const [reviews, setReviews] = useState<BoatReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ratingFilter, setRatingFilter] = useState<number | "">("");

    // Confirm delete state
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; reviewId: number | null }>({
        isOpen: false,
        reviewId: null
    });
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const response = await adminApi.getBoatReviews(page, 10);
        if (response.success && response.data) {
            let filteredReviews = response.data.reviews;
            // Client-side filtering by rating (ideally this would be server-side)
            if (ratingFilter !== "") {
                filteredReviews = filteredReviews.filter((r: BoatReview) => r.rating === ratingFilter);
            }
            setReviews(filteredReviews);
            setTotalPages(response.data.pages);
        }
        setLoading(false);
    }, [page, ratingFilter]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDeleteClick = (reviewId: number) => {
        setConfirmDelete({ isOpen: true, reviewId });
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete.reviewId) return;

        setDeleting(true);
        const response = await adminApi.deleteBoatReview(confirmDelete.reviewId);
        if (response.success) {
            fetchReviews();
            showSuccess("Review deleted successfully");
        } else {
            showError(response.error || "Failed to delete review");
        }
        setDeleting(false);
        setConfirmDelete({ isOpen: false, reviewId: null });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                        key={star}
                        size={14}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    const ratingColors: Record<number, string> = {
        1: "bg-red-100 text-red-700",
        2: "bg-orange-100 text-orange-700",
        3: "bg-yellow-100 text-yellow-700",
        4: "bg-green-100 text-green-700",
        5: "bg-emerald-100 text-emerald-700",
    };

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
                <div>
                    <p className="text-[#0A0A0A] font-medium text-lg">Reviews Moderation</p>
                    <p className="text-[#717182] font-normal text-sm">
                        Manage and moderate boat reviews ({reviews.length} shown)
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <select
                    value={ratingFilter}
                    onChange={(e) => {
                        setRatingFilter(e.target.value === "" ? "" : Number(e.target.value));
                        setPage(1);
                    }}
                    className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
                >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4 animate-pulse">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                                <div className="w-8 h-8 bg-gray-200 rounded lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiStar className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Reviews will appear here when customers leave feedback on their trips.
                    </p>
                    {ratingFilter !== "" && (
                        <button
                            onClick={() => setRatingFilter("")}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Clear rating filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    {/* Header Row */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <FiUser size={14} className="text-gray-400" />
                                            <span className="font-medium text-gray-900">{review.username}</span>
                                        </div>
                                        <span className="text-gray-300">→</span>
                                        <div className="flex items-center gap-1.5">
                                            <FiAnchor size={14} className="text-gray-400" />
                                            <span className="text-gray-700">{review.boat_name}</span>
                                        </div>
                                    </div>

                                    {/* Rating & Date */}
                                    <div className="flex items-center gap-3 mb-2">
                                        {renderStars(review.rating)}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ratingColors[review.rating]}`}>
                                            {review.rating}/5
                                        </span>
                                        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                                    </div>

                                    {/* Comment */}
                                    {review.comment && (
                                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                    )}
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteClick(review.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Delete review"
                                    aria-label={`Delete review by ${review.username}`}
                                >
                                    <FiTrash2 size={18} />
                                </button>
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

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDelete({ isOpen: false, reviewId: null })}
                isLoading={deleting}
            />
        </div>
    );
}
