import React, { ReactNode } from "react";
import { Metadata } from "next";
import AdminHeader from "../admin-login/_components/AdminHeader";

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
    <div>
      <AdminHeader listing />
      <div>{children}</div>
    </div>
  );
}
