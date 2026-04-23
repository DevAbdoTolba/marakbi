import React, { ReactNode } from "react";
import AdminHeader from "./_components/AdminHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "DAFFA Admin Portal",
    template: "%s | DAFFA Admin",
  },
  description:
    "Access the DAFFA Admin Dashboard to manage locations, trips, and user activity securely.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <AdminHeader />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
