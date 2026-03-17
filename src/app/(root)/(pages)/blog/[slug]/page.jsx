"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api/blogService";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const MotionLink = motion.create(Link);

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function estimateReadTime(html = "") {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const slug = useMemo(() => {
    if (!params?.slug) return null;
    const s = params.slug;
    return Array.isArray(s) ? s[0] : String(s);
  }, [params?.slug]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Invalid blog");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchBlogBySlug(slug);
        const data = res?.data;
        if (cancelled) return;

        if (data?.result && Array.isArray(data?.data) && data.data.length > 0) {
          const b = data.data[0];
          setBlog(b);

          const allRes = await fetchBlogs();
          const all = allRes?.data?.data ?? [];
          const related = Array.isArray(all)
            ? all
                .filter((x) => (x.slug || x._id) !== (b.slug || b._id))
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                )
                .slice(0, 3)
            : [];
          if (!cancelled) setRelatedBlogs(related);
        } else {
          setBlog(null);
          setError("Blog not found");
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load blog");
          setBlog(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="h-4 w-24 bg-white/10 rounded-full animate-pulse mb-10" />
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mb-3 w-3/4" />
          <div className="h-8 bg-white/10 rounded-lg animate-pulse mb-8 w-1/2" />
          <div className="flex gap-4 mb-10">
            <div className="h-4 w-28 bg-white/5 rounded-full animate-pulse" />
            <div className="h-4 w-20 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="aspect-video bg-white/5 rounded-2xl animate-pulse mb-12" />
          <div className="space-y-3">
            {[100, 95, 88, 100, 72, 90, 60].map((w, i) => (
              <div
                key={i}
                className="h-4 bg-white/5 rounded-full animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-6">✦</div>
          <h1 className="text-2xl font-semibold text-slate-100 mb-3">
            {error || "Blog not found"}
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            The article you're looking for doesn't exist or was removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MotionLink
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All articles
            </MotionLink>
          </motion.div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Meta row */}
          <div className="flex items-center gap-4 mb-5">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wide uppercase">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wide uppercase">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-slate-50 leading-tight tracking-tight mb-0">
            {blog.title}
          </h1>
        </motion.header>

        {/* ── Hero image (full column width) ── */}
        {blog.image && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mb-12"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-white/8">
              <Image
                src={blog.image}
                alt={blog.title || ""}
                fill
                unoptimized
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
              {/* subtle gradient overlay at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent mb-12 origin-left"
        />

        {/* ── Article body ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mb-20 [&_h1]:text-3xl wrap-break-word [&_h1]:font-bold [&_h1]:text-slate-50 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1:first-child]:mt-0 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-100 [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-100 [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:text-slate-400 [&_p]:leading-[1.85] [&_p]:mb-5 [&_p]:text-[1.0625rem] [&_ul]:text-slate-400 [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:text-slate-400 [&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:mb-2 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-5 [&_blockquote]:my-6 [&_blockquote]:text-slate-400 [&_blockquote]:italic [&_blockquote]:text-lg [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-300 [&_strong]:text-slate-200 [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_pre]:bg-slate-900 [&_pre]:border [&_pre]:border-white/8 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_code]:bg-slate-900 [&_code]:border [&_code]:border-white/8 [&_code]:rounded-md [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-slate-300 [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_img]:rounded-xl [&_img]:my-6 [&_img]:w-full [&_hr]:border-slate-800 [&_hr]:my-8"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* ── Related articles ── */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* section header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                More articles
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedBlogs.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.07 }}
                >
                  <MotionLink
                    href={`/blog/${b.slug || b._id}`}
                    className="group flex flex-col rounded-xl overflow-hidden bg-slate-900 ring-1 ring-white/6 hover:ring-blue-500/40 transition-all duration-300 h-full"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-slate-800 shrink-0">
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title || ""}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-slate-800" />
                      )}
                    </div>

                    {/* card body */}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                      <h3 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {b.title || "Untitled"}
                      </h3>
                      {b.createdAt && (
                        <p className="text-xs text-slate-600 mt-auto">
                          {formatDate(b.createdAt)}
                        </p>
                      )}
                    </div>
                  </MotionLink>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </article>
    </div>
  );
}