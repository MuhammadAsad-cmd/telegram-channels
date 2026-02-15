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

export default function PopularTags({ onTagClick }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Smile className="w-5 h-5 text-gray-400 shrink-0" />
        {popularTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagClick?.(tag)}
            className="px-4 py-2 bg-white/90 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/5 transition-all duration-200"
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="text-gray-500 text-sm">
        The most searched phrases in the last 30 days.
      </p>
    </div>
  );
}
