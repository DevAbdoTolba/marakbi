import React, { ReactNode, Suspense } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense fallback={<div className="min-h-screen bg-gray-100 animate-pulse" />}>
        {children}
      </Suspense>
    </div>
  );
}
