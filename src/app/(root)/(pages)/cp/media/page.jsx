"use client";

import Link from "next/link";
import { Megaphone, Crown, ChevronDown } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import { useUserChannels } from "@/hooks/useUserChannels";
import { MediaTableSkeleton } from "@/components/UI/Skeleton";
import Image from "next/image";

function formatMemberCount(count) {
  if (count == null || count === 0) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
}

function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: "Pending", className: "text-blue-600 bg-blue-50" },
    approved: { label: "Approved", className: "text-green-600 bg-green-50" },
    rejected: { label: "Rejected", className: "text-red-600 bg-red-50" },
  };
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function CpMediaPage() {
  const { channels, isLoading, error } = useUserChannels();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CpCard className="overflow-hidden p-0">
          <MediaTableSkeleton rows={6} />
        </CpCard>
      </div>
    );
  }

  if (error) {
    return (
      <CpCard className="p-6">
        <p className="text-accent-red">{error}</p>
      </CpCard>
    );
  }

  if (!channels?.length) {
    return (
      <div className="space-y-6">
        <CpCard className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              There are no media submitted!
            </h3>
            <p className="text-gray-500 text-sm mb-4 max-w-sm">
              Start by adding your first channel, group, or bot to get started.
            </p>
            <Link
              href="/cp/media/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add New Media
            </Link>
          </div>
        </CpCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CpCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Photo
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Username
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  #
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  @
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {channels.map((channel) => (
                <tr key={channel._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      {channel.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <Image
                          width={48}
                          height={48}
                          unoptimized
                          src={channel.photo}
                          alt={channel.title ?? "Channel"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Megaphone className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <Link
                        href={`/channel/${channel.slug || channel.username?.replace(/_/g, "-") || channel._id}`}
                        className="text-accent-primary hover:underline font-medium"
                      >
                        @{channel.username}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{channel.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-gray-800">
                        {formatMemberCount(channel.memberCount)}
                      </span>
                      <p className="text-xs text-gray-500">Subscribers</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <StatusBadge status={channel.status} />
                      {channel.featured && (
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                        aria-label="More options"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CpCard>
    </div>
  );
}
