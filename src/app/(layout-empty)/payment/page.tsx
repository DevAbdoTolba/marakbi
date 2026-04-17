import PaymentLayout from "@/components/payment/PaymentLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Details",
  description:
    "Review your order and confirm payment to finalize your booking.",
};

export default function page() {
  return <PaymentLayout />;
}
