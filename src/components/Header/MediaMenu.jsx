"use client";

import { Megaphone, Users, Bot, Sticker } from "lucide-react";

const mediaItems = [
  { name: "Channels", icon: Megaphone },
  { name: "Groups", icon: Users },
  { name: "Bots", icon: Bot },
  { name: "Stickers", icon: Sticker },
];

export default function MediaMenu() {
  return (
    <div className="bg-secondary-dark border border-white/6 rounded-lg shadow-2xl py-2 min-w-[160px]">
      {mediaItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-text-muted hover:text-text-primary hover:bg-white/3 transition-colors duration-200"
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{item.name}</span>
          </a>
        );
      })}
    </div>
  );
}
