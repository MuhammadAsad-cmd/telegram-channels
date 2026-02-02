"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children, title, variant = "light", size = "default" }) {
  const isDark = variant === "dark";
  const maxWidthClass = size === "sm" ? "max-w-sm" : "max-w-2xl";
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative rounded-xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isDark
            ? "bg-secondary-dark border border-white/6"
            : "bg-white"
        } ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors cursor-pointer z-10 ${
            isDark ? "text-text-muted hover:text-text-primary" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
