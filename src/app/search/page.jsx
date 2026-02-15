"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Search/Breadcrumb";
import SearchInput from "@/components/Search/SearchInput";
import PopularTags from "@/components/Search/PopularTags";
import TelegramIcon from "@/components/Search/TelegramIcon";
import ChannelCard from "@/components/FeaturedChannels/ChannelCard";
import { useChannels } from "@/hooks/useChannels";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/UI/Skeleton";
import SelectDropdown from "@/components/UI/SelectDropdown";

const MotionLink = motion.create(Link);

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "channel", label: "Channels" },
  { value: "group", label: "Groups" },
  { value: "bot", label: "Bots" },
  { value: "sticker", label: "Stickers" },
];

const SORT_OPTIONS = [
  { value: "memberCount", label: "Members" },
  { value: "createdAt", label: "Newest" },
  { value: "rating", label: "Rating" },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const type = searchParams.get("type") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const sortKey = searchParams.get("sortKey") ?? "memberCount";
  const sortBy = searchParams.get("sortBy") ?? "desc";

  const { categories } = useCategories();
  const filters = {
    category: category || undefined,
    type: type || undefined,
    search: search || undefined,
    page,
    limit: 20,
    sortKey,
    sortBy,
  };

  const { channels, pagination, isLoading, error, updateFilters } = useChannels(filters);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    updateFilters(filters);
  }, [category, type, search, page, sortKey, sortBy]);

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", query);
    params.set("page", "1");
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(categories?.map((c) => ({ value: c._id, label: c.title })) ?? []),
  ];

  const breadcrumbItems = [
    { label: "Telegram Channels", href: "/" },
    { label: "Search" },
  ];

  const hasActiveSearch = !!(
    search ||
    category ||
    type ||
    (channels?.length > 0 && !isLoading)
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e8ecf0]">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero - Clean search section */}
      <div className="py-14 px-4 md:py-16">
        <motion.div
          className="max-w-[720px] mx-auto flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TelegramIcon className="w-20 h-20 mb-6 text-accent-primary/80" />
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3 text-center">
            Search Telegram Channels
          </h1>
          <p className="text-gray-500 mb-8 text-center text-base">
            Use a keyword to find the related media in Telegram!
          </p>

          <div className="w-full max-w-xl">
            <SearchInput
              initialQuery={search}
              onSearch={handleSearch}
            />
          </div>

          <div className="mt-10 w-full">
            <PopularTags onTagClick={(tag) => handleSearch(tag)} />
          </div>
        </motion.div>
      </div>

      {/* Filters - Only show when viewing results */}
      {hasActiveSearch && (
        <div className="bg-white border-y border-gray-200/80 shadow-sm">
          <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-4">
            <div className="flex flex-wrap items-center gap-4 overflow-visible">
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <span className="text-sm text-gray-500">Category</span>
                  <SelectDropdown
                    options={categoryOptions}
                    value={category}
                    onChange={(v) => handleFilterChange("category", v)}
                    placeholder="All Categories"
                    searchable
                    searchPlaceholder="Search categories..."
                    className="min-w-[180px]"
                  />
                </div>
                <div className="flex items-center gap-2 min-w-[140px]">
                  <span className="text-sm text-gray-500">Type</span>
                  <SelectDropdown
                    options={TYPE_OPTIONS}
                    value={type}
                    onChange={(v) => handleFilterChange("type", v)}
                    placeholder="All"
                    className="min-w-[140px]"
                  />
                </div>
                <div className="flex items-center gap-2 min-w-[140px]">
                  <span className="text-sm text-gray-500">Sort by</span>
                  <SelectDropdown
                    options={SORT_OPTIONS}
                    value={sortKey}
                    onChange={(v) => handleFilterChange("sortKey", v)}
                    className="min-w-[140px]"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={() => handleFilterChange("sortBy", sortBy === "desc" ? "asc" : "desc")}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 py-2 text-sm text-accent-primary hover:bg-accent-primary/5 rounded-lg transition-colors cursor-pointer"
                >
                  {sortBy === "desc" ? "↑ Descending" : "↓ Ascending"}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="py-8 px-4 md:py-10">
        <div className="max-w-[1344px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-accent-red">{error}</p>
          ) : channels.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No channels found. Try different filters.</p>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5 }}
              >
                {channels.map((channel) => (
                  <div
                    key={channel._id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col"
                  >
                    <ChannelCard channel={channel} variant="light" />
                    <MotionLink
                      href={channel.inviteLink ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="mt-3 flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-full"
                    >
                      Join on Telegram
                      <ArrowRight className="w-4 h-4" />
                    </MotionLink>
                  </div>
                ))}
              </motion.div>

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <motion.button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <span className="text-sm text-gray-600 px-4">
                    Page {page} of {pagination.pages}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.pages}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center">
        <Skeleton className="h-12 w-64" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
