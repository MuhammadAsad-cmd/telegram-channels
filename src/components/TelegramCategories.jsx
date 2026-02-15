"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Megaphone, Users, Bot, Sticker, ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const MotionLink = motion.create(Link);

const typeItems = [
  { title: "Channels", type: "channel", icon: Megaphone },
  { title: "Groups", type: "group", icon: Users },
  { title: "Bots", type: "bot", icon: Bot },
  { title: "Stickers", type: "sticker", icon: Sticker },
];

export default function TelegramCategories() {
  const { categories } = useCategories();
  const displayCategories = categories?.slice(0, 3) ?? [];

  return (
    <motion.div
      className="w-full max-w-[1344px] mx-auto px-4 md:px-8 py-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {displayCategories.map((cat) => (
          <MotionLink
            key={cat._id}
            href={`/search?category=${cat._id}`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="bg-secondary-dark border border-white/6 rounded-lg p-5 hover:border-white/12 cursor-pointer group block"
          >
            <div className="flex items-center gap-4">
              <div
                className="bg-primary-dark rounded-lg p-3 group-hover:bg-accent-primary/10 transition-colors duration-300 w-12 h-12 flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-accent-primary"
                dangerouslySetInnerHTML={{ __html: cat.logo ?? "" }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary mb-0.5">{cat.title}</h3>
                <p className="text-text-muted text-sm">
                  {cat.channelCount ?? 0} {cat.channelCount === 1 ? "Channel" : "Channels"}
                </p>
              </div>
            </div>
          </MotionLink>
        ))}

        <MotionLink
          href="/search"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
          className="bg-secondary-dark border border-white/6 rounded-lg p-5 hover:border-accent-primary/50 cursor-pointer flex items-center justify-center group"
        >
          <div className="text-center flex items-center gap-3">
            <h3 className="text-lg font-medium text-text-primary">All Categories</h3>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </MotionLink>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {typeItems.map((item) => {
          const Icon = item.icon;
          return (
            <MotionLink
              key={item.type}
              href={`/search?type=${item.type}`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="relative bg-secondary-dark border border-white/6 rounded-lg p-5 overflow-hidden hover:border-white/12 cursor-pointer flex items-center justify-center flex-col gap-1 group"
            >
              <div className="absolute -top-4 -left-8 opacity-20">
                <Icon className="w-20 h-20 text-accent-primary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary relative z-10">{item.title}</h3>
              <p className="text-accent-primary font-semibold text-xl relative z-10">Browse</p>
            </MotionLink>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
