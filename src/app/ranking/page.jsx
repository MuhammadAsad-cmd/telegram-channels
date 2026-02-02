"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Megaphone,
  Users,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  Leaf,
} from "lucide-react";
import { topStats, topThree, rankingItems } from "@/data/rankingData";
import AddLinkModal from "@/components/Modal/AddLinkModal";
import Image from "next/image";
const categoryOptions = ["All Categories", "Crypto", "Finance", "Technology", "News", "Entertainment"];
const languageOptions = ["All Languages", "English", "Russian", "Spanish", "Arabic"];
const timeOptions = ["Last 24 hours", "Last 7 days", "Last 30 days", "All Time"];
const sortOptions = ["Subscribers", "Rank Change", "Name", "Category"];

const medalColors = ["#fbbf24", "#94a3b8", "#d97706"];

export default function RankingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [language, setLanguage] = useState("All Languages");
  const [timeFilter, setTimeFilter] = useState("Last 30 days");
  const [sortBy, setSortBy] = useState("Subscribers");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredItems = rankingItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === "All Categories" || item.category === category)
  );

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Breadcrumb */}
      <div className="bg-secondary-dark border-b border-white/6">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text-muted hover:text-accent-primary transition-colors">
              Telegram Channels
            </Link>
            <span className="text-text-muted/50">/</span>
            <span className="text-text-primary">Media Ranking</span>
          </nav>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          <div className="order-2 md:order-1 flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-secondary-dark ring-4 ring-white/10 shrink-0 mb-4">
            {topThree[1]?.image && (
              <Image
                width={96}
                height={96}
                src={topThree[1]?.image}
                alt=""
                unoptimized
                className="w-full h-full object-cover"
              />
              )}
            </div>
            <p className="text-accent-primary text-sm font-medium">{topThree[1]?.handle}</p>
            <p className="text-text-muted text-sm">{topThree[1]?.subscribers}</p>
            <div className="mt-4 w-12 h-12 rounded-full flex items-center justify-center bg-slate-400/20">
              <Medal className="w-6 h-6" style={{ color: medalColors[1] }} />
            </div>
            <span className="text-2xl font-bold text-text-primary mt-1">2</span>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2 flex flex-col items-center -mt-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-secondary-dark ring-4 ring-accent-yellow/50 shrink-0 mb-4">
            {topThree[0]?.image && (
              <Image
                width={128}
                height={128}
                src={topThree[0]?.image}
                alt=""
                unoptimized
                className="w-full h-full object-cover"
              />
              )}
            </div>
            <p className="text-accent-primary text-sm font-medium">{topThree[0]?.handle}</p>
            <p className="text-text-muted text-sm">{topThree[0]?.subscribers}</p>
            <div className="mt-4 w-14 h-14 rounded-full flex items-center justify-center bg-accent-yellow/20">
              <Medal className="w-8 h-8" style={{ color: medalColors[0] }} />
            </div>
            <span className="text-3xl font-bold text-text-primary mt-1">1</span>
          </div>

          {/* 3rd Place */}
          <div className="order-3 flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-secondary-dark ring-4 ring-white/10 shrink-0 mb-4">
            {topThree[2]?.image && (
              <Image
                width={96}
                height={96}
                src={topThree[2]?.image}
                alt=""
                unoptimized
                className="w-full h-full object-cover"
              />
              )}
            </div>
            <p className="text-accent-primary text-sm font-medium">{topThree[2]?.handle}</p>
            <p className="text-text-muted text-sm">{topThree[2]?.subscribers}</p>
            <div className="mt-4 w-12 h-12 rounded-full flex items-center justify-center bg-amber-700/20">
              <Medal className="w-6 h-6" style={{ color: medalColors[2] }} />
            </div>
            <span className="text-2xl font-bold text-text-primary mt-1">3</span>
          </div>
        </div>
      </div>

      {/* Leaders Section */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Leaf className="w-5 h-5 text-accent-primary/60" />
          <h2 className="text-xl font-semibold text-text-primary text-center">
            Leaders Across All Languages: All Categories
          </h2>
          <Leaf className="w-5 h-5 text-accent-primary/60" />
        </div>
      </div>

      {/* Discover Section */}
      <div className="bg-secondary-dark border-y border-white/6">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-10">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Discover the World&apos;s Biggest Telegram Channels and Groups!
          </h3>
          <div className="space-y-3 text-text-muted text-sm leading-relaxed">
            <p>Looking for the most popular places on Telegram?</p>
            <p>
              This daily updated global ranking shows the largest channels and groups by subscriber
              count — ideal for finding trending communities! Easily explore with filters by
              language, category (like crypto, news, entertainment, or gaming), and genre (channel
              or group).
            </p>
            <p>
              The ranking table includes current subscriber counts, recent daily changes, and quick
              join links so you can join right away and see what&apos;s trending today!
            </p>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topStats.map((stat) => {
            const Icon = stat.icon === "bot" ? Bot : stat.icon === "channel" ? Megaphone : Users;
            return (
              <Link
                key={stat.type}
                href={`#${stat.type}`}
                className="group flex items-center gap-4 p-6 bg-secondary-dark rounded-xl border border-white/6 hover:border-accent-primary/30 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-accent-primary" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 bg-secondary-dark border border-white/6 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-primary"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2.5 bg-secondary-dark border border-white/6 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-primary"
          >
            {languageOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="flex gap-1">
            {timeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTimeFilter(opt)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === opt
                    ? "bg-accent-primary text-white"
                    : "bg-secondary-dark text-text-muted hover:text-text-primary border border-white/6"
                }`}
              >
                {opt.replace("Last ", "").replace(" days", "d").replace(" hours", "h")}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-text-muted text-sm">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-secondary-dark border border-white/6 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full pl-12 pr-4 py-3 bg-secondary-dark border border-white/6 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add New Channel
          </button>
        </div>

        {/* Ranking Table */}
        <div className="bg-secondary-dark border border-white/6 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left py-4 px-4 text-text-muted text-sm font-medium w-16">#</th>
                  <th className="text-left py-4 px-4 text-text-muted text-sm font-medium">Media</th>
                  <th className="text-left py-4 px-4 text-text-muted text-sm font-medium hidden md:table-cell">Category</th>
                  <th className="text-left py-4 px-4 text-text-muted text-sm font-medium">Subscribers</th>
                  <th className="text-left py-4 px-4 text-text-muted text-sm font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, idx) => (
                  <tr
                    key={item.rank}
                    className={`border-b border-white/6 last:border-0 hover:bg-white/2 transition-colors ${
                      idx % 2 === 1 ? "bg-white/2" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-dark text-text-muted text-sm font-medium">
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-dark shrink-0 ring-2 ring-white/6">
                          <Image
                            width={48}  
                            height={48}
                            src="https://telegramchannels.me/storage/media-logo/2112/telegramtips-thumb.png"
                            alt=""
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href="#"
                            className="text-text-primary font-medium hover:text-accent-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-text-muted text-xs mt-0.5">{item.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-primary-dark text-text-muted text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-text-primary font-medium">{item.subscribers}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          item.change > 0
                            ? "text-accent-secondary"
                            : item.change < 0
                            ? "text-accent-red"
                            : "text-text-muted"
                        }`}
                      >
                        {item.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : item.change < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        {item.change > 0 ? "+" : ""}{item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            No results found. Try adjusting your filters.
          </div>
        )}
      </div>

      <AddLinkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
