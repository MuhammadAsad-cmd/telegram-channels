"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuthContext } from "@/context/AdminAuthContext";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/admin-dashboard";
  const { login, adminLoginApi, isAuthenticated } = useAdminAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnTo.startsWith("/admin-dashboard") ? returnTo : "/admin-dashboard");
    }
  }, [isAuthenticated, returnTo, router]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await adminLoginApi({ email, password });
      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      if (!token) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      login(token, data?.admin ?? data?.data ?? null);
      router.replace(returnTo.startsWith("/admin-dashboard") ? returnTo : "/admin-dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Invalid email or password";
      setError(typeof msg === "string" ? msg : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 hero-grid-bg hero-gradient-overlay pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <div className="bg-secondary-dark/80 backdrop-blur-xl rounded-3xl border border-white/8 shadow-2xl shadow-black/30 p-8 md:p-10">
          {/* Logo & title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-primary/15 text-accent-primary mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-text-primary font-semibold text-xl tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-text-muted text-sm mt-1.5">
              Sign in to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-text-muted text-xs font-medium mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-text-muted text-xs font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-text-muted/60 text-xs text-center mt-6">
            Protected admin area. Use your admin credentials.
          </p>
        </div>

        <a
          href="/"
          className="block text-center text-text-muted text-sm mt-6 hover:text-text-primary transition-colors"
        >
          ← Back to site
        </a>
      </div>
    </div>
  );
}
