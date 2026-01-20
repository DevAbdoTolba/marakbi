"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi, AdminOrder } from "@/lib/api";
import { FiSearch, FiFilter, FiCalendar, FiCheck, FiX, FiRefreshCw, FiEye, FiUser, FiDollarSign, FiAnchor } from "react-icons/fi";
import Image from "next/image";
import { useToast } from "../../ToastProvider";
import ConfirmModal from "../../ConfirmModal";
import { TableSkeleton } from "../../Skeleton";

export default function AdminBookingsLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All Payments");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // User filter from URL
  const [userFilter, setUserFilter] = useState<number | undefined>();
  const [userFilterName, setUserFilterName] = useState("");

  // Date range filter
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const filters: { search?: string; status?: string; payment_status?: string; user_id?: number; start_date?: string; end_date?: string } = {};
    if (search) filters.search = search;
    if (statusFilter && statusFilter !== "All Status") filters.status = statusFilter.toLowerCase();
    if (paymentStatusFilter && paymentStatusFilter !== "All Payments") filters.payment_status = paymentStatusFilter.toLowerCase();
    if (userFilter) filters.user_id = userFilter;
    if (startDateFilter) filters.start_date = startDateFilter;
    if (endDateFilter) filters.end_date = endDateFilter;

    const response = await adminApi.getOrders(page, 10, filters);
    if (response.success && response.data) {
      setOrders(response.data.orders);
      setTotalPages(response.data.pages);
    }
    setLoading(false);
  }, [page, search, statusFilter, paymentStatusFilter, userFilter, startDateFilter, endDateFilter]);

  // Read user filter from URL
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      setUserFilter(parseInt(userId, 10));
      // Fetch username for display
      adminApi.getUser(parseInt(userId, 10)).then((res) => {
        if (res.success && res.data) {
          setUserFilterName(res.data.username);
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(orderId, { status: newStatus });
    if (response.success) {
      fetchBookings();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showSuccess(`Status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} `);
    } else {
      showError(response.error || "Failed to update status");
    }
    setActionLoading(false);
  };

  const handlePaymentUpdate = async (orderId: number, newPaymentStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(orderId, { payment_status: newPaymentStatus });
    if (response.success) {
      fetchBookings();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, payment_status: newPaymentStatus } : null);
      }
      showSuccess(`Payment status updated to ${newPaymentStatus.charAt(0).toUpperCase() + newPaymentStatus.slice(1)} `);
    } else {
      showError(response.error || "Failed to update payment status");
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
      ...orders.map(b => [
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

  const openDetailModal = (order: AdminOrder) => {
    setSelectedOrder(order);
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-medium text-lg">Bookings Management</p>
          <p className="text-[#717182] font-normal text-sm">
            View and manage all bookings ({orders.length} shown)
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          aria-label="Export bookings to CSV"
        >
          <FiRefreshCw /> Export
        </button>
      </div>

      {/* User Filter Banner */}
      {userFilter && userFilterName && (
        <div className="mb-4 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <FiUser className="text-purple-600" />
            <span className="text-purple-700 font-medium">
              Showing bookings by: {userFilterName}
            </span>
          </div>
          <button
            onClick={() => {
              setUserFilter(undefined);
              setUserFilterName("");
              router.replace("/admin-dashboard?tab=bookings", { scroll: false });
            }}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
            aria-label="Clear user filter"
          >
            <FiX size={16} /> Clear Filter
          </button>
        </div>
      )}

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
            aria-label="Search bookings"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none min-w-[140px]"
          aria-label="Filter by booking status"
        >
          <option value="All Status">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={paymentStatusFilter}
          onChange={(e) => {
            setPaymentStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none min-w-[140px]"
          aria-label="Filter by payment status"
        >
          <option value="All Payments">All Payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="startDateFilter" className="text-sm text-gray-600">From:</label>
          <input
            id="startDateFilter"
            type="date"
            value={startDateFilter}
            onChange={(e) => {
              setStartDateFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
            aria-label="Start date filter"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDateFilter" className="text-sm text-gray-600">To:</label>
          <input
            id="endDateFilter"
            type="date"
            value={endDateFilter}
            onChange={(e) => {
              setEndDateFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#F3F3F5] px-3 py-2 rounded-lg text-sm outline-none"
            aria-label="End date filter"
          />
        </div>
        {(startDateFilter || endDateFilter) && (
          <button
            onClick={() => {
              setStartDateFilter("");
              setEndDateFilter("");
              setPage(1);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            aria-label="Clear date range filter"
          >
            <FiX size={14} /> Clear Dates
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiCalendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            We couldn't find any bookings matching your filters.
          </p>
          {(search || statusFilter !== "All Status" || paymentStatusFilter !== "All Payments" || userFilter || startDateFilter || endDateFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All Status");
                setPaymentStatusFilter("All Payments");
                setUserFilter(undefined);
                setStartDateFilter("");
                setEndDateFilter("");
                router.replace("/admin-dashboard?tab=bookings", { scroll: false });
              }}
              className="text-blue-600 font-medium hover:underline"
              aria-label="Clear all filters"
            >
              Clear all filters
            </button>
          )}
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
              {orders.map((order) => {
                const status = (order.status || 'unknown').toLowerCase();
                const payment = (order.payment_status || 'unknown').toLowerCase();
                const days = calculateDays(order.start_date, order.end_date);

                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">#{order.id}</span>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{order.username || 'Unknown'}</span>
                      <p className="text-xs text-gray-500">{order.user_email || ''}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                          {order.boat_images?.[0] ? (
                            <Image src={order.boat_images[0]} alt="" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🚤</div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium block truncate max-w-[150px]">{order.boat_name || 'Unknown'}</span>
                          <p className="text-xs text-gray-500 capitalize">{order.booking_type || 'Rental'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p>{formatDate(order.start_date)} - {formatDate(order.end_date)}</p>
                      <p className="text-xs text-gray-500">{days} day{days > 1 ? 's' : ''}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-600">
                      {formatCurrency(order.total_price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px - 2 py - 1 rounded - full text - xs font - medium ${statusColors[status] || "bg-gray-100"} `}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px - 2 py - 1 rounded - full text - xs font - medium ${paymentColors[payment] || "bg-gray-100"} `}>
                        {payment.charAt(0).toUpperCase() + payment.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(order)}
                          className="p-1 hover:bg-gray-100 rounded text-blue-600"
                          title="View Details"
                          aria-label={`View details for booking #${order.id}`}
                        >
                          <FiEye />
                        </button>

                        {/* Only show quick actions for pending/confirmed orders */}
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                className="p-1 hover:bg-green-50 rounded text-green-600"
                                title="Confirm"
                                aria-label={`Confirm booking #${order.id} `}
                              >
                                <FiCheck />
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="p-1 hover:bg-red-50 rounded text-red-600"
                              title="Cancel"
                              aria-label={`Cancel booking #${order.id} `}
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Booking #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">Created: {formatDateTime(selectedOrder.created_at)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Controls */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={(selectedOrder.status || 'pending').toLowerCase()}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    className={`px - 3 py - 2 rounded - lg border font - medium ${statusColors[(selectedOrder.status || 'pending').toLowerCase()] || "bg-gray-100"} `}
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
                    value={(selectedOrder.payment_status || 'unpaid').toLowerCase()}
                    onChange={(e) => handlePaymentUpdate(selectedOrder.id, e.target.value)}
                    className={`px - 3 py - 2 rounded - lg border font - medium ${paymentColors[(selectedOrder.payment_status || 'unpaid').toLowerCase()] || "bg-gray-100"} `}
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
                    {selectedOrder.boat_images?.[0] ? (
                      <Image src={selectedOrder.boat_images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🚤</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedOrder.boat_name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{selectedOrder.booking_type || 'Rental'}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.guest_count} guest(s)</p>
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
                    <p className="font-medium">{selectedOrder.username || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.user_email || 'N/A'}</p>
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
                    <p className="font-medium">{formatDateTime(selectedOrder.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End</p>
                    <p className="font-medium">{formatDateTime(selectedOrder.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{calculateDays(selectedOrder.start_date, selectedOrder.end_date)} days</p>
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
                    <p className="font-bold text-xl text-blue-600">{formatCurrency(selectedOrder.total_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Method</p>
                    <p className="font-medium capitalize">{selectedOrder.payment_method || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
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
