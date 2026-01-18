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

  const statusKey = (status || 'unknown').toLowerCase();
  const paymentKey = (paymentStatus || 'unknown').toLowerCase();

  return (
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
            <p className="text-[13px] font-normal text-[#717182] capitalize">{boatType}</p>
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
                onClick={() => {
                  onStatusChange(s);
                  setShowStatusDropdown(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </td>
      <td className="py-3 px-4 text-sm relative">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${paymentColors[paymentKey] || "bg-gray-100 text-gray-700"}`}
          onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
        >
          {(paymentStatus || 'Unknown').charAt(0).toUpperCase() + (paymentStatus || 'Unknown').slice(1)}
        </span>
        {showPaymentDropdown && onPaymentStatusChange && (
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[120px]">
            {["unpaid", "pending", "paid", "refunded"].map((p) => (
              <button
                key={p}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 capitalize"
                onClick={() => {
                  onPaymentStatusChange(p);
                  setShowPaymentDropdown(false);
                }}
              >
                {p}
              </button>
            ))}
          </div>
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
  );
}
