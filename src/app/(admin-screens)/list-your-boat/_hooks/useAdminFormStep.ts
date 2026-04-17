import { create } from "zustand";

type AdminFormStepStore = {
  currentStep: number;
  setStep: (step: number) => void;
};

const useAdminFormStep = create<AdminFormStepStore>((set) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
}));

export default useAdminFormStep;
