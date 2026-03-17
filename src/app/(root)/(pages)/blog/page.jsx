"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { fetchBlogs } from "@/lib/api/blogService";
import { FaBlog } from "react-icons/fa";

const MotionLink = motion.create(Link);

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogListPage() {
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
        setBlogs(sorted);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Blog
          </h1>
          <p className="text-text-muted">
            Articles, guides, and tips for Telegram channels and communities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-secondary-dark border border-white/6 rounded-xl overflow-hidden h-80 animate-pulse"
              />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <FaBlog className="w-8 h-8 text-text-muted/40" />
            </div>
            <p className="text-text-primary font-medium mb-1">No blog posts yet</p>
            <p className="text-text-muted text-sm">
              Check back soon for new articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post, idx) => (
              <MotionLink
                key={post._id}
                href={`/blog/${post.slug || post._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group bg-secondary-dark border border-white/6 rounded-xl overflow-hidden hover:border-accent-primary/30 transition-colors"
              >
                <div className="relative aspect-[16/10] bg-white/5 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title || ""}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent-primary/10">
                      <FaBlog className="w-12 h-12 text-accent-primary/30" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-text-muted text-xs mb-2">
                    {formatDate(post.createdAt)}
                  </p>
                  <h2 className="text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 mb-2">
                    {post.title || "Untitled"}
                  </h2>
                  <p className="text-text-muted text-sm line-clamp-2">
                    {post.content
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 120)
                      .trim() || "Read more..."}
                    ...
                  </p>
                </div>
              </MotionLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
