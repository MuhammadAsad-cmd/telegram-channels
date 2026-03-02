"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Radio,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminFetchChannels,
  adminUpdateChannelStatus,
  adminDeleteChannel,
  adminFetchCategories,
} from "@/lib/api/adminService";
import AdminSearchableSelect from "@/components/Admin/AdminSearchableSelect";
import Image from "next/image";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  approved: "bg-accent-green/12 text-accent-green",
  pending: "bg-accent-primary/12 text-accent-primary",
  cancelled: "bg-accent-red/12 text-accent-red",
};

function getChannelSlug(ch) {
  return ch?.slug ?? ch?.username?.replace(/_/g, "-") ?? ch?._id ?? "";
}

// ── Edit modal: only status (PUT /channel/update/:id { status }) ──────────────
function ChannelEditModal({ isOpen, onClose, channel, onSave }) {
  const [status, setStatus] = useState("pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (channel) setStatus(channel.status || "pending");
  }, [channel, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channel) return;
    setSaving(true);
    try {
      await onSave(channel._id, status);
      onClose();
    } catch {
      // error in parent
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <h2 className="text-text-primary font-semibold">Update status</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-text-muted text-sm">{channel.title}</p>
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary/50 appearance-none cursor-pointer"
            >
              {["pending", "approved", "cancelled"].map((s) => (
                <option key={s} value={s} className="bg-secondary-dark capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ isOpen, onClose, onConfirm, name, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-accent-red" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">Delete Channel?</h3>
        <p className="text-text-muted text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">"{name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminChannelsPage() {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const LIMIT = 10;

  const loadChannels = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await adminFetchChannels(params);
      const body = res.data;
      const list = body?.data ?? [];
      setChannels(Array.isArray(list) ? list : []);
      const pag = body?.pagination ?? {};
      setPagination({
        page: pag.page ?? page,
        limit: pag.limit ?? LIMIT,
        total: pag.total ?? 0,
        pages: pag.pages ?? 1,
      });
    } catch {
      toast.error("Failed to load channels");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    adminFetchCategories()
      .then((res) => {
        const list = res.data?.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminUpdateChannelStatus(id, status);
      toast.success("Status updated");
      setEditTarget(null);
      loadChannels();
    } catch {
      toast.error("Failed to update status");
      throw new Error("save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteChannel(deleteTarget._id);
      toast.success("Channel deleted");
      setDeleteTarget(null);
      loadChannels();
    } catch {
      toast.error("Failed to delete channel");
    } finally {
      setDeleting(false);
    }
  };

  const totalCount = pagination.total;
  const totalPages = pagination.pages;

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-text-primary font-bold text-lg">Channels</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {totalCount} channel{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin-dashboard/channels/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Channel
        </Link>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels…"
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-3.5 py-2 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/40 transition-all"
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
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <AdminSearchableSelect
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
              searchPlaceholder="Search status…"
            />
            {statusFilter !== "all" && (
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="p-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors cursor-pointer"
                title="Clear status filter"
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Radio className="w-6 h-6 text-text-muted/40" />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium text-sm">No channels found</p>
              <p className="text-text-muted text-xs mt-1">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first channel to get started"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Channel</th>
                  <th className="text-left px-4 py-3.5">Category</th>
                  <th className="text-left px-4 py-3.5">Members</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {channels.map((ch, idx) => (
                  <tr key={ch._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin-dashboard/channels/${getChannelSlug(ch)}`}
                        className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
                      >
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
                        <div>
                          <p className="text-text-primary text-sm font-medium">
                            {ch.title ?? "—"}
                          </p>
                          <p className="text-text-muted text-xs truncate max-w-[200px]">
                            {ch.inviteLink || (ch.username ? `@${ch.username}` : "—")}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {ch.category?.title ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {ch.memberCount != null ? Number(ch.memberCount).toLocaleString() : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setEditTarget(ch)}
                        title="Change status"
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize cursor-pointer hover:opacity-75 transition-opacity ${
                          STATUS_STYLES[ch.status] || "bg-white/8 text-text-muted"
                        }`}
                      >
                        {ch.status ?? "—"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditTarget(ch)}
                          className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer"
                          title="Edit status"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(ch)}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/6">
            <p className="text-text-muted text-xs">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/8 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/8 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ChannelEditModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        channel={editTarget}
        onSave={handleUpdateStatus}
      />
      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        name={deleteTarget?.title ?? ""}
        loading={deleting}
      />
    </div>
  );
}
