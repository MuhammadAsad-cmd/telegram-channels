"use client";

import { motion } from "motion/react";
import { useChannels } from "@/hooks/useChannels";
import ChannelCard from "./ChannelCard";
import { Skeleton } from "@/components/UI/Skeleton";

function ChannelCardSkeleton() {
  return (
    <div className="bg-primary-dark border border-white/6 rounded-lg p-4">
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

export default function FeaturedChannels() {
  const { channels, isLoading, error } = useChannels({
    page: 1,
    limit: 8,
    sortKey: "memberCount",
    sortBy: "desc",
  });

  return (
    <motion.section
      className="py-16 bg-secondary-dark"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1344px] mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary">Featured Channels</h2>
          <p className="text-text-muted mt-1">
            Discover the most popular Telegram channels
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ChannelCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-accent-red text-sm">{error}</p>
        ) : channels.length === 0 ? (
          <p className="text-text-muted">No channels found</p>
        ) : (
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
                  showFeatured
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
