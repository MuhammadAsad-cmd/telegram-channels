"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";

export default function AdminSearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < dropdownHeight && rect.top > spaceBelow;
      setPosition({
        top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        (opt.label || opt.value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="fixed z-9999 bg-secondary-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: 320,
      }}
    >
      <div className="p-2 border-b border-white/6 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
          />
        </div>
      </div>
      <div className="overflow-y-auto max-h-[260px]">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-text-muted text-center">
            No options found
          </div>
        ) : (
          filteredOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                opt.value === value
                  ? "bg-accent-primary/15 text-accent-primary font-medium"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              }`}
            >
              <span className="capitalize">{opt.label ?? opt.value}</span>
              {opt.value === value && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div ref={triggerRef} className={`relative min-w-[140px] ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-left text-sm transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/8 hover:border-white/15 cursor-pointer"
        } ${isOpen ? "border-accent-primary/50 ring-1 ring-accent-primary/20" : ""}`}
      >
        <span className="text-text-primary truncate capitalize">
          {selectedOption ? selectedOption.label ?? selectedOption.value : (
            <span className="text-text-muted">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
