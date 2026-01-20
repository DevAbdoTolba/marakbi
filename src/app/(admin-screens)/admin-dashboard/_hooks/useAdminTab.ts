import { create } from "zustand";

type AdminTab = "overview" | "boat-listings" | "trips" | "bookings" | "users" | "cities" | "reviews" | "voyages" | "categories";

type AdminTabStore = {
  currentTab: AdminTab;
  setTab: (tab: AdminTab) => void;
};

const useAdminTab = create<AdminTabStore>((set) => ({
  currentTab: "overview",
  setTab: (tab) => set({ currentTab: tab }),
}));

export default useAdminTab;
