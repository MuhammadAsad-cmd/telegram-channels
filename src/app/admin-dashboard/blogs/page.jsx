"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Image as ImageIcon,
  Eye,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import {
  adminFetchBlogs,
  adminCreateBlog,
  adminUpdateBlog,
  adminRemoveBlog,
} from "@/lib/api/adminService";
import RichTextEditor from "@/components/UI/RichTextEditor";

function BlogFormModal({ blog, isOpen, onClose, onSuccess }) {
  const isEdit = !!blog;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setImageFile(null);
      setImagePreview(blog.image || null);
    } else {
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [blog, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(blog?.image || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      toast.error("Content is required");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("Image is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);

      if (isEdit) {
        await adminUpdateBlog(blog._id, formData);
        toast.success("Blog updated");
      } else {
        await adminCreateBlog(formData);
        toast.success("Blog created");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        (isEdit ? "Failed to update" : "Failed to create");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
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
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 sticky top-0 bg-secondary-dark z-10">
          <h2 className="text-text-primary font-semibold">
            {isEdit ? "Edit Blog" : "Create Blog"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Title <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to Grow Your Telegram Channel to 10K Members"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-white/8 transition-all"
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Content <span className="text-accent-red">*</span>
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
            />
          </div>

          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Image {!isEdit && <span className="text-accent-red">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <label className="relative w-24 h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-accent-primary/40 flex items-center justify-center cursor-pointer overflow-hidden bg-white/5 transition-colors shrink-0">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="96px"
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
                  {imageFile?.name ??
                    (blog?.image ? "Current image" : "No file selected")}
                </p>
                <p className="text-text-muted/60 text-[10px] mt-0.5">
                  {isEdit
                    ? "Optional — leave to keep current"
                    : "JPG, PNG, WebP"}
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
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 text-white text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BlogViewModal({ blog, isOpen, onClose }) {
  if (!isOpen || !blog) return null;

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString(undefined, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 sticky top-0 bg-secondary-dark z-10">
          <h3 className="text-text-primary font-semibold">Blog Details</h3>
          <div className="flex items-center gap-2">
            <Link
              href={`/blog/${blog.slug || blog._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on site
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {blog.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
              <Image
                src={blog.image}
                alt={blog.title || ""}
                fill
                unoptimized
                className="object-cover"
                sizes="672px"
              />
            </div>
          )}
          <div>
            <p className="text-text-muted text-xs mb-1">Title</p>
            <p className="text-text-primary font-medium">{blog.title ?? "—"}</p>
          </div>
          {/* {blog.slug && (
            <div>
              <p className="text-text-muted text-xs mb-1">Slug</p>
              <p className="text-text-primary text-sm font-mono">/{blog.slug}</p>
            </div>
          )} */}
          <div>
            <p className="text-text-muted text-xs mb-1">Created</p>
            <p className="text-text-primary text-sm">{formatDate(blog.createdAt)}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-2">Content</p>
            <div
              className="blog-content text-text-muted text-sm max-h-40 overflow-y-auto [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              dangerouslySetInnerHTML={{
                __html: blog.content || "—",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ blog, isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-accent-red/15 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-accent-red" />
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1.5">
          Delete blog?
        </h3>
        <p className="text-text-muted text-sm mb-6">
          This will permanently remove &ldquo;{blog?.title}&rdquo;. This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent-red hover:bg-accent-red/90 disabled:opacity-70 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBlogs = useCallback(() => {
    setLoading(true);
    adminFetchBlogs()
      .then((res) => {
        const list = res.data?.data ?? [];
        setBlogs(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const filtered = blogs.filter((b) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      (b.title ?? "").toLowerCase().includes(q) ||
      (b.slug ?? "").toLowerCase().includes(q)
    );
  });

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

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await adminRemoveBlog(deleteTarget._id);
      toast.success("Blog removed");
      loadBlogs();
      setDeleteTarget(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Failed to remove";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditTarget(blog);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-text-primary font-bold text-lg">Blogs</h1>
          <p className="text-text-muted text-xs mt-0.5">
            {filtered.length} blog{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Blog
        </button>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
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
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-white/3 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <FileText className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">
              No blogs found
            </p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "Create your first blog post"}
            </p>
            {!search && (
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Blog
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Title</th>
                  <th className="text-left px-4 py-3.5">Image</th>
                  <th className="text-left px-4 py-3.5">Date</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((b, idx) => (
                  <tr
                    key={b._id}
                    onClick={() => setViewTarget(b)}
                    className="hover:bg-white/2 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-primary text-sm font-medium line-clamp-2 max-w-[280px]">
                        {b.title ?? "—"}
                      </span>
                      {b.slug && (
                        <span className="text-text-muted/60 text-xs block mt-0.5">
                          /{b.slug}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {b.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                          <Image
                            src={b.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <span className="text-text-muted/60 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(b.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setViewTarget(b)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-xs"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(b)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-xs"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(b)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all cursor-pointer text-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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

      <BlogViewModal
        blog={viewTarget}
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
      />
      <BlogFormModal
        blog={editTarget}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTarget(null);
        }}
        onSuccess={loadBlogs}
      />
      <DeleteConfirmModal
        blog={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
