"use client";

import BoatListingLayout from "@/components/boatListing/BoatListingLayout";
import { Suspense } from "react";

export default function BoatListingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900"></div>
      </div>
    }>
      <BoatListingLayout />
    </Suspense>
  );
}
