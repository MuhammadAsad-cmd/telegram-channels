"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Users,
  Star,
  Globe,
  Trophy,
  Clock,
} from "lucide-react";
import Breadcrumb from "@/components/Search/Breadcrumb";
import { fetchChannelBySlug, fetchChannels } from "@/lib/api/channelService";
import { ChannelDetailsSkeleton } from "@/components/UI/Skeleton";
import Image from "next/image";
import FeaturedChannels from "@/components/FeaturedChannels/FeaturedChannels";

function formatMemberCount(count) {
  if (count == null || count === 0) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getChannelSlug(channel) {
  return channel?.slug || channel?.username?.replace(/_/g, "-") || channel?._id;
}

export default function ChannelDetailPage() {
  const params = useParams();
  const [channel, setChannel] = useState(null);
  const [relatedChannels, setRelatedChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const slug = useMemo(() => {
    if (!params?.slug) return null;
    const s = params.slug;
    return Array.isArray(s) ? s[0] : String(s);
  }, [params?.slug]);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setChannel(null);
      setError("Invalid channel");
      return;
    }
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchChannelBySlug(slug);
        const data = response?.data;
        if (cancelled) return;
        if (data?.result && Array.isArray(data?.data) && data.data.length > 0) {
          const ch = data.data[0];
          if (ch.status !== "approved") {
            setChannel(null);
          } else {
            setChannel(ch);
            const catId = ch?.category?._id;
            const currentSlug = ch?.slug ?? ch?.username?.replace(/_/g, "-");
            if (catId) {
              const relResponse = await fetchChannels({
                category: catId,
                limit: 8,
                sortKey: "memberCount",
                sortBy: "desc",
                status: "approved",
              });
              const rel = relResponse?.data;
              if (!cancelled && rel?.result && Array.isArray(rel?.data)) {
                setRelatedChannels(
                  rel.data
                    .filter((c) => (c.slug ?? c.username?.replace(/_/g, "-")) !== currentSlug)
                    .slice(0, 8)
                );
              }
            }
          }
        } else {
          setChannel(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message ?? err?.message ?? "Failed to load channel");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (isLoading) {
    return <ChannelDetailsSkeleton />;
  }

  if (error || !channel) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#e5ebef]">
        <div className="text-center">
          <p className="text-accent-red mb-4">{error ?? "Channel not found"}</p>
          <Link href="/" className="text-accent-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Telegram Channels", href: "/" },
    {
      label: channel.type
        ? `${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}s`
        : "Channels",
      href: `/search?type=${channel.type || "channel"}`,
    },
    ...(channel.category
      ? [
          {
            label: channel.category.title,
            href: `/search?category=${channel.category._id}`,
          },
        ]
      : []),
    { label: channel.title },
  ];

  return (
    <div className="min-h-screen bg-[#e5ebef]">
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="relative w-44 h-44 mx-auto rounded-xl overflow-hidden bg-gray-100">
                {channel.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image
                    width={176}
                    height={176}
                    unoptimized
                    src={channel.photo}
                    alt={channel.title ?? "Channel"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-gray-800/80 text-white text-[10px] font-medium uppercase px-2 py-0.5 rounded">
                  {channel.type || "channel"}
                </span>
              </div>

              <Link
                href={channel.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                View Channel
              </Link>
              <p className="text-center text-sm text-gray-500 mt-2">
                Can&apos;t Join? @{channel.username}
              </p>

              <div className="mt-6 space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-gray-700">
                    {channel.rating != null && channel.rating > 0
                      ? `${channel.rating} / 5`
                      : "No ratings yet"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {formatMemberCount(channel.memberCount)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Updated: {formatDate(channel.updatedAt)}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{channel.title}</h1>
                  {channel.username && (
                    <p className="text-gray-500 mt-1">@{channel.username}</p>
                  )}
                </div>
                {/* <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-accent-primary transition-colors shrink-0"
                  aria-label="Bookmark"
                >
                  <Bookmark className="w-5 h-5" />
                </button> */}
              </div>

              {(channel.description || channel.longDescription) && (
                <div className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {channel.longDescription || channel.description}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <Globe className="w-5 h-5 text-accent-primary mb-2" />
                <p className="text-xs text-gray-500">Global Rank</p>
                <p className="font-semibold text-gray-800">
                  #{channel.globalRank?.currentRank ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <span className="text-sm font-medium text-gray-600 mb-2 block">GB</span>
                <p className="text-xs text-gray-500">Language Rank</p>
                <p className="font-semibold text-gray-800">
                  #{channel.languageRank?.currentRank ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-xs text-gray-500">Category Rank</p>
                <p className="font-semibold text-gray-800">
                  #{channel.categoryRank?.currentRank ?? 0}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <Clock className="w-5 h-5 text-gray-500 mb-2" />
                <p className="text-xs text-gray-500">24h Change</p>
                <p className="font-semibold text-gray-800">
                  {channel.changeWith24H?.currentRank ?? 0}
                  {channel.changeWith24H?.statusRank === "up" && (
                    <span className="text-green-500 ml-1">↑</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1">Subscribers</h3>
              <p className="text-sm text-gray-500">@{channel.username}</p>
              <div className="mt-4 h-24 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-sm">
                Chart placeholder
              </div>
            </div>

            {/* <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Rate this channel</h3>
              <p className="text-sm text-gray-500 mb-4">
                Login or click ↗ @dailychannelsbot to rate this channel via Telegram
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-800">Comments</span>
                <span className="ml-auto text-sm text-accent-primary">Login to comment</span>
              </div>
              <textarea
                placeholder="Your comment..."
                className="mt-3 w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 resize-none"
                rows={3}
                disabled
              />
              <button
                type="button"
                disabled
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm cursor-not-allowed"
              >
                Send
              </button>
            </div> */}

            {relatedChannels.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Telegram Channels You May Like
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedChannels.map((ch) => (
                    <Link
                      key={ch._id}
                      href={`/channel/${getChannelSlug(ch)}`}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        {ch.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <Image
                            width={56}
                            height={56}
                            unoptimized
                            src={ch.photo}
                            alt={ch.title ?? "Channel"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-800 truncate w-full text-center group-hover:text-accent-primary">
                        {ch.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatMemberCount(ch.memberCount)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-width featured section (match Home cards styling) */}
      <FeaturedChannels
        filter="channels"
        sectionVariant="dark"
        cardVariant="light"
        withSectionBackground={false}
        showFeaturedBadge
        title="Featured Channels"
        subtitle="Recommended Telegram channels for you"
        limit={8}
      />
    </div>
  );
}
