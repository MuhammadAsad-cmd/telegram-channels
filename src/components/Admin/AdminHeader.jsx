"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, LogOut, ChevronDown, ShieldCheck, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { useAdminAuthContext } from "@/context/AdminAuthContext";
import { adminChangePassword } from "@/lib/api/adminService";
import { toast } from "sonner";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/admin-dashboard/admins": "Admins",
  "/admin-dashboard/channels": "Channels",
  "/admin-dashboard/channels/create": "Add Channel",
  "/admin-dashboard/categories": "Categories",
  "/admin-dashboard/crypto": "Payment Methods",
  "/admin-dashboard/requests": "Requests",
  "/admin-dashboard/invoices": "Invoices",
  "/admin-dashboard/users": "Users",
  "/admin-dashboard/contacts": "Contacts",
  "/admin-dashboard/blogs": "Blogs",
};

function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key + "/")) return value;
  }
  return "Admin Panel";
}

function ChangePasswordModal({ onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await adminChangePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Failed to change password";
      toast.error(typeof msg === "string" ? msg : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-md p-6">
        <h3 className="text-text-primary font-semibold text-lg mb-4">
          Change Password
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Current password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              New password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-text-muted/60 text-[10px] mt-1">Minimum 6 characters</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminHeader({ onMenuClick }) {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
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

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setDropdownOpen(false);
    logout();
    window.location.href = "/admin-dashboard/login";
  };

  const userInitial =
    admin?.name?.[0]?.toUpperCase() ||
    admin?.email?.[0]?.toUpperCase() ||
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
              {admin?.name || "Admin"}
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
                      {admin?.name || "Admin"}
                    </p>
                    <p className="text-text-muted text-xs truncate mt-0.5">
                      {admin?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowChangePassword(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/8 transition-all duration-150 cursor-pointer text-sm"
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Change password</span>
                </button>
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

      {/* Change password modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            toast.success("Password changed successfully");
          }}
        />
      )}

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
              {admin?.email}
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
