"use client";
import { AdminOrder } from "@/lib/api";
import OrderTableRow from "./OrderTableRow";

interface OrdersTableProps {
  orders: AdminOrder[];
  onStatusChange: (orderId: number, newStatus: string) => void;
  onPaymentStatusChange: (orderId: number, newPaymentStatus: string) => void;
  onViewOrder: (order: AdminOrder) => void;
}

export default function OrdersTable({
  orders,
  onStatusChange,
  onPaymentStatusChange,
  onViewOrder
}: OrdersTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg">No orders found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-[#E5E7EB]">
      <table className="w-full min-w-[900px] text-left">
        <thead>
          <tr className="border-b text-[#0A0A0A] font-medium text-base border-[#E5E7EB]">
            {[
              "Order",
              "Customer",
              "Boat",
              "Rental Period",
              "Amount",
              "Status",
              "Payment",
              "Actions",
            ].map((head) => (
              <th
                key={head}
                className="py-3 px-4 text-sm font-semibold text-[#4B5563]"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const days = calculateDays(order.start_date, order.end_date);
            const pricePerDay = order.total_price / days;

            return (
              <OrderTableRow
                key={order.id}
                order={order}
                orderId={`ORD-${order.id.toString().padStart(4, '0')}`}
                orderDate={formatDate(order.created_at)}
                customerName={order.username || 'Unknown'}
                customerEmail={order.user_email || ''}
                boatImageUrl={order.boat_images?.[0] || ''}
                boatName={order.boat_name || 'Unknown Boat'}
                boatType={order.booking_type || 'Rental'}
                rentalPeriod={`${formatDate(order.start_date)} - ${formatDate(order.end_date)}`}
                rentalPeriodInDays={`${days} day${days > 1 ? 's' : ''}`}
                amount={formatCurrency(order.total_price)}
                amountPerDay={`${formatCurrency(pricePerDay)}/day`}
                status={order.status as "Confirmed" | "Pending" | "In progress" | "Cancelled" | "Completed"}
                paymentStatus={order.payment_status as "Paid" | "Pending" | "Refunded"}
                onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
                onPaymentStatusChange={(newPaymentStatus) => onPaymentStatusChange(order.id, newPaymentStatus)}
                onViewOrder={() => onViewOrder(order)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
