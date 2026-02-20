"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import CpSidebar from "@/components/Cp/CpSidebar";

export default function CpLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-primary-dark">
      <CpSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 bg-[#e5ebef] overflow-auto min-w-0">
        {/* Mobile top bar with sidebar toggle */}
        <div className="flex md:hidden items-center gap-3 px-4 py-3 bg-[#d5dde4] border-b border-black/10 sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            Control Panel
          </span>
        </div>

        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
