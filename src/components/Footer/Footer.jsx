"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Send, Search, Megaphone, Users, Bot, Sticker, TrendingUp, ListOrdered, Medal, BookOpen } from "lucide-react";

const MotionLink = motion.create(Link);

const footerData = {
  explore: {
    title: "Explore",
    links: [
      { name: "Search", href: "/search", icon: <Search className="w-3.5 h-3.5 text-accent-primary" /> },
      { name: "Channels", href: "/search?type=channel", icon: <Megaphone className="w-3.5 h-3.5" /> },
      { name: "Groups", href: "/search?type=group", icon: <Users className="w-3.5 h-3.5" /> },
      { name: "Bots", href: "/search?type=bot", icon: <Bot className="w-3.5 h-3.5" /> },
      { name: "Stickers", href: "/search?type=sticker", icon: <Sticker className="w-3.5 h-3.5" /> },
      { name: "Trending", href: "/search?sortKey=rating", icon: <TrendingUp className="w-3.5 h-3.5 text-accent-yellow" /> },
      { name: "Top 100", href: "/search?sortKey=createdAt", icon: <ListOrdered className="w-3.5 h-3.5" /> },
      { name: "Ranking", href: "/ranking", icon: <Medal className="w-3.5 h-3.5 text-accent-yellow" /> },
      { name: "Blog", href: "/blog", icon: <BookOpen className="w-3.5 h-3.5" /> },
    ],
  },
  about: {
    title: "Legal & Info",
    links: [
      { name: "About Us", href: "/about-us" },
      { name: "Editorial Policy", href: "/editorial-policy" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "DMCA Policy", href: "/dmca" },
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Content Removal Request", href: "/remove-listing" },
      { name: "Acceptable Use Policy", href: "/acceptable-use" },
      { name: "Contact", href: "/contact" },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary-dark border-t border-white/6">
      {/* Main Footer Content */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Explore Column - search, channels, groups, bots, etc. */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">{footerData.explore.title}</h3>
            <ul className="space-y-2.5">
              {footerData.explore.links.map((link, index) => (
                <li key={index}>
                  <MotionLink
                    href={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm flex items-center gap-2"
                  >
                    {link.icon}
                    {link.name}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column - About Us, Contact Us, Privacy, Terms */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">{footerData.about.title}</h3>
            <ul className="space-y-2.5">
              {footerData.about.links.map((link, index) => (
                <li key={index}>
                  <MotionLink
                    href={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-text-primary mb-4">
              <Send className="w-6 h-6" />
              <span className="font-semibold text-lg">Telegram Channels</span>
            </div>
            <p className="text-text-muted text-sm text-center md:text-left leading-relaxed">
              A curated list of Telegram Channels, Groups and Bots submitted by users.
            </p>
            <p className="text-accent-primary text-sm mt-3 text-center md:text-left">
              Not affiliated with Telegram.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-white/6">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-4">
          <p className="text-text-muted/60 text-sm text-center md:text-left">
            © {currentYear} Telegram Channels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
