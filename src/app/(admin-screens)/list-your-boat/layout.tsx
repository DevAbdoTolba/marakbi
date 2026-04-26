import React, { ReactNode } from "react";
import { Metadata } from "next";
import AdminHeader from "../admin-login/_components/AdminHeader";

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
    <div>
      <AdminHeader listing />
      <div>{children}</div>
    </div>
  );
}
