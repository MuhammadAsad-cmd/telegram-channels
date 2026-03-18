"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/UI/Skeleton";
import { fetchFeaturedChannels } from "@/lib/api/channelService";
import ChannelCard from "./ChannelCard";

function ChannelCardSkeleton({ cardVariant }) {
  return (
    <div
      className={
        cardVariant === "light"
          ? "bg-gray-100 border border-gray-200 rounded-lg p-4"
          : "bg-primary-dark border border-white/6 rounded-lg p-4"
      }
    >
      <div className="flex items-start gap-3 mt-2">
        <Skeleton className="w-14 h-14 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedChannels({
  filter = "all",
  title = "Featured Channels",
  subtitle = "Discover the most popular Telegram channels",
  limit = 8,
  showFeaturedBadge = true,
  sectionVariant = "dark", // "dark" | "light"
  withSectionBackground = true,
  contentPaddingClassName = "px-4 md:px-8",
  className = "",
  cardVariant = "dark", // forwarded to ChannelCard
}) {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizedFilter = useMemo(() => String(filter || "all"), [filter]);

  // When we don't render a dark background, we also shouldn't use dark-theme heading text.
  const effectiveVariant = !withSectionBackground ? "light" : sectionVariant;

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setChannels([]);

    fetchFeaturedChannels({ filter: normalizedFilter })
      .then((res) => {
        const list = res?.data?.data ?? res?.data ?? [];
        if (cancelled) return;
        setChannels(Array.isArray(list) ? list.slice(0, limit) : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to load featured channels",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedFilter, limit]);

  const container =
    sectionVariant === "light" ? (
      <section
        className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {subtitle ? (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          ) : null}
        </div>
        {renderGrid({
          channels,
          isLoading,
          error,
          showFeaturedBadge,
          cardVariant,
          sectionVariant,
        })}
      </section>
    ) : (
      <motion.section
        className={`py-8 ${withSectionBackground ? "bg-secondary-dark" : ""} ${className}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`max-w-[1344px] mx-auto ${contentPaddingClassName}`}>
          <div className="mb-8">
            <h2
              className={
                effectiveVariant === "light"
                  ? "text-2xl font-semibold text-gray-800"
                  : "text-2xl font-semibold text-text-primary"
              }
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                className={
                  effectiveVariant === "light"
                    ? "text-gray-500 mt-1"
                    : "text-text-muted mt-1"
                }
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {renderGrid({
            channels,
            isLoading,
            error,
            showFeaturedBadge,
            cardVariant,
            sectionVariant: effectiveVariant,
          })}
        </div>
      </motion.section>
    );

  return container;
}

function renderGrid({
  channels,
  isLoading,
  error,
  showFeaturedBadge,
  cardVariant,
  sectionVariant,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ChannelCardSkeleton key={i} cardVariant={cardVariant} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-accent-red text-sm">{error}</p>;
  }

  if (!channels || channels.length === 0) {
    return (
      <p
        className={
          sectionVariant === "light" ? "text-gray-500" : "text-text-muted"
        }
      >
        No channels found
      </p>
    );
  }

  if (sectionVariant === "light") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {channels.map((channel) => (
          <ChannelCard
            key={channel._id}
            channel={channel}
            showFeatured={showFeaturedBadge}
            variant={cardVariant}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {channels.map((channel) => (
        <motion.div
          key={channel._id}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
        >
          <ChannelCard
            channel={channel}
            showFeatured={showFeaturedBadge}
            variant={cardVariant}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
