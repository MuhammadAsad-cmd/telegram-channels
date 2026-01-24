"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <nav className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-accent-primary" />
          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-400">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-accent-primary hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-600">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
