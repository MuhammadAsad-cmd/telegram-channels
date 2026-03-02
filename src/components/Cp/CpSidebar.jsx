"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Megaphone,
  CreditCard,
  BadgePercent,
  History,
  Settings,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import LogoutModal from "../Modal/LogoutModal";
import { useAuthContext } from "@/context/AuthContext";

const navItems = [
  { href: "/cp", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cp/media/create", label: "Add New Media", icon: Plus },
  { href: "/cp/media", label: "Media List", icon: Megaphone },
  { href: "/cp/deposit", label: "Deposit", icon: CreditCard },
  { href: "/cp/tcp-history", label: "TCP History", icon: History },
  { href: "/cp/ads", label: "Advertising", icon: BadgePercent },
  { href: "/cp/account-setting", label: "Account Setting", icon: Settings },
  // { href: "/cp/notifications", label: "Notifications", icon: Bell },
];

export default function CpSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await logout();
  };

  const navContent = (
    <nav className="p-4 space-y-1 flex-1 min-h-0 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-accent-primary/15 text-accent-primary"
                : "text-text-muted hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <Icon
              className={`w-5 h-5 shrink-0 ${
                isActive ? "text-accent-primary" : ""
              }`}
            />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setIsLogoutModalOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-accent-red hover:bg-white/5 transition-all duration-200 cursor-pointer mt-4"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </nav>
  );

  return (
    <>
      {/* Mobile: backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Fixed sidebar: below header (top-16), full height minus header */}
      <aside
        className={`
          bg-secondary-dark border-r border-white/6 flex flex-col
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex shrink-0 items-center justify-between p-4 border-b border-white/6 lg:hidden">
          <span className="text-text-primary font-semibold text-sm">
            Control Panel
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {navContent}

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </aside>
    </>
  );
}
