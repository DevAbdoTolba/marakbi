"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi, AdminOrder } from "@/lib/api";
import { FiSearch, FiX, FiRefreshCw, FiUser } from "react-icons/fi";
import { useToast } from "../../ToastProvider";
import { TableSkeleton } from "../../Skeleton";
// Import the new components from the orders directory
import OrdersTable from "../orders/OrdersTable";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import FilterComponent from "../orders/FilterComponent";

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
  const [userFilter, setUserFilter] = useState<number | undefined>(() => {
    const userId = searchParams.get("user");
    return userId ? parseInt(userId, 10) : undefined;
  });
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
    // Check URL params on updates (e.g. back button or direct navigation updates)
    const userId = searchParams.get("user");
    if (userId) {
      const parsedId = parseInt(userId, 10);
      if (parsedId !== userFilter) {
        setUserFilter(parsedId);
      }

      // Fetch username for display
      adminApi.getUser(parsedId).then((res) => {
        if (res.success && res.data) {
          setUserFilterName(res.data.username);
        }
      });
    } else if (userFilter !== undefined) {
      setUserFilter(undefined);
    }

    // Check for openOrderId in URL
    const openOrderId = searchParams.get("openOrderId");
    if (openOrderId) {
      const orderId = Number(openOrderId);
      if (!isNaN(orderId)) {
        // We can't easily rely on 'orders' state being populated yet as fetchBookings might be async/slow
        // So we fetch the single order directly if we want to be robust
        adminApi.getOrder(orderId).then((res) => {
          if (res.success && res.data) {
            setSelectedOrder(res.data);
          }
        });
      }
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

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-8 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-bold text-xl">Bookings Management</p>
          <p className="text-[#717182] font-normal text-sm">
            View and manage all bookings
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          aria-label="Export bookings to CSV"
        >
          <FiRefreshCw size={18} /> Export
        </button>
      </div>

      {/* User Filter Banner */}
      {userFilter && userFilterName && (
        <div className="mb-6 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="bg-[#F3F3F5] flex items-center gap-2 px-3 py-2.5 rounded-lg flex-1 w-full border border-transparent focus-within:border-blue-500 transition">
            <FiSearch className="text-[#717182]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by order #, customer, or boat..."
              className="bg-transparent outline-none text-sm flex-1 text-gray-900 placeholder-gray-500"
              aria-label="Search bookings"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <FilterComponent
              selectItems={["All Status", "Pending", "Confirmed", "Cancelled", "Completed"]}
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
            />
            <FilterComponent
              selectItems={["All Payments", "Unpaid", "Pending", "Paid", "Refunded"]}
              value={paymentStatusFilter}
              onChange={(val) => { setPaymentStatusFilter(val); setPage(1); }}
            />
          </div>
        </div>

        {/* Date Range Filter (Kept but styled better) */}
        <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase">From</span>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => { setStartDateFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase">To</span>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => { setEndDateFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>
          {(startDateFilter || endDateFilter) && (
            <button
              onClick={() => { setStartDateFilter(""); setEndDateFilter(""); setPage(1); }}
              className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiRefreshCw className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Try adjusting your search or filters.
          </p>
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
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <OrdersTable
            orders={orders}
            onStatusChange={handleStatusUpdate}
            onPaymentStatusChange={handlePaymentUpdate}
            onViewOrder={(order) => setSelectedOrder(order)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* New Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
            const params = new URLSearchParams(searchParams.toString());
            if (params.get("openOrderId")) {
              params.delete("openOrderId");
              router.replace(`/admin-dashboard?${params.toString()}`, { scroll: false });
            }
          }}
          onStatusChange={handleStatusUpdate}
          onPaymentStatusChange={handlePaymentUpdate}
        />
      )}

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[110]">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="font-medium text-gray-700">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
