"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Package as PackageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminFetchPackages,
  adminCreatePackage,
  adminUpdatePackage,
  adminRemovePackage,
} from "@/lib/api/adminService";

function PackageModal({ isOpen, onClose, onSave, pkg }) {
  const isEdit = !!pkg;
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationInMonths: "",
    price: "",
    discountAmount: "",
    sortOrder: "",
    isFeaturedOnChannels: false,
    isFeaturedOnCategories: false,
    isHighlightedBadge: false,
    isFasterApproval: false,
    isPrioritySupport: false,
    isHomepagePlacement: false,
    isMostPopular: false,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pkg) {
      setForm({
        title: pkg.title || "",
        description: pkg.description || "",
        durationInMonths:
          pkg.durationInMonths != null ? String(pkg.durationInMonths) : "",
        price: pkg.price != null ? String(pkg.price) : "",
        discountAmount:
          pkg.discountAmount != null ? String(pkg.discountAmount) : "",
        sortOrder: pkg.sortOrder != null ? String(pkg.sortOrder) : "",
        isFeaturedOnChannels: !!pkg.isFeaturedOnChannels,
        isFeaturedOnCategories: !!pkg.isFeaturedOnCategories,
        isHighlightedBadge: !!pkg.isHighlightedBadge,
        isFasterApproval: !!pkg.isFasterApproval,
        isPrioritySupport: !!pkg.isPrioritySupport,
        isHomepagePlacement: !!pkg.isHomepagePlacement,
        isMostPopular: !!pkg.isMostPopular,
        isActive: pkg.isActive ?? true,
      });
    } else {
      setForm({
        title: "",
        description: "",
        durationInMonths: "",
        price: "",
        discountAmount: "",
        sortOrder: "",
        isFeaturedOnChannels: false,
        isFeaturedOnCategories: false,
        isHighlightedBadge: false,
        isFasterApproval: false,
        isPrioritySupport: false,
        isHomepagePlacement: false,
        isMostPopular: false,
        isActive: true,
      });
    }
  }, [pkg, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Package title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Package description is required");
      return;
    }

    const durationInMonthsNum = Number(form.durationInMonths);
    const priceNum = Number(form.price);
    const discountAmountNum = Number(form.discountAmount);
    const sortOrderNum = Number(form.sortOrder);

    if (!Number.isFinite(durationInMonthsNum) || durationInMonthsNum <= 0) {
      toast.error("Duration in months must be a valid positive number");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      toast.error("Price must be a valid number");
      return;
    }
    if (!Number.isFinite(discountAmountNum) || discountAmountNum < 0) {
      toast.error("Discount amount must be a valid number");
      return;
    }
    if (!Number.isFinite(sortOrderNum)) {
      toast.error("Sort order must be a valid number");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        durationInMonths: durationInMonthsNum,
        price: priceNum,
        discountAmount: discountAmountNum,
        isFeaturedOnChannels: form.isFeaturedOnChannels,
        isFeaturedOnCategories: form.isFeaturedOnCategories,
        isHighlightedBadge: form.isHighlightedBadge,
        isFasterApproval: form.isFasterApproval,
        isPrioritySupport: form.isPrioritySupport,
        isHomepagePlacement: form.isHomepagePlacement,
        isMostPopular: form.isMostPopular,
        isActive: form.isActive,
        sortOrder: sortOrderNum,
      });
      onClose();
    } catch {
      // error handled in parent
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const checkboxItemClass =
    "flex items-center gap-2 text-text-muted text-sm cursor-pointer select-none";

  const checkboxInputClass =
    "w-4 h-4 rounded border-white/10 bg-white/5 text-accent-primary focus:ring-accent-primary/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 sticky top-0 bg-secondary-dark z-10">
          <h2 className="text-text-primary font-semibold">
            {isEdit ? "Edit Package" : "Add Package"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-muted text-xs font-medium mb-1.5">
                Title <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. 3 Months Promotion"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium mb-1.5">
                Duration (months) <span className="text-accent-red">*</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={form.durationInMonths}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationInMonths: e.target.value }))
                }
                placeholder="e.g. 6"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium mb-1.5">
                Price <span className="text-accent-red">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 90"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-text-muted text-xs font-medium mb-1.5">
                Discount Amount <span className="text-accent-red">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.discountAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountAmount: e.target.value }))
                }
                placeholder="e.g. 15"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-text-muted text-xs font-medium mb-1.5">
                Sort Order <span className="text-accent-red">*</span>
              </label>
              <input
                type="number"
                step={1}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
                placeholder="e.g. 1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Description <span className="text-accent-red">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all resize-none"
              placeholder="Short description shown in the CP packages list"
            />
          </div>

          <div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
              Package Flags
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className={checkboxInputClass}
                />
                Active
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isMostPopular}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isMostPopular: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Most Popular
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isHomepagePlacement}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isHomepagePlacement: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Homepage Placement
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isFeaturedOnChannels}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isFeaturedOnChannels: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Featured on Channels
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isFeaturedOnCategories}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isFeaturedOnCategories: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Featured on Categories
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isHighlightedBadge}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isHighlightedBadge: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Highlighted Badge
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isFasterApproval}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isFasterApproval: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Faster Approval
              </label>
              <label className={checkboxItemClass}>
                <input
                  type="checkbox"
                  checked={form.isPrioritySupport}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPrioritySupport: e.target.checked }))
                  }
                  className={checkboxInputClass}
                />
                Priority Support
              </label>
            </div>
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
              {isEdit ? "Save Changes" : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ isOpen, onClose, onConfirm, name, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-accent-red" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">
          Delete Package?
        </h3>
        <p className="text-text-muted text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="text-text-primary font-medium">"{name}"</span>?
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

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadPackages = () => {
    setLoading(true);
    adminFetchPackages()
      .then((res) => {
        const list = res.data?.data ?? [];
        setPackages(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load packages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter((p) => {
      const inTitle = (p.title || "").toLowerCase().includes(q);
      const inDesc = (p.description || "").toLowerCase().includes(q);
      const inDuration = String(p.durationInMonths ?? "").includes(q);
      return inTitle || inDesc || inDuration;
    });
  }, [packages, search]);

  const handleSave = async (payload) => {
    try {
      if (editTarget) {
        await adminUpdatePackage(editTarget._id, payload);
        toast.success("Package updated");
      } else {
        await adminCreatePackage(payload);
        toast.success("Package added");
      }
      loadPackages();
    } catch {
      toast.error(editTarget ? "Failed to update package" : "Failed to add package");
      throw new Error("save failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRemovePackage(deleteTarget._id);
      toast.success("Package deleted");
      setDeleteTarget(null);
      loadPackages();
    } catch {
      toast.error("Failed to delete package");
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
          <h1 className="text-text-primary font-bold text-lg">Packages</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} package{filtered.length !== 1 ? "s" : ""} total
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
          Add Package
        </button>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or duration…"
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
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">
              No packages found
            </p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search term" : "Add your first package to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Package</th>
                  <th className="text-left px-4 py-3.5">Duration</th>
                  <th className="text-left px-4 py-3.5">Price</th>
                  <th className="text-left px-4 py-3.5">Discount</th>
                  <th className="text-left px-4 py-3.5">Flags</th>
                  <th className="text-left px-4 py-3.5">Sort</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((p, idx) => (
                  <tr
                    key={p._id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-accent-secondary/15 flex items-center justify-center shrink-0">
                          <PackageIcon className="w-4 h-4 text-accent-secondary" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-text-primary text-sm font-medium block truncate">
                            {p.title ?? "—"}
                          </span>
                          <span className="text-text-muted text-xs block truncate max-w-[260px]">
                            {p.description ?? "—"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {p.durationInMonths != null ? `${p.durationInMonths} months` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {p.price != null ? `$${p.price}` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {p.discountAmount != null && Number(p.discountAmount) > 0
                          ? `-$${p.discountAmount}`
                          : "$0"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.isActive
                              ? "bg-accent-green/12 text-accent-green"
                              : "bg-white/8 text-text-muted"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                        {p.isMostPopular && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-yellow/15 text-accent-yellow text-xs font-medium">
                            Popular
                          </span>
                        )}
                        {p.isHomepagePlacement && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-medium">
                            Home
                          </span>
                        )}
                        {p.isFasterApproval && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-medium">
                            Faster
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">{p.sortOrder ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">{formatDate(p.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditTarget(p);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
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

      <PackageModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        pkg={editTarget}
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

