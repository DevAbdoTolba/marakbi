"use client";
import React from "react";
import AdminFormContainer from "../../_components/AdminFormContainer";
import AdminInput from "../../_components/AdminInput";
import { FaRegEnvelope } from "react-icons/fa";
import { HiOutlineLockClosed } from "react-icons/hi2";
import AdminButton from "../../_components/AdminButton";
import Logo from "@/components/Logo";
import { useForm } from "react-hook-form";

type loginFields = {
  email: string;
  password: string;
};

export default function AdminLoginLayout() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFields>();

  const onSubmit = (data: loginFields) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 bg-[#F7F7F7]">
      <div className="w-full max-w-[491px] flex flex-col items-center">
        <Logo width={52} height={102} />

        <div className="text-2xl sm:text-3xl md:text-[30px] mt-4 mb-2 font-semibold text-[#0A0A0A] text-center">
          Admin Portal
        </div>

        <p className="text-[#717182] mb-8 text-sm sm:text-base text-center max-w-sm">
          Sign in to manage your boat rental platform
        </p>

        <AdminFormContainer
          title="Sign In"
          subtitle="Enter your credentials to access the admin dashboard"
        >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mb-3.5"
        >
          <AdminInput
            id="email"
            label="Email Address"
            placeholder="admin@Marakbi.tours"
            icon={FaRegEnvelope}
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={errors.email}
          />

          <AdminInput
            id="password"
            label="Password"
            placeholder="Enter your password"
            icon={HiOutlineLockClosed}
            password
            registration={register("password", {
              required: "Password is required",
              // minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={errors.password}
          />

          <AdminButton
            type="submit"
            onClick={() => {}}
            label="Sign In"
            variant="primary"
          />
        </form>

        <hr className="-mx-6 border-0 h-[1px] bg-[#0000001A]" />

        <p className="text-[#717182] mt-6 text-xs sm:text-sm md:text-base font-medium text-center">
          This is a secure admin portal. Unauthorized access is prohibited.
        </p>
        </AdminFormContainer>

        <p className="text-[#717182] mt-6 text-xs sm:text-sm md:text-base font-medium text-center max-w-md">
          Need help? Contact support at{" "}
          <span className="text-black font-semibold">support@Marakbi.tours</span>
        </p>
      </div>
    </div>
  );
}
