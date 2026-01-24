"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Sparkles } from "lucide-react";
import { CiFilter } from "react-icons/ci";

const filterOptions = ["All", "Channels", "Groups", "Bots", "Stickers"];

export default function SearchBar() {
  const [filter, setFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl md:rounded-full shadow-2xl shadow-black/20 p-2 flex md:flex-row flex-col items-center gap-y-2 w-full">
      <div className="flex items-center gap-3 flex-1 pl-4 max-md:py-2 max-md:border max-md:border-gray-200 max-md:rounded-lg w-full">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search channels, groups, bots..."
          className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-base"
        />
      </div>

      <div className="relative" ref={filterRef}>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 cursor-pointer px-4 py-2 border-l border-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <CiFilter className="w-4 h-4" />
          <span className="text-sm font-medium">{filter}</span>
          <ChevronDown
            className={`w-4 h-4 text-accent-primary transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`
            absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[140px] z-50
            transition-all duration-200 ease-out
            ${isFilterOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"}
          `}
        >
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setFilter(option);
                setIsFilterOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200
                ${filter === option ? "text-accent-primary font-medium" : "text-gray-700"}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="max-md:w-full cursor-pointer bg-accent-primary hover:bg-accent-primary/90 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200 text-sm"
      >
        Search
      </button>

      <button
        type="button"
        className="max-md:w-full cursor-pointer flex items-center justify-center gap-2 bg-accent-secondary hover:bg-accent-secondary/90 text-white font-medium px-5 py-3 rounded-full transition-all duration-200 ml-1 text-sm whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4" />
        <span>Lucky</span>
      </button>
    </div>
  );
}
