"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";

export default function CpMediaCreatePage() {
  const [mediaLink, setMediaLink] = useState("");

  const handleFetch = (e) => {
    e.preventDefault();
    console.log("Fetching:", mediaLink);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-gray-800">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Note
        </h3>
        <ol className="text-sm space-y-2 list-decimal list-inside text-amber-900/90">
          <li>
            Do not add <strong>spam, scam, violence or pornographic</strong> content.
          </li>
          <li>
            Media containing <strong>illegal content</strong> will be{" "}
            <strong>REJECTED or DEACTIVATED</strong>.
          </li>
          <li>
            Make sure your media has proper <span className="text-amber-700 font-medium">language</span> and{" "}
            <span className="text-amber-700 font-medium">Translations</span> settings.
          </li>
        </ol>
      </div>

      <CpCard className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Media&apos;s Link
        </h2>
        <form onSubmit={handleFetch} className="space-y-3">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <input
                type="url"
                value={mediaLink}
                onChange={(e) => setMediaLink(e.target.value)}
                placeholder="https://t.me/dailychannels"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-accent-secondary hover:bg-accent-secondary/90 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Fetch
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Enter your Telegram media link
          </p>
        </form>
      </CpCard>
    </div>
  );
}
