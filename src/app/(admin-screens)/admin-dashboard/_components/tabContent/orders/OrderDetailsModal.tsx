"use client";
import React from "react";
import { AdminOrder } from "@/lib/api";
import { FiX, FiUser, FiCalendar, FiDollarSign, FiAnchor } from "react-icons/fi";
import Image from "next/image";

interface OrderDetailsModalProps {
    order: AdminOrder | null;
    onClose: () => void;
    onStatusChange: (orderId: number, status: string) => void;
    onPaymentStatusChange: (orderId: number, paymentStatus: string) => void;
}

export default function OrderDetailsModal({
    order,
    onClose,
    onStatusChange,
    onPaymentStatusChange,
}: OrderDetailsModalProps) {
    if (!order) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const calculateDays = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    };

    const days = calculateDays(order.start_date, order.end_date);

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        confirmed: "bg-green-100 text-green-700 border-green-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
        completed: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const paymentColors: Record<string, string> = {
        paid: "bg-green-100 text-green-700 border-green-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        unpaid: "bg-gray-100 text-gray-700 border-gray-200",
        refunded: "bg-purple-100 text-purple-700 border-purple-200",
        failed: "bg-red-100 text-red-700 border-red-200",
    };

    const status = (order.status || "pending").toLowerCase();
    const paymentStatus = (order.payment_status || "unpaid").toLowerCase();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Order #{order.id}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Created: {formatDate(order.created_at)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Section */}
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Order Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => onStatusChange(order.id, e.target.value)}
                                className={`px-3 py-2 rounded-lg border font-medium ${statusColors[status] || "bg-gray-100"}`}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Payment Status
                            </label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => onPaymentStatusChange(order.id, e.target.value)}
                                className={`px-3 py-2 rounded-lg border font-medium ${paymentColors[paymentStatus] || "bg-gray-100"}`}
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>

                    {/* Boat Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <FiAnchor />
                            <span className="font-medium">Boat Details</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                {order.boat_images?.[0] ? (
                                    <Image
                                        src={order.boat_images[0]}
                                        alt={order.boat_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                        🚤
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {order.boat_name || "Unknown Boat"}
                                </h3>
                                <p className="text-sm text-gray-500 capitalize">
                                    {order.booking_type || "Rental"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {order.guest_count} guest(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <FiUser />
                            <span className="font-medium">Customer Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">
                                    {order.username || "Unknown"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">
                                    {order.user_email || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rental Period */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <FiCalendar />
                            <span className="font-medium">Rental Period</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(order.start_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(order.end_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium text-gray-900">
                                    {days} day{days > 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <FiDollarSign />
                            <span className="font-medium">Payment Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="font-bold text-xl text-blue-600">
                                    {formatCurrency(order.total_price)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {order.payment_method || "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
