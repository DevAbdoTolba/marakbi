import AdminInput from "@/app/(admin-screens)/_components/AdminInput";
import AdminTextArea from "@/app/(admin-screens)/_components/AdminTextArea";
import { useFormContext } from "react-hook-form";

type BasicInfoStepFields = {
  boatName: string;
  boatType: string;
  boatDescription: string;
};

export default function BasicInfoStep1() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInfoStepFields>();

  return (
    <div className="flex flex-col gap-3">
      <AdminInput
        id="boatName"
        label="Boat Name *"
        placeholder="e.g., Sea Breeze"
        registration={register("boatName", {
          required: "Boat name is required",
        })}
        error={errors.boatName}
      />

      <AdminInput
        id="boatType"
        label="Boat Type *"
        placeholder="Select boat type"
        registration={register("boatType", {
          required: "Boat type is required",
        })}
        error={errors.boatType}
      />

      <AdminTextArea
        maxLength={500}
        id="boatDescription"
        label="Description *"
        placeholder="Describe your boat, its condition, and what makes it special..."
        registration={register("boatDescription", {
          required: "Boat description is required",
        })}
        error={errors.boatDescription}
      />
    </div>
  );
}
