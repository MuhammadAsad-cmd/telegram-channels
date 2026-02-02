"use client";

import Image from "next/image";
import { Users, Bot, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ChannelCard({ channel }) {
  return (
    <div className="relative bg-primary-dark border border-white/6 rounded-lg p-4 hover:border-white/12 transition-colors duration-200 group">
      <div className="absolute -top-2 left-4">
        <span className="bg-accent-primary text-white text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded">
          Featured
        </span>
      </div>

      <Link
        href="#"
        className="absolute top-3 right-3 text-text-muted/50 hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100"
      >
        <ExternalLink className="w-4 h-4" />
      </Link>

      <div className="flex items-start gap-3 mt-2">
        <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-secondary-dark ring-2 ring-white/6">
          <Image
            src={channel.image}
            alt={channel.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href="#"
            className="text-text-primary font-medium text-sm hover:text-accent-primary transition-colors line-clamp-2 block"
          >
            {channel.name}
          </Link>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
            {channel.isBot ? (
              <span className="flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Bot</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{channel.subscribers}</span>
              </span>
            )}

            {channel.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent-yellow text-accent-yellow" />
                <span>{channel.rating}</span>
                {channel.reviews && (
                  <span className="text-text-muted/60">({channel.reviews})</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
