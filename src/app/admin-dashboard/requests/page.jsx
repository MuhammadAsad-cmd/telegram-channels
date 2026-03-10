"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  CheckCircle,
  XCircle,
  Trash2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  adminFetchRequests,
  adminApproveRequest,
  adminCancelRequest,
  adminRemoveRequest,
} from "@/lib/api/adminService";

const STATUS_STYLES = {
  requested: "bg-accent-yellow/15 text-accent-yellow",
  accepted: "bg-accent-secondary/15 text-accent-secondary",
  cancelled: "bg-accent-red/15 text-accent-red",
};

function DeleteConfirm({ request, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-accent-red" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">Delete request?</h3>
        <p className="text-text-muted text-sm mb-6">
          Remove this deposit request permanently? Amount: ${request?.amount ?? "—"}
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ApproveConfirm({ request, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-secondary/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-5 h-5 text-accent-secondary" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">Approve request?</h3>
        <p className="text-text-muted text-sm mb-6">
          Credit ${request?.amount ?? "—"} to the user&apos;s wallet? This will approve the deposit.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-accent-secondary hover:bg-accent-secondary/90 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelRequestConfirm({ request, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-yellow/15 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-5 h-5 text-accent-yellow" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">Cancel request?</h3>
        <p className="text-text-muted text-sm mb-6">
          Cancel this deposit request? The user will not receive ${request?.amount ?? "—"}.
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
            No
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-accent-yellow hover:bg-accent-yellow/90 text-primary-dark text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />}
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [approveTarget, setApproveTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const loadRequests = useCallback(() => {
    setLoading(true);
    adminFetchRequests()
      .then((res) => {
        const list = res.data?.data ?? [];
        setRequests(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filtered = requests.filter((r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      (r._id || "").toLowerCase().includes(q) ||
      (r.amount || "").toString().toLowerCase().includes(q) ||
      (r.status || "").toLowerCase().includes(q)
    );
  });

  const handleApproveConfirm = async () => {
    if (!approveTarget) return;
    setActioningId(approveTarget._id);
    try {
      await adminApproveRequest(approveTarget._id);
      toast.success("Request approved");
      setApproveTarget(null);
      loadRequests();
    } catch {
      toast.error("Failed to approve");
    } finally {
      setActioningId(null);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setActioningId(cancelTarget._id);
    try {
      await adminCancelRequest(cancelTarget._id);
      toast.success("Request cancelled");
      setCancelTarget(null);
      loadRequests();
    } catch {
      toast.error("Failed to cancel");
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRemoveRequest(deleteTarget._id);
      toast.success("Request deleted");
      setDeleteTarget(null);
      loadRequests();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

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
          <h1 className="text-text-primary font-bold text-lg">Deposit Requests</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} request{filtered.length !== 1 ? "s" : ""}
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
            placeholder="Search by ID, amount, status…"
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <FileText className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">No requests</p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "Deposit requests will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Evidence</th>
                  <th className="text-left px-4 py-3.5">Amount</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5">
                      {r.evidence ? (
                        <a
                          href={r.evidence}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-accent-primary/30 transition-colors"
                        >
                          <Image
                            src={r.evidence}
                            alt="Evidence"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </a>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-primary font-medium">
                        ${r.amount ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[r.status] ?? "bg-white/10 text-text-muted"
                        }`}
                      >
                        {r.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(r.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === "requested" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setApproveTarget(r)}
                              disabled={!!actioningId}
                              className="p-2 rounded-lg text-text-muted hover:text-accent-secondary hover:bg-accent-secondary/10 transition-all cursor-pointer disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelTarget(r)}
                              disabled={!!actioningId}
                              className="p-2 rounded-lg text-text-muted hover:text-accent-yellow hover:bg-accent-yellow/10 transition-all cursor-pointer disabled:opacity-50"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          className="p-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApproveConfirm
        request={approveTarget}
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApproveConfirm}
        loading={actioningId === approveTarget?._id}
      />
      <CancelRequestConfirm
        request={cancelTarget}
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        loading={actioningId === cancelTarget?._id}
      />
      <DeleteConfirm
        request={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
