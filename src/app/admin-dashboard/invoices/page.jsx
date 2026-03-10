"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, X, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { adminFetchInvoices } from "@/lib/api/adminService";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadInvoices = useCallback(() => {
    setLoading(true);
    adminFetchInvoices()
      .then((res) => {
        const list = res.data?.data ?? [];
        setInvoices(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load invoices"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filtered = invoices.filter((inv) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      (inv._id || "").toLowerCase().includes(q) ||
      (inv.amount || "").toString().toLowerCase().includes(q) ||
      (inv.status || "").toLowerCase().includes(q) ||
      (inv.user?.name || "").toLowerCase().includes(q) ||
      (inv.user?.email || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (d) => {
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
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-text-primary font-bold text-lg">Invoices</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
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
            placeholder="Search by ID, amount, user, status…"
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-9 py-2 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/40 transition-all"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <FileText className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">No invoices</p>
            <p className="text-text-muted text-xs">{search ? "Try a different search" : "Invoices will appear here after approved requests"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">User</th>
                  <th className="text-left px-4 py-3.5">Amount</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((inv, idx) => (
                  <tr key={inv._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted text-sm">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {inv.user?.image ? (
                          <Image src={inv.user.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" unoptimized />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <span className="text-text-muted text-xs">{inv.user?.name?.[0] ?? "?"}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-text-primary text-sm font-medium">{inv.user?.name ?? "—"}</p>
                          <p className="text-text-muted text-xs truncate max-w-[160px]">{inv.user?.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-primary font-medium">${inv.amount ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${inv.status === "paid" ? "bg-accent-secondary/15 text-accent-secondary" : "bg-white/10 text-text-muted"}`}>
                        {inv.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-text-muted text-sm">{formatDate(inv.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin-dashboard/invoices/${inv._id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 text-sm transition-colors cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Link>
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
