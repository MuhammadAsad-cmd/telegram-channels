"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/UI/Skeleton";

function CategoryLogo({ logo }) {
  if (!logo || !logo.startsWith("<svg")) {
    return (
      <div className="w-4 h-4 rounded bg-white/10" />
    );
  }
  return (
    <span
      className="w-4 h-4 shrink-0 text-text-muted group-hover:text-accent-primary transition-colors [&>svg]:w-4 [&>svg]:h-4"
      dangerouslySetInnerHTML={{ __html: logo }}
    />
  );
}

export default function CategoriesMenu() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="bg-secondary-dark border border-white/6 rounded-lg shadow-2xl p-5 min-w-[700px]">
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !categories?.length) {
    return (
      <div className="bg-secondary-dark border border-white/6 rounded-lg shadow-2xl p-5 min-w-[300px]">
        <p className="text-text-muted text-sm">No categories available</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary-dark border border-white/6 rounded-lg shadow-2xl p-5 min-w-[700px] max-h-[400px] overflow-y-auto no-scrollbar">
      <div className="grid grid-cols-3 gap-x-8 gap-y-2">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/search?category=${category._id}`}
            className="flex items-center gap-2.5 text-text-muted hover:text-text-primary py-1.5 transition-colors duration-200 group"
          >
            <CategoryLogo logo={category.logo} />
            <span className="text-sm">{category.title}</span>
            <span className="text-xs text-text-muted/60">
              ({(category.channelCount ?? 0).toLocaleString()})
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
