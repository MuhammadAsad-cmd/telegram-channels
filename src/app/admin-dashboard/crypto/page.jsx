"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Wallet,
  Image as ImageIcon,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  adminFetchCrypto,
  adminCreateCrypto,
  adminUpdateCrypto,
  adminRemoveCrypto,
} from "@/lib/api/adminService";

function CryptoModal({ payment, isOpen, onClose, onSuccess }) {
  const isEdit = !!payment;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setTitle(payment.title || "");
      setDescription(payment.description || "");
      setPaymentId(payment.paymentId || "");
      setImageFile(null);
      setImagePreview(payment.paymentImage || null);
    } else {
      setTitle("");
      setDescription("");
      setPaymentId("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [payment, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(payment?.paymentImage || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!paymentId.trim()) {
      toast.error("Payment ID/Address is required");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("Payment image is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("paymentId", paymentId.trim());
      if (imageFile) formData.append("paymentImage", imageFile);

      if (isEdit) {
        await adminUpdateCrypto(payment._id, formData);
        toast.success("Payment method updated");
      } else {
        await adminCreateCrypto(formData);
        toast.success("Payment method added");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        (isEdit ? "Failed to update" : "Failed to add");
      toast.error(typeof msg === "string" ? msg : "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPaymentId("");
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 sticky top-0 bg-secondary-dark z-10">
          <h2 className="text-text-primary font-semibold">
            {isEdit ? "Edit Payment Method" : "Add Payment Method"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Title <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. USDT (BEP-20)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Description <span className="text-accent-red">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this payment method"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Payment ID / Address <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="Wallet address or payment ID"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Payment Image {!isEdit && <span className="text-accent-red">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <label className="relative w-20 h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-accent-primary/40 flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 transition-colors shrink-0">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-text-muted">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              <div>
                <p className="text-text-muted text-xs">
                  {imageFile?.name ?? (payment?.paymentImage ? "Current image" : "No file")}
                </p>
                <p className="text-text-muted/60 text-[10px] mt-0.5">
                  {isEdit ? "Optional — leave to keep current" : "JPG, PNG, WebP"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
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
                <Plus className="w-4 h-4" />
              )}
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ payment, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm text-center p-6">
        <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-accent-red" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">
          Delete payment method?
        </h3>
        <p className="text-text-muted text-sm mb-6">
          Remove{" "}
          <span className="text-text-primary font-medium">&quot;{payment?.title ?? "this"}&quot;</span>?
          This cannot be undone.
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

export default function AdminCryptoPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState(new Set());

  const loadPayments = useCallback(() => {
    setLoading(true);
    adminFetchCrypto()
      .then((res) => {
        const list = res.data?.data ?? [];
        setPayments(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const markImageFailed = useCallback((id) => {
    setFailedImageIds((prev) => new Set(prev).add(id));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return payments;
    const q = search.trim().toLowerCase();
    return payments.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.paymentId || "").toLowerCase().includes(q),
    );
  }, [payments, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRemoveCrypto(deleteTarget._id);
      toast.success("Payment method deleted");
      setDeleteTarget(null);
      loadPayments();
    } catch {
      toast.error("Failed to delete");
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
          <h1 className="text-text-primary font-bold text-lg">Payment Methods</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} crypto payment{filtered.length !== 1 ? "s" : ""}
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
          Add Payment
        </button>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description or ID…"
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
              <Wallet className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">No payment methods</p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "Add your first crypto payment method"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Payment</th>
                  <th className="text-left px-4 py-3.5">Description</th>
                  <th className="text-left px-4 py-3.5">Payment ID</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((p, idx) => (
                  <tr key={p._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted text-sm">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {p.paymentImage && !failedImageIds.has(p._id) ? (
                          <Image
                            width={36}
                            height={36}
                            unoptimized
                            src={p.paymentImage}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                            onError={() => markImageFailed(p._id)}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-accent-secondary/15 flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-accent-secondary" />
                          </div>
                        )}
                        <span className="text-text-primary text-sm font-medium">
                          {p.title || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm line-clamp-2 max-w-[200px]">
                        {p.description || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 min-w-0 max-w-[320px]">
                        <span className="text-text-muted text-xs font-mono break-all flex-1 min-w-0">
                          {p.paymentId || "—"}
                        </span>
                        {p.paymentId && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(p.paymentId);
                              toast.success("Copied to clipboard");
                            }}
                            className="p-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer shrink-0"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(p.createdAt)}
                      </span>
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

      <CryptoModal
        payment={editTarget}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSuccess={loadPayments}
      />
      <DeleteConfirm
        payment={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
