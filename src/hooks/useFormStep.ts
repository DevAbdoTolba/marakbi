import { create } from "zustand";

type FormStepStore = {
  currentStep: number;
  setStep: (step: number) => void;
};

const useFormStep = create<FormStepStore>((set) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
}));

export default useFormStep;
