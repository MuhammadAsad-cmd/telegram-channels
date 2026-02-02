"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight, ExternalLink } from "lucide-react";
import { trendingChannels } from "@/data/trendingData";
import Image from "next/image";

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(trendingChannels.length / itemsPerPage);
  const paginatedChannels = trendingChannels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Breadcrumb */}
      <div className="bg-secondary-dark border-b border-white/6">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-text-muted hover:text-accent-primary transition-colors">
              Telegram Channels
            </Link>
            <span className="text-text-muted/50">/</span>
            <span className="text-text-primary">Trending Channels</span>
          </nav>
          <div className="flex gap-2">
            <Link
              href="/trending"
              className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium"
            >
              Trending Channels
            </Link>
            <Link
              href="/ranking"
              className="px-4 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Trending Media
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-6">
            <Flame className="w-10 h-10 text-accent-red" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-3">
            Trending channels in Telegram in the last 24 hours!
          </h1>
          <p className="text-text-muted max-w-2xl mb-4">
            This is the list of Telegram channels that got the most eyeballs daily based on their
            increase of members.
          </p>
          <p className="text-text-muted/60 text-sm">
            Last Update: {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}, at 12 AM
          </p>
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedChannels.map((channel, idx) => (
            <div
              key={channel.rank}
              className="group relative bg-secondary-dark border border-white/6 rounded-xl p-5 hover:border-accent-primary/30 transition-all duration-200"
            >
              <span className="absolute top-4 right-4 text-text-muted/50 group-hover:text-accent-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </span>
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-primary-dark flex items-center justify-center text-text-muted text-sm font-medium">
                  {channel.rank}
                </span>
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary-dark shrink-0 ring-2 ring-white/6">
                  <Image
                    width={56}
                    height={56}
                    src="https://telegramchannels.me/storage/media-logo/2112/telegramtips-thumb.png"
                    alt=""
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href="#"
                    className="text-text-primary font-semibold hover:text-accent-primary transition-colors line-clamp-1"
                  >
                    {channel.name}
                  </Link>
                  <p className="text-accent-primary text-sm mt-0.5">{channel.handle}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-text-primary font-medium">{channel.members}</span>
                    <span className="text-accent-secondary text-xs font-medium">{channel.change}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-muted text-sm mt-4 line-clamp-2">{channel.description}</p>
              <Link
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 text-sm font-medium transition-colors"
              >
                Join Channel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}

          {/* Ad Card */}
          <div className="relative bg-secondary-dark border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
            <span className="absolute top-3 right-3 text-xs text-text-muted bg-primary-dark px-2 py-0.5 rounded">Ad</span>
            <p className="text-text-muted text-sm mb-2">Your Channel Here</p>
            <Link
              href="/cp/ads"
              className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Promote Now
            </Link>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-secondary-dark border border-white/6 text-text-primary hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-accent-primary text-white"
                    : "bg-secondary-dark border border-white/6 text-text-muted hover:text-text-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-secondary-dark border border-white/6 text-text-primary hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
