"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";

export default function SelectDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  searchPlaceholder = "Search...",
  width = "full",
  maxHeight = "280px",
  renderOption,
  renderValue,
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update dropdown position when opened (fixed = viewport-relative)
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 350;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < dropdownHeight && rect.top > spaceBelow;

      setPosition({
        top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 200),
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
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
      setTimeout(() => searchInputRef.current?.focus(), 10);
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
  const widthClass = width === "full" ? "w-full" : "w-full";
  const minWidthClass = "min-w-[200px]";

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: 400,
      }}
    >
      {/* Search Input */}
      {searchable && (
        <div className="p-2 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
            />
          </div>
        </div>
      )}

      {/* Options List */}
      <div
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: maxHeight }}
      >
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-4 text-sm text-gray-500 text-center">
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
                    ? "bg-accent-primary/10 text-accent-primary font-medium"
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
  );

  return (
    <div
      ref={triggerRef}
      className={`relative ${widthClass} ${minWidthClass} ${className}`}
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
          ${isOpen ? "border-accent-primary ring-2 ring-accent-primary/20" : ""}
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

      {/* Dropdown Menu - Rendered via Portal to prevent overflow clipping */}
      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
