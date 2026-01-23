import React, { Suspense } from "react";
import AdminDashboardLayout from "./_components/AdminDashboardLayout";
import { ToastProvider } from "./_components/ToastProvider";

export default function page() {
  return (
    <ToastProvider>
      <div className="pt-[65px]">
        <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
          <AdminDashboardLayout />
        </Suspense>
      </div>
    </ToastProvider>
  );
}

