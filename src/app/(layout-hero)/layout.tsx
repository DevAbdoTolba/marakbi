import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DynamicHero from "@/components/main/DynamicHero";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <DynamicHero />
      {children}
      <Footer />
    </div>
  );
}
