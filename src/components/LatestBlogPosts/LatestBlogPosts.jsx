"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { fetchBlogs } from "@/lib/api/blogService";
import { FaBlog } from "react-icons/fa";
import { ArrowRight, Calendar } from "lucide-react";

const MotionLink = motion.create(Link);

const LATEST_LIMIT = 4;

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").trim();
}

export default function LatestBlogPosts() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then((res) => {
        const list = res.data?.data ?? [];
        const sorted = Array.isArray(list)
          ? [...list].sort(
              (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
          : [];
        setBlogs(sorted.slice(0, LATEST_LIMIT));
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.section
      className="py-14 bg-slate-950"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1344px] mx-auto px-4 md:px-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FaBlog className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100 leading-none">
                Latest Articles
              </h2>
              <p className="text-xs text-slate-500 mt-1">Fresh from the blog</p>
            </div>
          </div>

          <MotionLink
            href="/blog"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </MotionLink>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-slate-900 ring-1 ring-white/5 animate-pulse">
                <div className="aspect-16/10 bg-slate-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-800 rounded-full w-24" />
                  <div className="h-4 bg-slate-800 rounded-full w-full" />
                  <div className="h-4 bg-slate-800 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-800 rounded-full w-full mt-3" />
                  <div className="h-3 bg-slate-800 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaBlog className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {blogs.map((post) => {
              const description = stripHtml(post.description || post.excerpt || post.content || "");

              return (
                <MotionLink
                  key={post._id}
                  href={`/blog/${post.slug || post._id}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="group flex flex-col rounded-xl overflow-hidden bg-slate-900 ring-1 ring-white/6 hover:ring-blue-500/35 hover:shadow-lg hover:shadow-blue-950/40 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-16/10 bg-slate-800 overflow-hidden shrink-0">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title || ""}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-500/10 to-slate-800">
                        <FaBlog className="w-8 h-8 text-blue-500/30" />
                      </div>
                    )}
                    {/* overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    {/* Date */}
                    {post.createdAt && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.createdAt)}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title || "Untitled"}
                    </h3>

                    {/* Description / excerpt */}
                    {description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-0.5">
                        {description}
                      </p>
                    )}

                    {/* Read more */}
                    <div className="flex items-center gap-1 mt-auto pt-3 text-[11px] font-medium text-blue-500 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                      Read article
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </MotionLink>
              );
            })}
          </motion.div>
        )}

        {/* Mobile "view all" link */}
        <div className="flex justify-end mt-6 sm:hidden">
          <MotionLink
            href="/blog"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            View all articles
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </MotionLink>
        </div>
      </div>
    </motion.section>
  );
}