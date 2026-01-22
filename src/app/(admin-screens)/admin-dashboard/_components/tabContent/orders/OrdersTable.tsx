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
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateDuration = (startDate: string, endDate: string, type: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());

    if (type === 'hourly') {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return { value: diffHours || 1, unit: 'hour' };
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { value: diffDays || 1, unit: 'day' };
    }
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
              "Schedule/Period",
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
            const { value: duration, unit } = calculateDuration(order.start_date, order.end_date, order.booking_type || 'daily');

            let rentalPeriodLabel = "";
            let rentalPeriodInDaysLabel = ""; // Renaming local var to match concept
            let rateLabel = "";
            let rateAmount = 0;

            if (order.trip_type) {
              // Trip Logic
              const tripHours = order.trip_details?.voyage_hours || 0;

              if (tripHours > 0 && tripHours < 24) {
                // Treat as hourly-style trip
                rentalPeriodLabel = `${tripHours} hours`;
                rentalPeriodInDaysLabel = formatDate(order.start_date);
              } else {
                // Treat as daily-style trip
                // If start and end are same day, it still might be > 24h? Unlikely. 
                // But standard logic for daily is Date - Date.
                // If single day: "Feb 7 - Feb 7".
                rentalPeriodLabel = `${formatDate(order.start_date)} - ${formatDate(order.end_date)}`;

                // Secondary label: X days. 
                // If trip has hours >= 24, e.g. 2 days.
                const days = Math.ceil((tripHours || 24) / 24);
                rentalPeriodInDaysLabel = `${days} day${days > 1 ? 's' : ''}`;
              }

              rateLabel = "Fixed Price";
              rateAmount = order.total_price;

            } else if (order.booking_type === 'hourly') {
              rentalPeriodLabel = `${duration} hour${duration > 1 ? 's' : ''}`;
              rentalPeriodInDaysLabel = formatDate(order.start_date);
              rateLabel = "/hour";
              rateAmount = order.total_price / duration;

            } else {
              // Daily Rental matches user request: "Nov 13 - Nov 15" then "3 days"
              rentalPeriodLabel = `${formatDate(order.start_date)} - ${formatDate(order.end_date)}`;
              rentalPeriodInDaysLabel = `${duration} day${duration > 1 ? 's' : ''}`;

              rateLabel = "/day";
              rateAmount = order.total_price / duration;
            }


            // Determine Type Label (Existing logic)
            let typeLabel = "Rental";
            let subTypeLabel = order.booking_type || "Hourly";
            if (order.trip_type) {
              typeLabel = "Trip";
              subTypeLabel = order.trip_name || "Fixed Trip";
            } else if (order.voyage_type) {
              typeLabel = "Voyage";
              subTypeLabel = order.voyage_type;
            } else if (order.booking_type === 'daily') {
              typeLabel = "Daily Rent";
              subTypeLabel = "";
            } else if (order.booking_type === 'hourly') {
              typeLabel = "Hourly Rent";
              subTypeLabel = "";
            }

            return (
              <OrderTableRow
                key={order.id}
                order={order}
                orderId={`ORD-${order.id.toString().padStart(4, '0')}`}
                orderDate={formatDate(order.created_at)}
                customerName={order.username || "Unknown"}
                customerEmail={order.user_email || "N/A"}
                boatImageUrl={order.boat_images?.[0] || ""}
                boatName={order.boat_name || "Unknown Boat"}
                boatType={typeLabel}
                boatSubType={subTypeLabel}
                rentalPeriod={rentalPeriodLabel}
                rentalPeriodInDays={rentalPeriodInDaysLabel}
                amount={formatCurrency(order.total_price)}
                amountPerDay={order.trip_type ? "Fixed Price" : `${formatCurrency(rateAmount)}${rateLabel}`}
                status={order.status || "Pending"}
                paymentStatus={order.payment_status || "Unpaid"}
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
