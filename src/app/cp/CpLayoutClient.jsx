"use client";

import CpSidebar from "@/components/Cp/CpSidebar";

export default function CpLayoutClient({ children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-primary-dark">
      <CpSidebar />
      <div className="flex-1 bg-[#e5ebef] overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
