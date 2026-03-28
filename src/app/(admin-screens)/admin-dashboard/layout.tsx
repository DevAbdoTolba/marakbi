import React, { ReactNode } from "react";
import { Inter } from "next/font/google";
import AdminDashboardHeader from "./_components/AdminDashboardHeader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} admin-dashboard-layout`}>
      <AdminDashboardHeader />
      {children}
    </div>
  );
}
