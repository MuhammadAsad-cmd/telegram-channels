"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import CpCard from "@/components/Cp/CpCard";
import { getProfile } from "@/lib/api/userService";
import {
  fetchPackages,
  activatePackage,
  fetchCurrentActivePackage,
} from "@/lib/api/packageService";

export default function CpAdsPage() {
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [activatingPackageId, setActivatingPackageId] = useState(null);

  const [userId, setUserId] = useState(null);
  const [activePackageId, setActivePackageId] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingPackages(true);

      try {
        const [profileRes, packagesRes] = await Promise.all([
          getProfile(),
          fetchPackages(),
        ]);

        const profile = profileRes?.data?.data ?? profileRes?.data ?? profileRes;
        const packagesList = packagesRes?.data?.data ?? packagesRes?.data ?? [];

        if (cancelled) return;

        setUserId(profile?._id ?? null);
        setPackages(Array.isArray(packagesList) ? packagesList : []);
      } catch (e) {
        if (!cancelled) toast.error("Failed to load packages");
      } finally {
        if (!cancelled) setLoadingPackages(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setLoadingActive(true);

    fetchCurrentActivePackage(userId)
      .then((res) => {
        const current = res?.data?.data;
        const pkgId = current?.packageRef?._id ?? null;
        if (!cancelled) setActivePackageId(pkgId);
      })
      .catch(() => {
        if (!cancelled) setActivePackageId(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingActive(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const sortedPackages = useMemo(() => {
    return [...packages].sort((a, b) => {
      const sa = Number(a?.sortOrder ?? 0);
      const sb = Number(b?.sortOrder ?? 0);
      return sa - sb;
    });
  }, [packages]);

  const handleActivate = async (packageId) => {
    setActivatingPackageId(packageId);
    try {
      await activatePackage({ packageId });
      setActivePackageId(packageId);
      toast.success("Package activated successfully");

      if (userId) {
        const res = await fetchCurrentActivePackage(userId);
        const current = res?.data?.data;
        const pkgId = current?.packageRef?._id ?? packageId;
        setActivePackageId(pkgId);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message ?? "Failed to activate package");
    } finally {
      setActivatingPackageId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Advertising on TelegramChannels
        </h1>
        <p className="text-gray-600">
          Promote your Telegram Channels, Groups, or Bots to users who are
          actively searching for Telegram media.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CpCard className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-primary" />
            Why Advertise Here?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Targeted audience actively seeking Telegram content</li>
            <li>• High engagement from quality traffic</li>
            <li>• Flexible budget options</li>
            <li>• Real-time performance tracking</li>
          </ul>
        </CpCard>

        <CpCard className="p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent-primary" />
            Ad Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Click-based pricing model</li>
            <li>• Geo and category targeting</li>
            <li>• Schedule your campaigns</li>
            <li>• Pause or resume anytime</li>
          </ul>
        </CpCard>
      </div>

      <CpCard className="p-6">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent-primary" />
          Smart Pricing
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Our dynamic pricing adjusts based on demand and category. You only pay
          for actual clicks.
        </p>
        <Link
          href="#"
          className="text-accent-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
        >
          Learn more about click-based pricing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CpCard>

      <CpCard className="p-6">
        <h3 className="font-semibold text-gray-800 mb-2">NSFW Media</h3>
        <p className="text-gray-600 text-sm">
          NSFW content has restricted advertising options. Please ensure your
          media complies with our advertising policies.
        </p>
      </CpCard>

      <CpCard className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4">
          Cancellation & Limitations
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            • Maximum lifetime of an ad is <strong>30 days</strong>
          </li>
          <li>
            • Maximum active ads per user is <strong>10 ads</strong>
          </li>
          <li>
            • Minimum balance to create a new ad is <strong>$10</strong>
          </li>
        </ul>
      </CpCard>

      <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4">
        <h3 className="font-semibold text-accent-red mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Important Notice
        </h3>
        <p className="text-sm text-gray-700">
          Accounts promoting spam, scam, illegal content, or violating our
          policies will be{" "}
          <strong>deactivated without any notice and without any refund</strong>
          .
        </p>
      </div>

      <CpCard className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Choose a Promotion Package
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Activate one package at a time. Your current package is highlighted.
        </p>

        {loadingPackages ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : sortedPackages.length === 0 ? (
          <div className="text-sm text-gray-600">No packages found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPackages.map((pkg) => {
              const isCurrent = pkg?._id === activePackageId;
              const isAvailable = pkg?.isActive ?? true;
              const isActivating = activatingPackageId === pkg?._id;
              const discount = Number(pkg?.discountAmount ?? 0);

              return (
                <div
                  key={pkg?._id}
                  className={`relative p-5 rounded-xl border transition-all ${
                    isCurrent
                      ? "border-accent-primary/60 ring-2 ring-accent-primary/20 bg-accent-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-primary" />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 pr-10">
                    {pkg?.title ?? "—"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {pkg?.description ?? ""}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {pkg?.isMostPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent-yellow/20 text-accent-yellow text-xs font-medium">
                        Most Popular
                      </span>
                    )}
                    {pkg?.isHomepagePlacement && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-medium">
                        Homepage
                      </span>
                    )}
                    {pkg?.isFasterApproval && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-medium">
                        Faster Approval
                      </span>
                    )}
                    {pkg?.isPrioritySupport && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-medium">
                        Priority Support
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        ${pkg?.price ?? "0"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pkg?.durationInMonths ?? 0} months
                      </p>
                      {discount > 0 ? (
                        <p className="text-xs text-accent-primary mt-1 font-medium">
                          Save ${discount}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">No discount</p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable || isCurrent || isActivating || loadingActive}
                      onClick={() => handleActivate(pkg?._id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                        isCurrent
                          ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/30"
                          : "bg-accent-secondary hover:bg-accent-secondary/90 text-white"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                      aria-disabled={!isAvailable || isCurrent}
                    >
                      {isActivating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCurrent ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                      {isCurrent
                        ? "Active"
                        : !isAvailable
                          ? "Unavailable"
                          : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CpCard>

      <CpCard className="p-8 bg-secondary-dark border-0">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Start Advertising Today
          </h3>
          <p className="text-text-muted text-sm mb-6">
            You need to top up your account before continue. Minimum budget to
            create an ad is $10
          </p>
          <Link
            href="/cp/deposit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent-yellow hover:bg-accent-yellow/90 text-gray-900 font-medium rounded-lg transition-colors"
          >
            Top Up
          </Link>
          <p className="text-text-muted/80 text-xs mt-4">
            By creating an ad, you agree to comply with our advertising policies
          </p>
        </div>
      </CpCard>
    </div>
  );
}
