"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminLayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Uncomment to restrict access by role once backend provides a role field:
    // if (user?.role !== "admin") {
    //   router.replace("/");
    // }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-[#080f1c]">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 h-screen overflow-hidden">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 min-h-0 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
