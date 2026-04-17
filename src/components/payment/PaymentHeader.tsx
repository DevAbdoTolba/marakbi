import Logo from "../Logo";
import StepCounter from "./stepCounter/StepCounter";

export default function PaymentHeader() {
  const steps = [
    { id: "bookingInfo", label: "Booking Info", stepNumber: 1 },
    { id: "personalInfo", label: "Personal Info", stepNumber: 2 },
    { id: "paymentInfo", label: "Payment Info", stepNumber: 3 },
  ];

  return (
    <header
      className="
        relative 
        flex 
        items-center 
        justify-center 
        w-full
        px-4 sm:px-6 md:px-10 
      "
    >
      {/* Logo — hidden on small screens */}
      <div className="absolute left-0">
        <div className="hidden md:block">
          <Logo width={40} height={100} className="mr-auto" />
        </div>
      </div>

      {/* Step Counter — always centered */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <StepCounter steps={steps} />
      </div>
    </header>
  );
}
