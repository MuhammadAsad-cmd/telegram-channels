"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Send, Plus, Search, User, Settings, LogOut } from "lucide-react";
import Dropdown from "./Dropdown";
import CategoriesMenu from "./CategoriesMenu";
import MediaMenu from "./MediaMenu";
import Link from "next/link";
import AddLinkModal from "../Modal/AddLinkModal";
import LogoutModal from "../Modal/LogoutModal";
import { useAuthContext } from "@/context/AuthContext";

const MotionLink = motion.create(Link);

export default function Header() {
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();

  return (
    <>
      <header className="bg-primary-dark/95 backdrop-blur-sm border-b border-white/6 sticky top-0 z-50">
        <nav className="max-w-[1344px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <MotionLink
                href="/"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 text-text-primary hover:text-accent-primary transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
                <span className="font-semibold text-lg tracking-tight">
                  Telegram Channels
                </span>
              </MotionLink>

              <div className="hidden md:flex items-center gap-1">
                <Dropdown trigger={<span className="text-sm">Categories</span>}>
                  <CategoriesMenu />
                </Dropdown>

                {/* <Dropdown trigger={<span className="text-sm">Media</span>}>
                  <MediaMenu />
                </Dropdown> */}

                <MotionLink
                  href="#"
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Top 100
                </MotionLink>

                <MotionLink
                  href="/trending"
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Trending
                </MotionLink>

                <MotionLink
                  href="/ranking"
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Ranking
                </MotionLink>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                onClick={() => setIsAddLinkModalOpen(true)}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="hidden sm:flex items-center gap-1.5 text-accent-primary hover:text-accent-primary/80 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </motion.button>
              <MotionLink
                href="/search"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="text-text-muted hover:text-text-primary p-2 transition-colors duration-200 ml-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </MotionLink>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Dropdown
                        trigger={
                          <span className="flex items-center gap-2 cursor-pointer">
                            {user?.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-text-muted" />
                              </div>
                            )}
                            <span className="hidden sm:inline text-sm text-text-muted max-w-[100px] truncate">
                              {user?.name ?? "Account"}
                            </span>
                          </span>
                        }
                        align="right"
                      >
                        <div className="min-w-[200px] bg-secondary-dark border border-white/6 rounded-lg py-2 shadow-xl">
                          <Link
                            href="/cp"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-white/5 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/cp/account-setting"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-white/5 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Account Setting
                          </Link>
                          <button
                            type="button"
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-accent-red/10 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      </Dropdown>
                    </>
                  ) : (
                    <>
                      <MotionLink
                        href="/login"
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                      >
                        Login
                      </MotionLink>
                      <MotionLink
                        href="/register"
                        whileHover={{ opacity: 0.95 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Register
                      </MotionLink>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </>
  );
}
