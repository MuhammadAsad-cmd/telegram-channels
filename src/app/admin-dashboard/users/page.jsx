"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, X, Users } from "lucide-react";
import { adminFetchUsers } from "@/lib/api/adminService";
import Image from "next/image";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [failedImageIds, setFailedImageIds] = useState(new Set());

  const markImageFailed = useCallback((id) => {
    setFailedImageIds((prev) => new Set(prev).add(id));
  }, []);

  useEffect(() => {
    setLoading(true);
    adminFetchUsers()
      .then((res) => {
        const list = res.data?.data ?? [];
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.type || "").toLowerCase().includes(q),
    );
  }, [users, search]);

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-text-primary font-bold text-lg">Users</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or type…"
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-9 py-2 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/40 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Users className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">No users found</p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "No users in the system yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">User</th>
                  <th className="text-left px-4 py-3.5">Email</th>
                  <th className="text-left px-4 py-3.5">Type</th>
                  <th className="text-left px-4 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {u.image && !failedImageIds.has(u._id) ? (
                          <Image
                            width={32}
                            height={32}
                            unoptimized
                            src={u.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                            onError={() => markImageFailed(u._id)}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-text-muted/50" />
                          </div>
                        )}
                        <span className="text-text-primary text-sm font-medium">
                          {u.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm truncate max-w-[220px] block">
                        {u.email ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-text-muted capitalize">
                        {u.type ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(u.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
