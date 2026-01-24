"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 flex-1 px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ..."
            className="flex-1 py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-accent-primary hover:bg-accent-primary/90 text-white px-6 py-3 transition-colors duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
