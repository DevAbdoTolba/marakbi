import { create } from "zustand";

type PaymentOptionStore = {
  paymentOption: "visa" | "paypal" | null;
  setPaymentOption: (option: "visa" | "paypal" | null) => void;
};

const usePaymentOption = create<PaymentOptionStore>((set) => ({
  paymentOption: null,
  setPaymentOption: (option) => set({ paymentOption: option }),
}));

export default usePaymentOption;
