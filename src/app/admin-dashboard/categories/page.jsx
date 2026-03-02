"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "@/lib/api/adminService";

// ── Modal: API uses { title } only ────────────────────────────────────────────
function CategoryModal({ isOpen, onClose, onSave, category }) {
  const isEdit = !!category;
  const [form, setForm] = useState({ title: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({ title: category.title || "" });
    } else {
      setForm({ title: "" });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Category title is required");
      return;
    }
    setSaving(true);
    try {
      await onSave({ title: form.title.trim() });
      onClose();
    } catch {
      // error handled in parent
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <h2 className="text-text-primary font-semibold">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Category Title <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Technology"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
            />
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
              {isEdit ? "Save Changes" : "Add Category"}
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
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">
          Delete Category?
        </h3>
        <p className="text-text-muted text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">"{name}"</span>? All
          channels in this category may be affected.
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
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const LIMIT = 12;

  useEffect(() => {
    setLoading(true);
    adminFetchCategories()
      .then((res) => {
        const list = res.data?.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.trim().toLowerCase();
    return categories.filter((c) => (c.title || "").toLowerCase().includes(q));
  }, [categories, search]);

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * LIMIT, page * LIMIT),
    [filtered, page, LIMIT],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSave = async (payload) => {
    try {
      if (editTarget) {
        await adminUpdateCategory(editTarget._id, payload);
        toast.success("Category updated");
      } else {
        await adminCreateCategory(payload);
        toast.success("Category added");
      }
      const res = await adminFetchCategories();
      const list = res.data?.data ?? [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      toast.error(
        editTarget ? "Failed to update category" : "Failed to add category",
      );
      throw new Error("save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteCategory(deleteTarget._id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      const res = await adminFetchCategories();
      const list = res.data?.data ?? [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

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
          <h1 className="text-text-primary font-bold text-lg">Categories</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {totalCount} categor{totalCount !== 1 ? "ies" : "y"} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditTarget(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories…"
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
              <div key={i} className="h-12 bg-white/3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Tag className="w-6 h-6 text-text-muted/40" />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium text-sm">
                No categories found
              </p>
              <p className="text-text-muted text-xs mt-1">
                {search
                  ? "Try a different search term"
                  : "Add your first category to get started"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Title</th>
                  <th className="text-left px-4 py-3.5">Channels</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {paginated.map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-secondary/15 flex items-center justify-center shrink-0">
                          <Tag className="w-3.5 h-3.5 text-accent-secondary" />
                        </div>
                        <span className="text-text-primary text-sm font-medium">
                          {cat.title ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {cat.channelCount ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(cat.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditTarget(cat);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat)}
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

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        category={editTarget}
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
