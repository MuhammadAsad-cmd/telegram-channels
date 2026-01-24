"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export default function SelectDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  searchPlaceholder = "Search...",
  width = "full",
  maxHeight = "250px",
  renderOption,
  renderValue,
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Width classes
  const widthClass = width === "full" ? "w-full" : `w-[${width}]`;

  return (
    <div
      ref={dropdownRef}
      className={`relative ${widthClass} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 
          bg-white border border-gray-300 rounded-lg px-4 py-2.5
          text-left text-gray-700 
          transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-gray-400 cursor-pointer"}
          ${isOpen ? "border-accent-primary ring-1 ring-accent-primary" : ""}
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            renderValue ? (
              renderValue(selectedOption)
            ) : (
              selectedOption.label
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1 z-50
            bg-white border border-gray-200 rounded-lg shadow-xl
            overflow-hidden
            animate-in fade-in-0 zoom-in-95 duration-150
          `}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`
                    w-full flex items-center justify-between gap-2 px-4 py-2.5
                    text-left text-sm transition-colors duration-150 cursor-pointer
                    ${
                      option.value === value
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="flex items-center gap-2 truncate">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
