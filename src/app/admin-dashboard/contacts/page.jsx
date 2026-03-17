"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Mail, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  adminFetchContacts,
  adminUpdateContact,
  adminRemoveContact,
} from "@/lib/api/adminService";

function EditContactModal({ contact, isOpen, onClose, onSuccess }) {
  const [subject, setSubject] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) setSubject(contact.subject ?? "");
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact?._id) return;
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    setSaving(true);
    try {
      await adminUpdateContact(contact._id, { subject: subject.trim() });
      toast.success("Contact updated");
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Failed to update";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold">Edit Contact</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-muted text-xs font-medium mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContactViewModal({ contact, isOpen, onClose }) {
  if (!isOpen || !contact) return null;

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
      <div className="relative bg-secondary-dark rounded-2xl border border-white/8 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 sticky top-0 bg-secondary-dark z-10">
          <h3 className="text-text-primary font-semibold">Contact Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-text-muted text-xs mb-1">Email</p>
            <a
              href={`mailto:${contact.email}`}
              className="text-accent-primary hover:underline break-all"
            >
              {contact.email ?? "—"}
            </a>
          </div>
          {contact.username && (
            <div>
              <p className="text-text-muted text-xs mb-1">Username</p>
              <p className="text-text-primary">{contact.username}</p>
            </div>
          )}
          <div>
            <p className="text-text-muted text-xs mb-1">Subject</p>
            <p className="text-text-primary">{contact.subject ?? "—"}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Message</p>
            <p className="text-text-primary text-sm whitespace-pre-wrap">
              {contact.message ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Received</p>
            <p className="text-text-primary text-sm">
              {formatDate(contact.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ contact, isOpen, onClose, onConfirm }) {
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
          Delete contact?
        </h3>
        <p className="text-text-muted text-sm mb-6">
          This will permanently remove this contact message. This action cannot
          be undone.
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
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadContacts = useCallback(() => {
    setLoading(true);
    adminFetchContacts()
      .then((res) => {
        const list = res.data?.data ?? [];
        setContacts(Array.isArray(list) ? list : []);
      })
      .catch(() => toast.error("Failed to load contacts"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filtered = contacts.filter((c) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.username ?? "").toLowerCase().includes(q) ||
      (c.subject ?? "").toLowerCase().includes(q) ||
      (c.message ?? "").toLowerCase().includes(q)
    );
  });

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

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await adminRemoveContact(deleteTarget._id);
      toast.success("Contact removed");
      loadContacts();
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

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-text-primary font-bold text-lg">Contacts</h1>
        <p className="text-text-muted text-xs mt-0.5">
          {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-secondary-dark rounded-xl border border-white/6 p-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, username, subject..."
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
              <div
                key={i}
                className="h-12 bg-white/3 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
              <Mail className="w-6 h-6 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium text-sm">
              No contacts found
            </p>
            <p className="text-text-muted text-xs">
              {search ? "Try a different search" : "Contact messages will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/6 text-text-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">#</th>
                  <th className="text-left px-4 py-3.5">Email / Username</th>
                  <th className="text-left px-4 py-3.5">Subject</th>
                  <th className="text-left px-4 py-3.5">Message</th>
                  <th className="text-left px-4 py-3.5">Date</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((c, idx) => (
                  <tr
                    key={c._id}
                    onClick={() => setViewTarget(c)}
                    className="hover:bg-white/2 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-text-muted text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-text-primary text-sm truncate max-w-[180px]">
                          {c.email ?? "—"}
                        </span>
                        {c.username && (
                          <span className="text-text-muted text-xs">
                            @{c.username}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-primary text-sm truncate max-w-[160px] block">
                        {c.subject ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm line-clamp-2 max-w-[220px]">
                        {c.message ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-text-muted text-sm">
                        {formatDate(c.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setViewTarget(c)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-xs"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditTarget(c)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all cursor-pointer text-xs"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
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

      <ContactViewModal
        contact={viewTarget}
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
      />
      <EditContactModal
        contact={editTarget}
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={loadContacts}
      />
      <DeleteConfirmModal
        contact={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
