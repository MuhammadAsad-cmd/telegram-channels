"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ChevronDown,
  Plus,
  Search,
  Settings,
  LogOut,
  User,
  Send,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useCategories } from "@/hooks/useCategories";
import { useAuthContext } from "@/context/AuthContext";

const mediaTypes = [
  { label: "Channels", href: "/search?type=channel" },
  { label: "Groups", href: "/search?type=group" },
  { label: "Bots", href: "/search?type=bot" },
  { label: "Stickers", href: "/search?type=sticker" },
];

export default function MobileMenu({ isOpen, onClose }) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [mediaExpanded, setMediaExpanded] = useState(false);
  const { categories, isLoading } = useCategories();
  const { isAuthenticated, user, logout } = useAuthContext();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setCategoriesExpanded(false);
      setMediaExpanded(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    onClose();
    await signOut({ redirect: false });
    await logout();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-screen overflow-y-auto no-scrollbar w-80 bg-secondary-dark border-l border-white/6 z-9999999 lg:hidden flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 999999, height: "100dvh", width: "100dvw" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/6 shrink-0 w-full">
          <div className="flex items-center gap-2 text-text-primary">
            <Send className="w-4 h-4" />
            <span className="font-semibold text-sm">Telegram Channels</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 h-full">
          <div>
            <button
              type="button"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full flex items-center justify-between px-3 py-3 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium">Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoriesExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {categoriesExpanded && (
              <div className="mt-0.5 ml-2 space-y-0.5">
                {isLoading ? (
                  <div className="px-3 py-2 text-xs text-text-muted">
                    Loading...
                  </div>
                ) : (
                  categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/search?category=${cat._id}`}
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-3 py-2 text-xs text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <span>{cat.title}</span>
                      <span className="text-text-muted/50">
                        {(cat.channelCount ?? 0).toLocaleString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => setMediaExpanded(!mediaExpanded)}
              className="w-full flex items-center justify-between px-3 py-3 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium">Media</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mediaExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {mediaExpanded && (
              <div className="mt-0.5 ml-2 space-y-0.5">
                {mediaTypes.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2 text-xs text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/search?sortKey=createdAt"
            onClick={handleLinkClick}
            className="flex items-center px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
          >
            Top 100
          </Link>

          <Link
            href="/search?sortKey=currentRank"
            onClick={handleLinkClick}
            className="flex items-center px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
          >
            Ranking
          </Link>

          <Link
            href="/search?sortKey=rating"
            onClick={handleLinkClick}
            className="flex items-center px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
          >
            Trending
          </Link>

          <div className="h-px bg-white/6 my-2" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-text-muted" />
                  </div>
                )}
                <span className="text-sm text-text-primary truncate">
                  {user?.name ?? "Account"}
                </span>
              </div>
              <Link
                href="/cp"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4 shrink-0" />
                Dashboard
              </Link>
              <Link
                href="/cp/account-setting"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Account Setting
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="flex items-center px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="flex items-center px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}

          <div className="h-px bg-white/6 my-2" />

          <Link
            href="/search"
            onClick={handleLinkClick}
            className="flex items-center gap-2 px-3 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4 shrink-0" />
            Search
          </Link>
        </nav>
      </div>
    </>
  );
}
