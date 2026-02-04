"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AdminOrder } from "@/lib/api";
import { FiEye } from "react-icons/fi";

interface OrderTableRowProps {
  order: AdminOrder;
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  boatImageUrl: string;
  boatName: string;
  boatType: string;
  boatSubType: string;
  rentalPeriod: string;
  rentalPeriodInDays: string;
  amount: string;
  amountPerDay: string;
  status: "Confirmed" | "Pending" | "In progress" | "Cancelled" | "Completed" | string;
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Unpaid" | string;
  onStatusChange?: (newStatus: string) => void;
  onPaymentStatusChange?: (newPaymentStatus: string) => void;
  onViewOrder?: () => void;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-700",
};

const paymentColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  unpaid: "bg-gray-100 text-gray-700",
  refunded: "bg-purple-100 text-purple-700",
  failed: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-700",
};

export default function OrderTableRow({
  order,
  orderId,
  orderDate,
  customerName,
  customerEmail,
  boatImageUrl,
  boatName,
  boatType,
  boatSubType,
  rentalPeriod,
  rentalPeriodInDays,
  amount,
  amountPerDay,
  status,
  paymentStatus,
  onStatusChange,
  onPaymentStatusChange,
  onViewOrder,
}: OrderTableRowProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Confirmation State
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState<"status" | "payment" | null>(null);
  const [pendingValue, setPendingValue] = useState<string>("");

  const statusKey = (status || 'unknown').toLowerCase();
  const paymentKey = (paymentStatus || 'unknown').toLowerCase();

  const handleStatusClick = (newStatus: string) => {
    setConfirmType("status");
    setPendingValue(newStatus);
    setShowConfirm(true);
    setShowStatusDropdown(false);
  };

  const handlePaymentClick = (newPayment: string) => {
    setConfirmType("payment");
    setPendingValue(newPayment);
    setShowConfirm(true);
    setShowPaymentDropdown(false);
  };

  const confirmAction = () => {
    if (confirmType === "status" && onStatusChange) {
      onStatusChange(pendingValue);
    } else if (confirmType === "payment" && onPaymentStatusChange) {
      onPaymentStatusChange(pendingValue);
    }
    setShowConfirm(false);
    setConfirmType(null);
    setPendingValue("");
  };

  const cancelAction = () => {
    setShowConfirm(false);
    setConfirmType(null);
    setPendingValue("");
  };

  return (
    <>
      <tr className="border-b border-[#E5E7EB] hover:bg-gray-50 transition">
        <td className="py-3 px-4 text-sm">
          <p className="text-[15.09px] font-medium text-[#0A0A0A]">{orderId}</p>
          <p className="text-[13px] font-normal text-[#717182]">{orderDate}</p>
        </td>
        <td className="py-3 px-4 text-sm">
          <p className="text-[15.09px] font-normal text-[#0A0A0A]">{customerName}</p>
          <p className="text-[13px] font-normal text-[#717182]">{customerEmail}</p>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="relative bg-slate-200 rounded-[8.62px] h-[42px] w-[42px] overflow-hidden flex-shrink-0">
              {boatImageUrl ? (
                <Image src={boatImageUrl} alt={boatName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🚤</div>
              )}
            </div>
            <div>
              <p className="text-[15.09px] font-normal text-[#0A0A0A] truncate max-w-[150px]">{boatName}</p>
              <p className="text-sm font-normal text-[#717182] capitalize">
                {boatType} {boatSubType && <span className="text-xs bg-gray-100 px-1 rounded ml-1">{boatSubType}</span>}
              </p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-sm">
          <p className="text-[15.09px] font-normal text-[#0A0A0A]">{rentalPeriod}</p>
          <p className="text-[13px] font-normal text-[#717182]">{rentalPeriodInDays}</p>
        </td>
        <td className="py-3 px-4 text-sm">
          <p className="text-[15.09px] font-medium text-blue-600">{amount}</p>
          <p className="text-[13px] font-normal text-[#717182]">{amountPerDay}</p>
        </td>
        <td className="py-3 px-4 text-sm relative">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${statusColors[statusKey] || "bg-gray-100 text-gray-700"}`}
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            {(status || 'Unknown').charAt(0).toUpperCase() + (status || 'Unknown').slice(1)}
          </span>
          {showStatusDropdown && onStatusChange && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[120px]">
              {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                <button
                  key={s}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize"
                  onClick={() => handleStatusClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </td>
        <td className="py-3 px-4 text-sm relative">
          {order.payment_method === 'cash' ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium cursor-default bg-gray-100 text-gray-700 border border-gray-200">
              Cash
            </span>
          ) : (
            <>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${paymentColors[paymentKey] || "bg-gray-100 text-gray-700"}`}
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
              >
                {(paymentStatus || 'Unknown').charAt(0).toUpperCase() + (paymentStatus || 'Unknown').slice(1)}
              </span>
              {showPaymentDropdown && onPaymentStatusChange && (
                <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[120px]">
                  {["unpaid", "pending", "paid", "refunded"].map((p) => (
                    <button
                      key={p}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize"
                      onClick={() => handlePaymentClick(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </td>
        <td className="py-3 px-4 text-sm">
          <button
            onClick={onViewOrder}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <FiEye className="w-4 h-4" />
            View
          </button>
        </td>
      </tr>

      {/* Confirmation Modal Portal */}
      {showConfirm && (
        <tr className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <td className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4" colSpan={8}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Change</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change the {confirmType} to <span className="font-bold capitalize text-gray-900">{pendingValue}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
