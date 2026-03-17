"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Coins, Satellite } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import { getProfile } from "@/lib/api/userService";
import { fetchUserChannels } from "@/lib/api/channelService";

export default function CpDashboardPage() {
  const [balance, setBalance] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), fetchUserChannels({ limit: 9999 })])
      .then(([profileRes, channelsRes]) => {
        const user = profileRes?.data?.data ?? profileRes?.data;
        const wallet = user?.wallet;
        setBalance(
          typeof wallet === "number"
            ? wallet
            : typeof wallet === "string"
              ? parseFloat(wallet) || 0
              : 0
        );
        const list = channelsRes?.data?.data ?? [];
        setMediaCount(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl p-4 text-gray-800">
        <p className="text-sm font-medium">
          Top up your account balance to start advertising your channel on
          website.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CpCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-yellow/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {loading ? "—" : `$${Number(balance).toFixed(2)}`}
              </p>
              <p className="text-sm text-gray-500">Balance</p>
            </div>
            <Link
              href="/cp/deposit"
              className="ml-auto text-accent-primary hover:underline text-sm font-medium"
            >
              Topup
            </Link>
          </div>
        </CpCard>

        <CpCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
              <Satellite className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {loading ? "—" : mediaCount}
              </p>
              <p className="text-sm text-gray-500">Media</p>
            </div>
            <Link
              href="/cp/media/create"
              className="ml-auto text-accent-primary hover:underline text-sm font-medium"
            >
              Add Media
            </Link>
          </div>
        </CpCard>
      </div>

      <CpCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600 mb-4">Welcome to telegramChannels.me!</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            To add a new Channel, Group or Bot, go to{" "}
            <Link href="/cp/media/create" className="text-accent-primary hover:underline">
              Add New Media
            </Link>
          </li>
          <li>
            To see your media list go to{" "}
            <Link href="/cp/media" className="text-accent-primary hover:underline">
              Media List
            </Link>
          </li>
        </ul>
      </CpCard>

      <CpCard className="p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Note:</h3>
        <p className="text-sm text-gray-600">
          Added media is displayed according to its locale language (default
          English). For example, a Russian channel will appear at{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">
            https://telegramchannels.me/ru/channels/your_channel
          </code>
          . You can change locale from top right.
        </p>
      </CpCard>

      <CpCard className="p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Featured:</h3>
        <p className="text-sm text-gray-600">
          Channels, groups or bots can be featured on their locale homepage.
          Russian featured channel at{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">
            https://telegramchannels.me/ru
          </code>{" "}
          and English (default) locale at{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">
            https://telegramchannels.me
          </code>
          .
        </p>
      </CpCard>
    </div>
  );
}
