"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  Tag,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { adminFetchStats, adminFetchChannels } from "@/lib/api/adminService";
import Image from "next/image";

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-secondary-dark rounded-2xl border border-white/6 p-5 flex items-start gap-4 hover:border-white/10 transition-colors">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-muted text-xs font-medium mb-1.5">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-white/5 rounded-lg animate-pulse" />
        ) : (
          <p className="text-text-primary text-2xl font-bold">{value ?? "—"}</p>
        )}
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  approved: "bg-accent-green/12 text-accent-green",
  pending: "bg-accent-primary/12 text-accent-primary",
  cancelled: "bg-accent-red/12 text-accent-red",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentChannels, setRecentChannels] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [channelsLoading, setChannelsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    adminFetchStats()
      .then((res) => {
        if (cancelled) return;
        setStats(res.data?.data ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });

    adminFetchChannels({ limit: 8 })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? [];
        setRecentChannels(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChannelsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const statCards = [
    {
      icon: Radio,
      label: "Total Channels",
      value: stats?.channels?.total,
      color: "bg-accent-primary/15 text-accent-primary",
    },
    {
      icon: Tag,
      label: "Total Categories",
      value: stats?.categories?.total,
      color: "bg-accent-secondary/15 text-accent-secondary",
    },
    {
      icon: Clock,
      label: "Pending Review",
      value: stats?.channels?.byStatus?.pending,
      color: "bg-accent-yellow/15 text-accent-yellow",
    },
    {
      icon: CheckCircle,
      label: "Approved Channels",
      value: stats?.channels?.byStatus?.approved,
      color: "bg-accent-green/15 text-accent-green",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={statsLoading} />
        ))}
      </div>

      {/* Additional stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
            <p className="text-text-muted text-xs font-medium">Users (24h)</p>
            <p className="text-text-primary text-lg font-bold">{stats?.users?.newLast24h ?? "—"}</p>
          </div>
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
            <p className="text-text-muted text-xs font-medium">Channels (7d)</p>
            <p className="text-text-primary text-lg font-bold">{stats?.channels?.newLast7d ?? "—"}</p>
          </div>
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
            <p className="text-text-muted text-xs font-medium">Total Users</p>
            <p className="text-text-primary text-lg font-bold">{stats?.users?.total ?? "—"}</p>
          </div>
          <div className="bg-secondary-dark rounded-xl border border-white/6 p-4">
            <p className="text-text-muted text-xs font-medium">Total Members</p>
            <p className="text-text-primary text-lg font-bold">
              {stats?.channels?.totalMembers != null
                ? Number(stats.channels.totalMembers).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>
      )}

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <div>
            <h2 className="text-text-primary font-semibold text-sm">
              Recent Channels
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              Latest submitted channels
            </p>
          </div>
          <Link
            href="/admin-dashboard/channels"
            className="text-accent-primary text-xs font-medium hover:underline flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {channelsLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-white/3 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : recentChannels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Radio className="w-8 h-8 text-text-muted/30" />
            <p className="text-text-muted text-sm">No channels yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr className="text-text-muted text-xs font-medium border-b border-white/6">
                  <th className="text-left px-5 py-3">Channel</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Members</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {recentChannels.map((ch) => (
                  <tr key={ch._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {ch.photo ? (
                          <Image
                            width={32}
                            height={32}
                            unoptimized
                            src={ch.photo}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <Radio className="w-4 h-4 text-text-muted/50" />
                          </div>
                        )}
                        <span className="text-text-primary text-sm font-medium">
                          {ch.title ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-text-muted text-sm">
                        {ch.category?.title ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-text-muted text-sm">
                        {ch.memberCount != null ? Number(ch.memberCount).toLocaleString() : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[ch.status] || "bg-white/8 text-text-muted"
                        }`}
                      >
                        {ch.status ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin-dashboard/channels"
          className="group bg-secondary-dark rounded-2xl border border-white/6 p-5 flex items-center gap-4 hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all duration-200"
        >
          <div className="w-11 h-11 rounded-xl bg-accent-primary/15 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="flex-1">
            <p className="text-text-primary font-semibold text-sm">
              Manage Channels
            </p>
            <p className="text-text-muted text-xs mt-0.5">
              View, approve, edit or delete channels
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors shrink-0" />
        </Link>

        <Link
          href="/admin-dashboard/categories"
          className="group bg-secondary-dark rounded-2xl border border-white/6 p-5 flex items-center gap-4 hover:border-accent-secondary/30 hover:bg-accent-secondary/5 transition-all duration-200"
        >
          <div className="w-11 h-11 rounded-xl bg-accent-secondary/15 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-accent-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-text-primary font-semibold text-sm">
              Manage Categories
            </p>
            <p className="text-text-muted text-xs mt-0.5">
              Create, edit or remove categories
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-secondary transition-colors shrink-0" />
        </Link>
      </div>
    </div>
  );
}
