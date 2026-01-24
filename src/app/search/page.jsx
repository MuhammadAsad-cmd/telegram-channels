"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Search/Breadcrumb";
import SearchInput from "@/components/Search/SearchInput";
import PopularTags from "@/components/Search/PopularTags";
import TelegramIcon from "@/components/Search/TelegramIcon";

// Sample featured channels data
const featuredChannels = [
  {
    id: 1,
    name: "Lewis Kelly Forex Signals",
    description: "This is the Only Official Telegram Channel of LEWIS KELLY FOREX SIGNALS. Subscribe To My YouTu...",
    image: "https://telegramchannels.me/storage/media-logo/2512/tradingwithrayne001-thumb.png",
  },
  {
    id: 2,
    name: "EliteTradingSignals (Free Gold Forex...",
    description: "Join the best Forex trading signals Telegram channel for high accuracy signals, update and expert analysis...",
    image: "https://telegramchannels.me/storage/media-logo/2601/sureshotfx5-thumb.png",
  },
];

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // TODO: Implement actual search functionality
  };

  const breadcrumbItems = [
    { label: "Telegram Channels", href: "/" },
    { label: "Search" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef]">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Search Hero */}
      <div className="py-12 px-4">
        <div className="max-w-[1344px] mx-auto flex flex-col items-center">
          {/* Telegram Icon */}
          <TelegramIcon className="w-20 h-20 mb-6" />

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3 text-center">
            Search Telegram Channels
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 mb-8 text-center">
            Use a keyword to find the related media in Telegram!
          </p>

          {/* Search Input */}
          <SearchInput onSearch={handleSearch} />

          {/* Popular Tags */}
          <div className="mt-8">
            <PopularTags />
          </div>
        </div>
      </div>

      {/* Featured Channels */}
      <div className="py-8 px-4">
        <div className="max-w-[1344px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredChannels.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm border border-gray-100 relative"
              >
                {/* Ad Badge */}
                <span className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  Ad
                </span>

                {/* Channel Image */}
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={channel.image}
                    alt={channel.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Channel Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                    {channel.name}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2">
                    {channel.description}
                  </p>
                </div>

                {/* Join Button */}
                <button
                  type="button"
                  className="shrink-0 flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Join on Telegram
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
