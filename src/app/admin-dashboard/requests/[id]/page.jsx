"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  Wallet,
  FileText,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { adminFetchRequests } from "@/lib/api/adminService";
import { toast } from "sonner";

const STATUS_STYLES = {
  requested: "bg-accent-yellow/15 text-accent-yellow",
  accepted: "bg-accent-secondary/15 text-accent-secondary",
  cancelled: "bg-accent-red/15 text-accent-red",
};

function ImageModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <button type="button" onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
        <X className="w-5 h-5" />
      </button>
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="Evidence" width={800} height={600} className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg" unoptimized />
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div className="flex flex-wrap items-start gap-2 py-2 border-b border-white/6 last:border-0">
      <span className="text-text-muted text-sm shrink-0 w-28">{label}</span>
      <span className={`text-text-primary text-sm flex-1 break-all ${mono ? "font-mono" : ""}`}>{value ?? "—"}</span>
    </div>
  );
}

export default function AdminRequestDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalSrc, setImageModalSrc] = useState(null);

  useEffect(() => {
    if (!id) return;
    adminFetchRequests({ id })
      .then((res) => {
        const data = res.data?.data;
        const single = Array.isArray(data) ? data[0] : data;
        setRequest(single ?? null);
      })
      .catch(() => toast.error("Failed to load request"))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-4">
        <Link href="/admin-dashboard/requests" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to requests
        </Link>
        <p className="text-text-muted">Request not found.</p>
      </div>
    );
  }

  const user = request.user;
  const crypto = request.crypto;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin-dashboard/requests" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-text-primary font-bold text-lg">Request details</h1>
          <p className="text-text-muted text-xs font-mono">{request._id}</p>
        </div>
      </div>

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <h2 className="text-text-primary font-semibold text-sm">Overview</h2>
        </div>
        <div className="p-5 space-y-0">
          <DetailRow label="Status" value={request.status} />
          <DetailRow label="Amount" value={request.amount != null ? `$${request.amount}` : null} />
          <DetailRow label="Created" value={formatDate(request.createdAt)} />
          <DetailRow label="Updated" value={formatDate(request.updatedAt)} />
        </div>
      </div>

      {user && (
        <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
            <User className="w-4 h-4 text-text-muted" />
            <h2 className="text-text-primary font-semibold text-sm">User</h2>
          </div>
          <div className="p-5 flex flex-wrap items-center gap-4">
            {user.image && (
              <Image src={user.image} alt="" width={48} height={48} className="w-12 h-12 rounded-full object-cover" unoptimized />
            )}
            <div className="space-y-0">
              <DetailRow label="Name" value={user.name} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Wallet" value={user.wallet != null ? `$${user.wallet}` : null} />
              <DetailRow label="ID" value={user._id} mono />
            </div>
          </div>
        </div>
      )}

      {crypto && (
        <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-text-muted" />
            <h2 className="text-text-primary font-semibold text-sm">Payment method</h2>
          </div>
          <div className="p-5 flex flex-wrap items-start gap-4">
            {crypto.paymentImage && (
              <Image src={crypto.paymentImage} alt="" width={56} height={56} className="w-14 h-14 rounded-lg object-cover shrink-0" unoptimized />
            )}
            <div className="flex-1 min-w-0 space-y-0">
              <DetailRow label="Title" value={crypto.title} />
              <DetailRow label="Payment ID" value={crypto.paymentId} mono />
              <DetailRow label="ID" value={crypto._id} mono />
            </div>
          </div>
        </div>
      )}

      <div className="bg-secondary-dark rounded-2xl border border-white/6 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center gap-2">
          <FileText className="w-4 h-4 text-text-muted" />
          <h2 className="text-text-primary font-semibold text-sm">Evidence</h2>
        </div>
        <div className="p-5">
          {request.evidence ? (
            <button
              type="button"
              onClick={() => setImageModalSrc(request.evidence)}
              className="block rounded-xl overflow-hidden border border-white/10 hover:border-accent-primary/30 transition-colors cursor-pointer max-w-sm"
            >
              <Image
                src={request.evidence}
                alt="Evidence"
                width={400}
                height={300}
                className="w-full h-auto object-contain max-h-80"
                unoptimized
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <ImageIcon className="w-5 h-5" />
              No evidence
            </div>
          )}
        </div>
      </div>

      <ImageModal src={imageModalSrc} onClose={() => setImageModalSrc(null)} />
    </div>
  );
}
