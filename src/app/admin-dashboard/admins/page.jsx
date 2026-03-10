"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  X,
  ShieldCheck,
  Mail,
  User,
  Lock,
  Image as ImageIcon,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  adminFetchAdmins,
  adminRegister,
  adminChangeAdminPassword,
} from "@/lib/api/adminService";

function AddAdminModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setImageFile(null);
    setImagePreview(null);
    setShowPassword(false);
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!imageFile) {
      toast.error("Profile image is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("email", email.trim());
      formData.append("name", name.trim());
      formData.append("password", password);
      formData.append("image", imageFile);

      await adminRegister(formData);
      toast.success("Admin added successfully");
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Failed to add admin";
      toast.error(typeof msg === "string" ? msg : "Failed to add admin");
    } finally {
      setSaving(false);
    }
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
          <h2 className="text-text-primary font-semibold">Add Admin</h2>
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
              Profile Image <span className="text-accent-red">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="relative w-20 h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-accent-primary/40 flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 transition-colors">
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
                  {imageFile?.name ?? "No file selected"}
                </p>
                <p className="text-text-muted/60 text-[10px] mt-0.5">
                  JPG, PNG, WebP
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Name <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Email <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Password <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-text-muted/60 text-[10px] mt-1">
              Minimum 6 characters
            </p>
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
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangeAdminPasswordModal({ admin, isOpen, onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin?._id) return;
    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await adminChangeAdminPassword(admin._id, {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrent(false);
      setShowNew(false);
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Failed to change password";
      toast.error(typeof msg === "string" ? msg : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setShowCurrent(false);
    setShowNew(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-text-primary font-semibold text-lg mb-1">
          Change Password
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Update password for{" "}
          <span className="text-text-primary font-medium">{admin?.name || admin?.email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Current password <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              New password <span className="text-accent-red">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-text-muted/60 text-[10px] mt-1">
              Minimum 6 characters
            </p>
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
                <KeyRound className="w-4 h-4" />
              )}
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [changePasswordTarget, setChangePasswordTarget] = useState(null);
  const [failedImageIds, setFailedImageIds] = useState(new Set());

  const loadAdmins = useCallback(() => {
    setLoading(true);
    adminFetchAdmins()
      .then((res) => {
        const list = res.data?.data ?? [];
        setAdmins(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load admins"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const markImageFailed = useCallback((id) => {
    setFailedImageIds((prev) => new Set(prev).add(id));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return admins;
    const q = search.trim().toLowerCase();
    return admins.filter(
      (a) =>
        (a.name || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q),
    );
  }, [admins, search]);

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
          <h1 className="text-text-primary font-bold text-lg">Admins</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} admin{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
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
              <ShieldCheck className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">No admins found</p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "Add your first admin to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Admin</th>
                  <th className="text-left px-4 py-3.5">Email</th>
                  <th className="text-left px-4 py-3.5">Created</th>
                  <th className="text-left px-4 py-3.5">Updated</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((a, idx) => (
                  <tr key={a._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {a.image && !failedImageIds.has(a._id) ? (
                          <Image
                            width={36}
                            height={36}
                            unoptimized
                            src={a.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                            onError={() => markImageFailed(a._id)}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-accent-primary" />
                          </div>
                        )}
                        <span className="text-text-primary text-sm font-medium">
                          {a.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm truncate max-w-[220px] block">
                        {a.email ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(a.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(a.updatedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setChangePasswordTarget(a)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-sm"
                          title="Change password"
                        >
                          <KeyRound className="w-4 h-4" />
                          Change password
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

      <AddAdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadAdmins}
      />
      <ChangeAdminPasswordModal
        admin={changePasswordTarget}
        isOpen={!!changePasswordTarget}
        onClose={() => setChangePasswordTarget(null)}
        onSuccess={() => {}}
      />
    </div>
  );
}
