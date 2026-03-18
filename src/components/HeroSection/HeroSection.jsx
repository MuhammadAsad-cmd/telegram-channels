"use client";

import { motion } from "motion/react";
import SearchBar from "./SearchBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    <section className="hero-grid-bg min-h-[70vh] relative flex items-center">
      {/* Gradient overlay for depth */}
      <div className="hero-gradient-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-[1344px] mx-auto px-4 md:px-8 w-full relative z-10">
        <motion.div
          className="flex flex-col items-center text-center py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-6 tracking-tight max-w-3xl"
          >
            Discover The Best Telegram Channels
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-text-muted text-lg md:text-xl mb-12 max-w-2xl"
          >
            More than{" "}
            <span className="font-semibold text-text-primary">11,550</span>{" "}
            Channels, Groups, Bots, and Stickers in English
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="w-full max-w-3xl">
            <SearchBar />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
