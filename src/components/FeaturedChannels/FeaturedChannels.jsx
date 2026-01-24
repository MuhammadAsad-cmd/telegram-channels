"use client";

import { featuredChannels } from "@/data/featuredChannels";
import ChannelCard from "./ChannelCard";

export default function FeaturedChannels() {
  return (
    <section className="py-16 bg-secondary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary">Featured Channels</h2>
          <p className="text-text-muted mt-1">
            Discover the most popular Telegram channels
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </section>
  );
}
