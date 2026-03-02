"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, LogOut, ChevronDown, ShieldCheck, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAuthContext } from "@/context/AuthContext";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/channels": "Channels",
  "/admin-dashboard/channels/create": "Add Channel",
  "/admin-dashboard/categories": "Categories",
  "/admin-dashboard/users": "Users",
};

function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key + "/")) return value;
  }
  return "Admin Panel";
}

export default function AdminHeader({ onMenuClick }) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
    await signOut({ redirect: false });
    await logout();
    window.location.href = "/login";
  };

  const userInitial =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "A";

  return (
    <>
      <header className="sticky top-0 z-20 h-14 bg-secondary-dark/95 backdrop-blur-sm border-b border-white/6 flex items-center px-4 gap-4 shrink-0">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/8 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ShieldCheck className="w-4 h-4 text-accent-primary shrink-0 hidden sm:block" />
          <h1 className="text-text-primary font-semibold text-sm sm:text-base truncate">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right: user dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
              <span className="text-accent-primary text-xs font-bold">
                {userInitial}
              </span>
            </div>
            <span className="text-text-primary text-sm font-medium hidden sm:block max-w-[120px] truncate">
              {user?.name || "Admin"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-secondary-dark border border-white/8 rounded-xl shadow-2xl overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-accent-primary text-sm font-bold">
                      {userInitial}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate leading-none">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-text-muted text-xs truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/8 transition-all duration-150 cursor-pointer text-sm"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

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
            <p className="text-text-muted text-sm mb-1">
              Are you sure you want to log out?
            </p>
            <p className="text-text-muted/60 text-xs mb-6 truncate">
              {user?.email}
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
