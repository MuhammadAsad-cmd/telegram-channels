"use client";

import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="hero-grid-bg min-h-[70vh] relative flex items-center">
      {/* Gradient overlay for depth */}
      <div className="hero-gradient-overlay absolute inset-0 pointer-events-none" />
      
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="flex flex-col items-center text-center py-20">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-6 tracking-tight max-w-3xl">
            Discover The Best Telegram Channels
          </h1>
          
          {/* Subtitle */}
          <p className="text-text-muted text-lg md:text-xl mb-12 max-w-2xl">
            More than <span className="font-semibold text-text-primary">11,550</span> Channels, Groups, Bots, and Stickers in English
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>

          {/* Quick Stats - subtle and minimal */}
          <div className="flex items-center gap-6 mt-8 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-secondary rounded-full animate-pulse" />
              <span>264 Online</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">7,331 Channels</span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">1,383 Groups</span>
          </div>
        </div>
      </div>
    </section>
  );
}
