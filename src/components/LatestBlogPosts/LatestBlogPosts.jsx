"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { blogPosts } from "@/data/blogPosts";
import { FaBlog } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const MotionLink = motion.create(Link);

// Telegram Icon Component
function TelegramIcon() {
  return (
    <div className="bg-accent-primary/20 rounded-xl p-3 flex items-center justify-center shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="w-6 h-6"
        fill="currentColor"
      >
        <path 
          d="M 14.465 17.538 L 18.965 3.873 C 19.12 3.405 19.117 2.898 18.958 2.431 C 18.554 1.248 17.267 0.617 16.084 1.02 L 2.464 5.651 C 2.136 5.762 1.839 5.947 1.594 6.19 C 0.701 7.076 0.696 8.517 1.581 9.409 C 1.81 9.635 2.085 9.809 2.386 9.922 L 7.438 11.822 C 7.808 11.962 8.102 12.253 8.246 12.623 L 10.195 17.656 C 10.441 18.289 10.958 18.778 11.604 18.989 C 12.794 19.378 14.075 18.728 14.465 17.538 Z M 12.819 18.135 C 12.099 18.417 11.287 18.062 11.005 17.342 L 9.056 12.309 C 8.824 11.709 8.346 11.236 7.744 11.009 L 2.692 9.109 C 2.301 8.96 1.997 8.643 1.863 8.247 C 1.617 7.514 2.011 6.72 2.744 6.473 L 16.364 1.843 C 16.865 1.666 17.423 1.794 17.797 2.172 C 18.178 2.542 18.312 3.098 18.14 3.601 L 13.64 17.265 C 13.51 17.663 13.209 17.982 12.819 18.135 Z" 
          className="text-accent-primary"
        />
      </svg>
    </div>
  );
}

export default function LatestBlogPosts() {
  return (
    <motion.section
      className="py-12 bg-primary-dark"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1344px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-6">
          <FaBlog className="w-5 h-5 text-accent-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Latest Blog Posts</h2>
        </div>

        {/* Blog Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {blogPosts.map((post) => (
            <MotionLink
              key={post.id}
              href={`/blog/${post.slug}`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="bg-secondary-dark border border-white/6 rounded-lg p-4 flex items-center gap-4 hover:border-white/12 group"
            >
              <TelegramIcon />
              <h3 className="text-sm text-text-muted group-hover:text-text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </MotionLink>
          ))}
        </motion.div>

        {/* More Articles Link */}
        <div className="flex justify-end mt-6">
          <MotionLink
            href="/blog"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 transition-colors text-sm group"
          >
            <FaBlog className="w-4 h-4" />
            <span>More Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MotionLink>
        </div>
      </div>
    </motion.section>
  );
}
