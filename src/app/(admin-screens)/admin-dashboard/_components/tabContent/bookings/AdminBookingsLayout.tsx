"use client";
import React, { useState, useEffect, useCallback } from "react";
import { adminApi, AdminOrder } from "@/lib/api";
import { FiSearch, FiDownload, FiEye, FiX, FiCalendar, FiUser, FiDollarSign, FiAnchor } from "react-icons/fi";
import Image from "next/image";

export default function AdminBookingsLayout() {
  const [bookings, setBookings] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminOrder | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const filters: { search?: string; status?: string } = {};
    if (search) filters.search = search;
    if (statusFilter && statusFilter !== "All") filters.status = statusFilter.toLowerCase();

    const response = await adminApi.getOrders(page, 10, filters);
    if (response.success && response.data) {
      setBookings(response.data.orders);
      setTotalPages(response.data.pages);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(bookingId, { status: newStatus });
    if (response.success) {
      fetchBookings();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } else {
      alert(response.error || "Failed to update status");
    }
    setActionLoading(false);
  };

  const handlePaymentUpdate = async (bookingId: number, newPaymentStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(bookingId, { payment_status: newPaymentStatus });
    if (response.success) {
      fetchBookings();
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, payment_status: newPaymentStatus } : null);
      }
    } else {
      alert(response.error || "Failed to update payment status");
    }
    setActionLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const paymentColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    unpaid: "bg-gray-100 text-gray-700",
    refunded: "bg-purple-100 text-purple-700",
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Customer", "Email", "Boat", "Type", "Amount", "Status", "Payment", "Start Date", "End Date", "Created"].join(","),
      ...bookings.map(b => [
        b.id,
        `"${b.username || ''}"`,
        `"${b.user_email || ''}"`,
        `"${b.boat_name || ''}"`,
        b.booking_type || '',
        b.total_price,
        b.status || '',
        b.payment_status || '',
        b.start_date,
        b.end_date,
        b.created_at
      ].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-[15.09px] p-[26px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-medium text-lg">Bookings Management</p>
          <p className="text-[#717182] font-normal text-sm">
            View and manage all bookings ({bookings.length} shown)
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          <FiDownload /> Export
        </button>
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
            placeholder="Search by customer or boat..."
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none min-w-[140px]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No bookings found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {["Booking", "Customer", "Boat", "Period", "Amount", "Status", "Payment", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-4 text-sm font-semibold text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const status = (booking.status || 'unknown').toLowerCase();
                const payment = (booking.payment_status || 'unknown').toLowerCase();
                const days = calculateDays(booking.start_date, booking.end_date);

                return (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">#{booking.id}</span>
                      <p className="text-xs text-gray-500">{formatDate(booking.created_at)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{booking.username || 'Unknown'}</span>
                      <p className="text-xs text-gray-500">{booking.user_email || ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                          {booking.boat_images?.[0] ? (
                            <Image src={booking.boat_images[0]} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🚤</div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium block truncate max-w-[150px]">{booking.boat_name || 'Unknown'}</span>
                          <p className="text-xs text-gray-500 capitalize">{booking.booking_type || 'Rental'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</p>
                      <p className="text-xs text-gray-500">{days} day{days > 1 ? 's' : ''}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600">
                      {formatCurrency(booking.total_price)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={status}
                        onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[status] || "bg-gray-100"}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={payment}
                        onChange={(e) => handlePaymentUpdate(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${paymentColors[payment] || "bg-gray-100"}`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Booking #{selectedBooking.id}</h2>
                <p className="text-sm text-gray-500">Created: {formatDateTime(selectedBooking.created_at)}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Controls */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={(selectedBooking.status || 'pending').toLowerCase()}
                    onChange={(e) => handleStatusUpdate(selectedBooking.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg border font-medium ${statusColors[(selectedBooking.status || 'pending').toLowerCase()] || "bg-gray-100"}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Payment</label>
                  <select
                    value={(selectedBooking.payment_status || 'unpaid').toLowerCase()}
                    onChange={(e) => handlePaymentUpdate(selectedBooking.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg border font-medium ${paymentColors[(selectedBooking.payment_status || 'unpaid').toLowerCase()] || "bg-gray-100"}`}
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
                  <span className="font-medium">Boat</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-200">
                    {selectedBooking.boat_images?.[0] ? (
                      <Image src={selectedBooking.boat_images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🚤</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedBooking.boat_name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{selectedBooking.booking_type || 'Rental'}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.guest_count} guest(s)</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FiUser />
                  <span className="font-medium">Customer</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedBooking.username || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedBooking.user_email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Period */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FiCalendar />
                  <span className="font-medium">Rental Period</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start</p>
                    <p className="font-medium">{formatDateTime(selectedBooking.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End</p>
                    <p className="font-medium">{formatDateTime(selectedBooking.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{calculateDays(selectedBooking.start_date, selectedBooking.end_date)} days</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FiDollarSign />
                  <span className="font-medium">Payment</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-xl text-blue-600">{formatCurrency(selectedBooking.total_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-medium capitalize">{selectedBooking.payment_method || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[110]">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
