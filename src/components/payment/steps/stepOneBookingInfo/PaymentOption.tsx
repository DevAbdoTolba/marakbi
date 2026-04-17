"use client";
import React from "react";
import PaymentMethod from "./PaymentMethod";
import Image from "next/image";
import PaymentInput from "./PaymentInput";
import usePaymentOption from "@/hooks/usePaymentOption";
import { GoShieldLock } from "react-icons/go";

export default function PaymentOption() {
  const { paymentOption, setPaymentOption } = usePaymentOption();

  return (
    <div className="w-full">
      {/* Secure payment message */}
      <div className="flex mb-3 items-center gap-2">
        <GoShieldLock size={18} className="sm:size-[20px]" />
        <span className="text-sm sm:text-base md:text-lg font-normal">
          This is a secure payment
        </span>
      </div>

      {/* Title */}
      <div className="text-2xl sm:text-3xl md:text-[38px] mb-5 sm:mb-[26px] font-bold leading-tight">
        Confirm and Pay
      </div>

      {/* Subtitle */}
      <div className="text-xl sm:text-2xl font-medium mb-3 sm:mb-2.5">
        Payment method
      </div>

      {/* Payment methods */}
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* === PayPal Option === */}
        <PaymentMethod
          onClick={() => setPaymentOption("paypal")}
          label="Paypal"
          isChecked={paymentOption === "paypal"}
          imageIcon={
            <Image
              src="/paypal.png"
              alt="paypal"
              width={77}
              height={19}
              className="w-[70px] sm:w-[77px] h-auto"
            />
          }
        >
          <div className="flex flex-col gap-4">
            <PaymentInput label="Amount In USD" placeholder="$0000" />
            <PaymentInput
              label="Payment Reason"
              placeholder="Describe the service"
            />
            <button className="bg-[#f4bf4d] text-white py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#e5ae3c] transition">
              <Image
                className="mx-auto"
                src="/paypal.png"
                alt="paypal"
                width={77}
                height={19}
              />
            </button>
          </div>
        </PaymentMethod>

        {/* === Visa Option === */}
        <PaymentMethod
          onClick={() => setPaymentOption("visa")}
          label="Debit or credit card"
          isChecked={paymentOption === "visa"}
          imageIcon={
            <Image
              src="/visa.png"
              alt="visa"
              width={122}
              height={26}
              className="w-[100px] sm:w-[122px] h-auto"
            />
          }
        >
          <div className="flex flex-col gap-4">
            <PaymentInput
              label="Card Number"
              placeholder="0000 0000 0000 0000"
            />

            {/* CVV + Expiration */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <PaymentInput label="CVV" placeholder="123" />
              <PaymentInput label="Expiration Date" placeholder="MM/YY" />
            </div>

            <PaymentInput label="Cardholder Name" placeholder="Name on card" />

            <button className="bg-[#0B4C99] text-white py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#0a3f83] transition">
              Pay Now
            </button>
          </div>
        </PaymentMethod>
      </div>
    </div>
  );
}
