import Header from "@/components/Header";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header variant="solid" />
      {children}
    </div>
  );
}
