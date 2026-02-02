import { History, FileText } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import Link from "next/link";

export default function CpTcpHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          TCP History
        </h1>
        <p className="text-gray-500 text-sm">
          View your deposit and transaction history
        </p>
      </div>

      <CpCard className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-500 text-sm mb-4 max-w-sm">
            Your top-up and advertising transactions will appear here.
          </p>
          <Link
            href="/cp/deposit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Top Up Account
          </Link>
        </div>
      </CpCard>
    </div>
  );
}
