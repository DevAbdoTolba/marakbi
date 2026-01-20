import React from "react";
import AdminDashboardLayout from "./_components/AdminDashboardLayout";
import { ToastProvider } from "./_components/ToastProvider";

export default function page() {
  return (
    <ToastProvider>
      <div className="pt-[65px]">
        <AdminDashboardLayout />
      </div>
    </ToastProvider>
  );
}

