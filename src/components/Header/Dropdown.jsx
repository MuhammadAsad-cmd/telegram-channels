"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ trigger, children, align = "left" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text-primary px-3 py-2 transition-colors duration-200"
      >
        {trigger}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`
          absolute top-full pt-2 z-50
          ${align === "left" ? "left-0" : "right-0"}
          transition-all duration-200 ease-out
          ${isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"}
        `}
      >
        {children}
      </div>
    </div>
  );
}
