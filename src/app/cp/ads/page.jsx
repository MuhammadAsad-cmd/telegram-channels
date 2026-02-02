import Link from "next/link";
import {
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import CpCard from "@/components/Cp/CpCard";

export default function CpAdsPage() {
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
          <li>• Maximum lifetime of an ad is <strong>30 days</strong></li>
          <li>• Maximum active ads per user is <strong>10 ads</strong></li>
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
