"use client";

import { Smile } from "lucide-react";

const popularTags = [
  "link share",
  "cp",
  "trading",
  "news",
  "cryptos",
  "crypto trading",
  "stl",
  "forex",
  "movies",
  "music",
];

export default function PopularTags() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Smile className="w-5 h-5 text-gray-400" />
        {popularTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-600 hover:border-accent-primary hover:text-accent-primary transition-colors duration-200"
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-gray-400 text-sm">
        The most searched phrases in the last 30 days.
      </p>
    </div>
  );
}
