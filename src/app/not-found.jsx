import Link from "next/link";
import { Send, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-dark">
      <div className="max-w-[1344px] mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-8">
            <Send className="w-10 h-10 text-accent-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
            Page not found
          </h1>
          <p className="text-text-muted text-lg mb-10 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              Search channels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
