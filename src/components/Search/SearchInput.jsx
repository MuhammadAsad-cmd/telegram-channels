"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchInput({ onSearch, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-black/5 border border-gray-200/80 overflow-hidden">
        <div className="flex items-center gap-3 flex-1 pl-5 pr-2">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, groups, bots..."
            className="flex-1 py-3 min-w-0 text-gray-800 placeholder-gray-400 bg-transparent text-base outline-none"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-accent-primary hover:bg-accent-primary/90 cursor-pointer text-white px-8 py-3.5 transition-colors duration-200 shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
