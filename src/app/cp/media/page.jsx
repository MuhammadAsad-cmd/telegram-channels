import { Megaphone } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import Link from "next/link";

export default function CpMediaPage() {
  return (
    <div className="space-y-6">
      <CpCard className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            There are no media submitted!
          </h3>
          <p className="text-gray-500 text-sm mb-4 max-w-sm">
            Start by adding your first channel, group, or bot to get started.
          </p>
          <Link
            href="/cp/media/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add New Media
          </Link>
        </div>
      </CpCard>
    </div>
  );
}
