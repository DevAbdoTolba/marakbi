"use client";
import Logo from "@/components/Logo";
import AdminDashboardButton from "./AdminDashboardButton";
import { FaArrowLeft } from "react-icons/fa";

export default function AdminHeader() {
  return (
    <div className="justify-between w-full z-50 fixed border-b bg-white border-[#0000001A] flex py-3.5 px-6">
      <div className="flex items-center gap-2">
        <Logo variant="gradient" width={20} height={40} />
        <p className="text-base hidden sm:block font-semibold text-[#0A0A0A]">
          Daffa Admin
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <p className="text-[#717182] font-normal text-sm sm:text-base whitespace-nowrap">
          Welcome, Admin
        </p>
        <AdminDashboardButton
          icon={FaArrowLeft}
          label="Sign Out"
          onClick={() => { }}
        />
      </div>
    </div>
  );
}
