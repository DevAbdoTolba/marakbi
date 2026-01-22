"use client";
import { useEffect, useState, useCallback } from "react";
import AdminDashboardButton from "../../AdminDashboardButton";
import { FiDownload } from "react-icons/fi";
import SearchInput from "./SearchInput";
import FilterComponent from "./FilterComponent";
import OrdersTable from "./OrdersTable";
import OrderDetailsModal from "./OrderDetailsModal";
import { adminApi, AdminOrder } from "@/lib/api";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const filters: { status?: string; payment_status?: string; search?: string } = {};
    if (statusFilter && statusFilter !== "All Status") {
      filters.status = statusFilter.toLowerCase();
    }
    if (paymentFilter && paymentFilter !== "All Payments") {
      filters.payment_status = paymentFilter.toLowerCase();
    }
    if (search) {
      filters.search = search;
    }

    const response = await adminApi.getOrders(page, 10, filters);
    if (response.success && response.data) {
      setOrders(response.data.orders);
      setTotalPages(response.data.pages);
    }
    setLoading(false);
  }, [page, statusFilter, paymentFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(orderId, { status: newStatus });
    if (response.success) {
      fetchOrders();
      // Update selected order if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } else {
      alert(response.error || "Failed to update status");
    }
    setActionLoading(false);
  };

  const handlePaymentStatusChange = async (orderId: number, newPaymentStatus: string) => {
    setActionLoading(true);
    const response = await adminApi.updateOrderStatus(orderId, { payment_status: newPaymentStatus });
    if (response.success) {
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, payment_status: newPaymentStatus } : null);
      }
    } else {
      alert(response.error || "Failed to update payment status");
    }
    setActionLoading(false);
  };

  const handleViewOrder = async (order: AdminOrder) => {
    // Open immediately with partial data
    setSelectedOrder(order);

    // Fetch full details to get trip_details, owner phone, etc.
    try {
      const response = await adminApi.getOrder(order.id);
      if (response.success && response.data) {
        setSelectedOrder(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch full order details", err);
    }
  };

  const handleExport = () => {
    const headers = ["Order ID", "Customer", "Email", "Boat", "Total Price", "Status", "Payment", "Start Date", "End Date", "Created At"];
    const csvContent = [
      headers.join(","),
      ...orders.map(order => [
        order.id,
        `"${order.username || ''}"`,
        `"${order.user_email || ''}"`,
        `"${order.boat_name || ''}"`,
        order.total_price,
        order.status || '',
        order.payment_status || '',
        order.start_date,
        order.end_date,
        order.created_at
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-8 justify-between gap-3">
        <div>
          <p className="text-[#0A0A0A] font-bold text-xl">Orders Management</p>
          <p className="text-[#717182] font-normal text-sm">
            View and manage all boat rental orders
          </p>
        </div>

        <div className="self-start md:self-auto">
          <AdminDashboardButton
            onClick={handleExport}
            icon={FiDownload}
            label="Export"
          />
        </div>
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
        <div className="flex-1 w-full">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by order #, customer, or boat..."
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <FilterComponent
            selectItems={[
              "All Status",
              "Pending",
              "Confirmed",
              "Cancelled",
              "Completed",
            ]}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />

          <FilterComponent
            selectItems={["All Payments", "Unpaid", "Pending", "Paid", "Refunded"]}
            value={paymentFilter}
            onChange={(value) => {
              setPaymentFilter(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Table */}
          <OrdersTable
            orders={orders}
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onViewOrder={handleViewOrder}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
        />
      )}

      {/* Action Loading Overlay */}
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
