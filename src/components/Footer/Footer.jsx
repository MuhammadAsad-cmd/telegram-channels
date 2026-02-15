"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FaFire, FaTrophy, FaMedal, FaTelegram } from "react-icons/fa";
import { Send } from "lucide-react";

const MotionLink = motion.create(Link);

const footerData = {
  media: {
    title: "Media",
    links: [
      { name: "Trending Channels", href: "#", icon: <FaFire className="w-3 h-3 text-accent-red" /> },
      { name: "Channels Rating", href: "#", icon: <FaTrophy className="w-3 h-3 text-accent-yellow" /> },
      { name: "Channels Ranking", href: "#", icon: <FaMedal className="w-3 h-3 text-accent-yellow" /> },
      { name: "Telegram Channels", href: "#" },
      { name: "Telegram Groups", href: "#" },
      { name: "Telegram Bots", href: "#" },
      { name: "Telegram Stickers", href: "#" },
    ],
  },
  links: {
    title: "Links",
    links: [
      { name: "Telegram", href: "https://telegram.org", icon: <FaTelegram className="w-3 h-3 text-accent-primary" /> },
      { name: "Telegraph", href: "https://telegra.ph" },
      { name: "Download Telegram", href: "https://telegram.org/apps" },
      { name: "Daily Channels", href: "#" },
      { name: "Advertising", href: "#" },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "DMCA", href: "/dmca" },
      { name: "RSS", href: "/rss" },
      { name: "API", href: "/api" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-secondary-dark border-t border-white/6">
      {/* Main Footer Content */}
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Media Column */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">{footerData.media.title}</h3>
            <ul className="space-y-2.5">
              {footerData.media.links.map((link, index) => (
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

          {/* Links Column */}
          <div>
            <h3 className="font-semibold text-sm text-text-primary mb-4 uppercase tracking-wider">{footerData.links.title}</h3>
            <ul className="space-y-2.5">
              {footerData.links.links.map((link, index) => (
                <li key={index}>
                  <MotionLink
                    href={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="text-text-muted hover:text-text-primary transition-colors text-sm flex items-center gap-2"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {link.icon}
                    {link.name}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
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
          <div className="flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-2 text-text-primary mb-4">
              <Send className="w-6 h-6" />
              <span className="font-semibold text-lg">Telegram Channels</span>
            </div>
            <p className="text-text-muted text-sm text-center lg:text-left leading-relaxed">
              A curated list of Telegram Channels, Groups and Bots submitted by users.
            </p>
            <p className="text-accent-primary text-sm mt-3 text-center lg:text-left">
              Not affiliated with Telegram.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-white/6">
        <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted/60 text-sm">
            © 2018-2026 Telegram Channels. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <MotionLink
              href="/privacy"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="text-text-muted/60 hover:text-text-primary transition-colors text-sm"
            >
              Privacy
            </MotionLink>
            <MotionLink
              href="/terms"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="text-text-muted/60 hover:text-text-primary transition-colors text-sm"
            >
              Terms
            </MotionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
