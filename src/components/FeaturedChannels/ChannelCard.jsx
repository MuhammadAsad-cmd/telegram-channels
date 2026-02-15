"use client";

import { motion } from "motion/react";
import { Users, Bot, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function formatMemberCount(count) {
  if (count == null || count === 0) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export default function ChannelCard({ channel, showFeatured = false, variant = "dark", linkToDetail = true }) {
  // Support both API structure and legacy structure
  const title = channel?.title ?? channel?.name;
  const image = channel?.photo ?? channel?.image;
  const memberCount = channel?.memberCount ?? channel?.subscribers;
  const isBot = channel?.type === "bot";
  const rating = channel?.rating;
  const ratingCount = channel?.ratingCount ?? channel?.reviews;
  const inviteLink = channel?.inviteLink ?? "#";
  const channelSlug = channel?.slug || channel?.username?.replace(/_/g, "-") || channel?._id;
  const detailHref = linkToDetail && channelSlug ? `/channel/${channelSlug}` : null;

  const isLight = variant === "light";
  const cardClasses = isLight
    ? "relative bg-white border border-gray-100 rounded-lg p-4 group"
    : "relative bg-primary-dark border border-white/6 rounded-lg p-4 group";

  const hoverBorder = isLight ? "rgba(229, 231, 235, 1)" : "rgba(59, 130, 246, 0.3)";

  const cardContent = (
    <>
      {showFeatured && (
        <div className="absolute -top-2 left-4">
          <span className="bg-accent-primary text-white text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded">
            Featured
          </span>
        </div>
      )}

      <button
        type="button"
        className={`absolute top-3 right-3 p-1 transition-colors opacity-0 group-hover:opacity-100 z-10 bg-transparent border-0 cursor-pointer ${isLight ? "text-gray-400 hover:text-accent-primary" : "text-text-muted/50 hover:text-accent-primary"}`}
        aria-label="Open in Telegram"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(inviteLink, "_blank");
        }}
      >
        <ExternalLink className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mt-2">
        <div className={`relative w-14 h-14 shrink-0 rounded-full overflow-hidden ring-2 ${isLight ? "bg-gray-100 ring-gray-200" : "bg-secondary-dark ring-white/6"}`}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              width={56}
              height={56}
              unoptimized
              src={image}
              alt={title ?? "Channel"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
              <Users className={`w-6 h-6 ${isLight ? "text-gray-500" : "text-text-muted"}`} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <span className={`font-medium text-sm hover:text-accent-primary transition-colors line-clamp-2 block ${isLight ? "text-gray-800" : "text-text-primary"}`}>
            {title}
          </span>

          <div className={`flex items-center gap-2 mt-1.5 text-xs ${isLight ? "text-gray-500" : "text-text-muted"}`}>
            {isBot ? (
              <span className="flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Bot</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {typeof memberCount === "number"
                    ? formatMemberCount(memberCount)
                    : memberCount ?? "0"}
                </span>
              </span>
            )}

            {rating != null && rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent-yellow text-accent-yellow" />
                <span>{rating}</span>
                {ratingCount != null && ratingCount > 0 && (
                  <span className={isLight ? "text-gray-400" : "text-text-muted/60"}>({ratingCount})</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const motionProps = {
    className: cardClasses,
    whileHover: { scale: 1.02, y: -2, borderColor: hoverBorder },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (detailHref) {
    return (
      <Link href={detailHref} className="block">
        <motion.div {...motionProps}>{cardContent}</motion.div>
      </Link>
    );
  }

  return <motion.div {...motionProps}>{cardContent}</motion.div>;
}
