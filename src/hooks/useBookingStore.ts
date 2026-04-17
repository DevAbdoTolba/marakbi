import { create } from "zustand";
import type { BookingData } from "@/components/BookingSidebar";

/**
 * Extended booking data includes trip/contact/image fields
 * added by boat-details page and step 2 (personal info).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FullBookingData = BookingData & Record<string, any>;

type BookingStore = {
  bookingData: FullBookingData | null;
  setBookingData: (data: FullBookingData) => void;
  updateBookingData: (partial: Partial<FullBookingData>) => void;
  clearBookingData: () => void;
};

const useBookingStore = create<BookingStore>((set) => ({
  bookingData: null,
  setBookingData: (data) => set({ bookingData: data }),
  updateBookingData: (partial) =>
    set((state) => ({
      bookingData: state.bookingData
        ? { ...state.bookingData, ...partial }
        : null,
    })),
  clearBookingData: () => set({ bookingData: null }),
}));

export default useBookingStore;
