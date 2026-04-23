import { create } from "zustand";

type FormStepStore = {
  currentStep: number;
  completedStep: number;
  setStep: (step: number) => void;
  completeStep: (step: number) => void;
};

const useFormStep = create<FormStepStore>((set, get) => ({
  currentStep: 1,
  completedStep: 0,
  setStep: (step) => {
    const { completedStep } = get();
    // When navigating back, reset completedStep so user must re-validate to proceed
    const newCompleted = step - 1 < completedStep ? step - 1 : completedStep;
    set({ currentStep: step, completedStep: newCompleted });
  },
  completeStep: (step) => {
    const current = get().completedStep;
    if (step > current) {
      set({ completedStep: step });
    }
  },
}));

export default useFormStep;
