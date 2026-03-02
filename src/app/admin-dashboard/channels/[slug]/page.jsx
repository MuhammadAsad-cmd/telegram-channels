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
  ArrowLeft,
  Radio,
} from "lucide-react";
import { adminFetchChannelBySlug } from "@/lib/api/adminService";

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

export default function AdminChannelDetailPage() {
  const params = useParams();
  const [channel, setChannel] = useState(null);
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
        const response = await adminFetchChannelBySlug(slug);
        const data = response?.data;
        if (cancelled) return;
        if (data?.result && Array.isArray(data?.data) && data.data.length > 0) {
          setChannel(data.data[0]);
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
    return (
      <div className="space-y-5 max-w-[1200px]">
        <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 shrink-0">
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-6">
              <div className="w-44 h-44 mx-auto rounded-xl bg-white/10 animate-pulse" />
              <div className="h-12 w-full mt-6 bg-white/10 rounded-lg animate-pulse" />
              <div className="mt-6 space-y-3 pt-4 border-t border-white/6">
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </aside>
          <div className="flex-1 space-y-6">
            <div className="h-10 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-24 w-full bg-white/10 rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white/10 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="space-y-5 max-w-[1200px]">
        <Link
          href="/admin-dashboard/channels"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-primary text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to channels
        </Link>
        <div className="rounded-xl border border-white/6 bg-secondary-dark p-8 text-center">
          <p className="text-accent-red">{error ?? "Channel not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Link
          href="/admin-dashboard/channels"
          className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-white/5 transition-colors"
          aria-label="Back to channels"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-text-primary font-bold text-lg">Channel details</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80 shrink-0">
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-6">
            <div className="relative w-44 h-44 mx-auto rounded-xl overflow-hidden bg-white/5">
              {channel.photo ? (
                <img
                  src={channel.photo}
                  alt={channel.title ?? "Channel"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Radio className="w-16 h-16 text-text-muted/40" />
                </div>
              )}
              <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-medium uppercase px-2 py-0.5 rounded">
                {channel.type || "channel"}
              </span>
            </div>

            {channel.inviteLink && (
              <a
                href={channel.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                View Channel
              </a>
            )}
            {channel.username && (
              <p className="text-center text-sm text-text-muted mt-2">
                Can&apos;t Join? @{channel.username}
              </p>
            )}

            <div className="mt-6 space-y-3 pt-4 border-t border-white/6">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-text-primary">
                  {channel.rating != null && channel.rating > 0
                    ? `${channel.rating} / 5`
                    : "No ratings yet"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-text-muted" />
                <span className="text-text-primary">
                  {formatMemberCount(channel.memberCount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-muted text-xs">Status</span>
                <span
                  className={`capitalize text-xs font-medium px-2 py-0.5 rounded ${
                    channel.status === "approved"
                      ? "bg-accent-green/12 text-accent-green"
                      : channel.status === "pending"
                        ? "bg-accent-primary/12 text-accent-primary"
                        : channel.status === "cancelled"
                          ? "bg-accent-red/12 text-accent-red"
                          : "bg-white/10 text-text-muted"
                  }`}
                >
                  {channel.status ?? "—"}
                </span>
              </div>
              <div className="text-xs text-text-muted">
                Updated: {formatDate(channel.updatedAt)}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary">{channel.title}</h2>
            {channel.username && (
              <p className="text-text-muted mt-1">@{channel.username}</p>
            )}

            {(channel.description || channel.longDescription) && (
              <div className="mt-4 text-text-muted leading-relaxed whitespace-pre-wrap">
                {channel.longDescription || channel.description}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <Globe className="w-5 h-5 text-accent-primary mb-2" />
              <p className="text-xs text-text-muted">Global Rank</p>
              <p className="font-semibold text-text-primary">
                #{channel.globalRank?.currentRank ?? 0}
              </p>
            </div>
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <span className="text-sm font-medium text-text-muted mb-2 block">GB</span>
              <p className="text-xs text-text-muted">Language Rank</p>
              <p className="font-semibold text-text-primary">
                #{channel.languageRank?.currentRank ?? 0}
              </p>
            </div>
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <Trophy className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-xs text-text-muted">Category Rank</p>
              <p className="font-semibold text-text-primary">
                #{channel.categoryRank?.currentRank ?? 0}
              </p>
            </div>
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <Clock className="w-5 h-5 text-text-muted mb-2" />
              <p className="text-xs text-text-muted">24h Change</p>
              <p className="font-semibold text-text-primary">
                {channel.changeWith24H?.currentRank ?? 0}
                {channel.changeWith24H?.statusRank === "up" && (
                  <span className="text-accent-green ml-1">↑</span>
                )}
              </p>
            </div>
          </div>

          {channel.category && (
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <p className="text-xs text-text-muted">Category</p>
              <p className="font-medium text-text-primary">{channel.category.title}</p>
            </div>
          )}

          {channel.hashtags?.length > 0 && (
            <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
              <p className="text-xs text-text-muted mb-2">Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {channel.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-white/8 text-text-primary text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
