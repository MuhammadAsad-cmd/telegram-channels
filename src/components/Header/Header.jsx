"use client";

import { useState } from "react";
import { Send, Plus, Search } from "lucide-react";
import Dropdown from "./Dropdown";
import CategoriesMenu from "./CategoriesMenu";
import MediaMenu from "./MediaMenu";
import Link from "next/link";
import AddLinkModal from "../Modal/AddLinkModal";

export default function Header() {
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

  return (
    <>
      <header className="bg-primary-dark/95 backdrop-blur-sm border-b border-white/6 sticky top-0 z-50">
        <nav className="max-w-[1344px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="flex items-center gap-2.5 text-text-primary hover:text-accent-primary transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
                <span className="font-semibold text-lg tracking-tight">Telegram Channels</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                <Dropdown trigger={<span className="text-sm">Categories</span>}>
                  <CategoriesMenu />
                </Dropdown>

                <Dropdown trigger={<span className="text-sm">Media</span>}>
                  <MediaMenu />
                </Dropdown>

                <Link
                  href="#"
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Top 100
                </Link>

                <Link
                  href="#"
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Trending
                </Link>

                <Link
                  href="#"
                  className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
                >
                  Ranking
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddLinkModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 text-accent-primary hover:text-accent-primary/80 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>

              <Link
                href="/login"
                className="text-text-muted hover:text-text-primary px-3 py-2 text-sm transition-colors duration-200"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Register
              </Link>

              <Link
                href="/search"
                className="text-text-muted hover:text-text-primary p-2 transition-colors duration-200 ml-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Add Link Modal */}
      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
      />
    </>
  );
}
