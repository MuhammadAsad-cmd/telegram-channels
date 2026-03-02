"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Tag,
  Users,
  LogOut,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useAuthContext } from "@/context/AuthContext";

const navItems = [
  {
    href: "/admin-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin-dashboard/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin-dashboard/channels",
    label: "Channels",
    icon: Radio,
  },
  {
    href: "/admin-dashboard/categories",
    label: "Categories",
    icon: Tag,
  },

];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, user } = useAuthContext();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    await logout();
    window.location.href = "/login";
  };

  const isActive = (href) => {
    if (href === "/admin-dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <aside
        className={`
          bg-secondary-dark border-r border-white/6 flex flex-col
          fixed top-0 left-0 h-screen w-64 z-50
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex shrink-0 items-center justify-between px-5 py-4 border-b border-white/6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-accent-primary" />
            </div>
            <div>
              <p className="text-text-primary font-semibold text-sm leading-none">
                Admin Panel
              </p>
              <p className="text-text-muted text-[11px] mt-0.5 leading-none">
                Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-text-muted/60 uppercase tracking-widest px-3 mb-2">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active
                    ? "bg-accent-primary/15 text-accent-primary"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-accent-primary" : "group-hover:text-text-primary"
                    }`}
                />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 text-accent-primary/60 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: user info + logout */}
        <div className="shrink-0 px-3 py-3 border-t border-white/6">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                <span className="text-accent-primary text-xs font-bold">
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "A"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-text-primary text-xs font-medium truncate leading-none">
                  {user.name || "Admin"}
                </p>
                <p className="text-text-muted text-[11px] truncate mt-0.5 leading-none">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/8 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5 text-accent-red" />
            </div>
            <h3 className="text-text-primary font-semibold text-lg mb-1.5">
              Log out?
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Are you sure you want to log out of the admin panel?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
