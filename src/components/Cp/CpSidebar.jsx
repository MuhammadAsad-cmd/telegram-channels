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
} from "lucide-react";
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

export default function CpSidebar() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuthContext();

  return (
    <aside className="w-64 shrink-0 bg-secondary-dark border-r border-white/6 flex flex-col">
      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </aside>
  );
}
