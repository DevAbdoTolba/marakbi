import { Check } from "lucide-react";

interface StepCounterItemProps {
  onClick: () => void;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
}
export default function StepCounterItem({
  label,
  isActive = false,
  disabled = false,
  onClick,
}: StepCounterItemProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`flex flex-col gap-5 items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <div
        className={`h-8 flex items-center justify-center w-8  ${isActive ? "bg-[#106BD8]" : "bg-white border-2 border-[#D1D1D1]"
          }   rounded-full`}
      >
        {isActive && <Check color="white" />}
      </div>

      <div
        className={`text-xs ${isActive ? "text-[#106BD8]" : "text-[#D1D1D1]"
          } font-normal`}
      >
        {label}
      </div>
    </div>
  );
}
