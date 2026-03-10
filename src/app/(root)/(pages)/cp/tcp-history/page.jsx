"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, FileText, Wallet } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import { getProfile } from "@/lib/api/userService";
import { fetchRequestsByUser } from "@/lib/api/requestService";

const STATUS_STYLES = {
  requested: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function CpTcpHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const user = res.data?.data ?? res.data;
        const userId = user?._id;
        if (!userId) {
          setRequests([]);
          return;
        }
        return fetchRequestsByUser(userId);
      })
      .then((res) => {
        if (!res) return;
        const list = res.data?.data ?? [];
        setRequests(Array.isArray(list) ? list : []);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">TCP History</h1>
          <p className="text-gray-500 text-sm">View your deposit and transaction history</p>
        </div>
        <CpCard className="p-12">
          <div className="flex justify-center">
            <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CpCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">TCP History</h1>
        <p className="text-gray-500 text-sm">View your deposit and transaction history</p>
      </div>

      {requests.length === 0 ? (
        <CpCard className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions yet</h3>
            <p className="text-gray-500 text-sm mb-4 max-w-sm">
              Your top-up and advertising transactions will appear here.
            </p>
            <Link
              href="/cp/deposit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Top Up Account
            </Link>
          </div>
        </CpCard>
      ) : (
        <CpCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Payment</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.crypto?.paymentImage ? (
                          <Image
                            src={r.crypto.paymentImage}
                            alt=""
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span className="text-gray-800 text-sm font-medium">
                          {r.crypto?.title ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-800 font-medium">${r.amount ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${
                          STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CpCard>
      )}
    </div>
  );
}
