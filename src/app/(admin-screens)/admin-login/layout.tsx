import React, { ReactNode } from "react";
import AdminHeader from "./_components/AdminHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Marakbi Admin Portal",
    template: "%s | Marakbi Admin",
  },
  description:
    "Access the Marakbi Admin Dashboard to manage locations, trips, and user activity securely.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <AdminHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
