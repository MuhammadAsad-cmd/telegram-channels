"use client";

import {
  Brush,
  Car,
  Dices,
  FileText,
  BookOpen,
  Briefcase,
  Star,
  MessageCircle,
  Bitcoin,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Smile,
  Shirt,
  Utensils,
  Gamepad2,
  Heart,
  Languages,
  HeartHandshake,
  Megaphone,
  Film,
  Music,
  Leaf,
  Newspaper,
  Ban,
  MoreHorizontal,
  Camera,
  Landmark,
  FlaskConical,
  Lightbulb,
  ShoppingCart,
  Dumbbell,
  Sticker,
  Cpu,
  Send,
  Plane,
  Wrench,
  Rocket,
} from "lucide-react";

const categories = [
  { name: "Art & Design", count: 169, icon: Brush },
  { name: "Auto & Moto", count: 50, icon: Car },
  { name: "Betting", count: 553, icon: Dices },
  { name: "Blogs", count: 54, icon: FileText },
  { name: "Books & Magazine", count: 87, icon: BookOpen },
  { name: "Business & Startups", count: 135, icon: Briefcase },
  { name: "Celebrities", count: 28, icon: Star },
  { name: "Communication", count: 94, icon: MessageCircle },
  { name: "Crypto Airdrop", count: 334, icon: Bitcoin },
  { name: "Cryptocurrencies", count: 1812, icon: Bitcoin },
  { name: "Crypto & FX Trading", count: 1854, icon: TrendingUp },
  { name: "Economics & Finance", count: 120, icon: DollarSign },
  { name: "Education", count: 366, icon: GraduationCap },
  { name: "Entertainment", count: 341, icon: Smile },
  { name: "Fashion & Beauty", count: 88, icon: Shirt },
  { name: "Food", count: 27, icon: Utensils },
  { name: "Games & Apps", count: 367, icon: Gamepad2 },
  { name: "Health", count: 75, icon: Heart },
  { name: "Languages", count: 158, icon: Languages },
  { name: "Love", count: 24, icon: HeartHandshake },
  { name: "Marketing", count: 147, icon: Megaphone },
  { name: "Movies & Videos", count: 277, icon: Film },
  { name: "Music", count: 256, icon: Music },
  { name: "Nature & Animals", count: 66, icon: Leaf },
  { name: "News & Media", count: 225, icon: Newspaper },
  { name: "NSFW & Adults", count: 171, icon: Ban },
  { name: "Other", count: 467, icon: MoreHorizontal },
  { name: "Photo", count: 146, icon: Camera },
  { name: "Political", count: 133, icon: Landmark },
  { name: "Science", count: 44, icon: FlaskConical },
  { name: "Self Development", count: 114, icon: Lightbulb },
  { name: "Shop", count: 244, icon: ShoppingCart },
  { name: "Sports & Fitness", count: 106, icon: Dumbbell },
  { name: "Stickers", count: 1322, icon: Sticker },
  { name: "Technology", count: 470, icon: Cpu },
  { name: "Telegram", count: 136, icon: Send },
  { name: "Telegram Miniapps & Games", count: 90, icon: Rocket },
  { name: "Travel", count: 77, icon: Plane },
  { name: "Utilities & Tools", count: 326, icon: Wrench },
];

export default function CategoriesMenu() {
  return (
    <div className="bg-secondary-dark border border-white/6 rounded-lg shadow-2xl p-5 min-w-[700px]">
      <div className="grid grid-cols-3 gap-x-8 gap-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <a
              key={category.name}
              href="#"
              className="flex items-center gap-2.5 text-text-muted hover:text-text-primary py-1.5 transition-colors duration-200 group"
            >
              <Icon className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors duration-200" />
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-text-muted/60">({category.count.toLocaleString()})</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
