"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import Modal from "./Modal";
import SelectDropdown from "../UI/SelectDropdown";
import { categories } from "@/data/categories";
import { getCountryOptions, languageOptions } from "@/lib/countryData";

function FlagEmoji({ code, className = "" }) {
  if (!code) return null;
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return <span className={`text-lg ${className}`}>{String.fromCodePoint(...codePoints)}</span>;
}

function FlagOption({ label, code }) {
  return (
    <span className="flex items-center gap-2">
      <FlagEmoji code={code} />
      <span>{label}</span>
    </span>
  );
}

export default function AddLinkModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    link: "",
    category: "other",
    language: "en",
    country: "PK",
  });

  const countryOptions = useMemo(() => getCountryOptions(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Link of the Media:
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://t.me/dailychannels"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              the link of the channel, group, bot or sticker
            </p>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Category</label>
            <SelectDropdown
              options={categories}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Select category"
              searchable
              searchPlaceholder="Search categories..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-800 font-medium mb-2">Language</label>
            <SelectDropdown
              options={languageOptions}
              value={formData.language}
              onChange={(value) => setFormData({ ...formData, language: value })}
              placeholder="Select language"
              searchable
              searchPlaceholder="Search languages..."
              renderOption={(option) => <FlagOption label={option.label} code={option.code} />}
              renderValue={(option) => <FlagOption label={option.label} code={option.code} />}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Country</label>
            <SelectDropdown
              options={countryOptions}
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value })}
              placeholder="Select country"
              searchable
              searchPlaceholder="Search countries..."
              maxHeight="200px"
              renderOption={(option) => <FlagOption label={option.label} code={option.code} />}
              renderValue={(option) => <FlagOption label={option.label} code={option.code} />}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 text-accent-primary bg-accent-primary/5 rounded-lg p-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            if you want to{" "}
            <Link href="#" className="underline font-medium hover:no-underline">
              feature your channel
            </Link>{" "}
            or run an{" "}
            <Link href="#" className="underline font-medium hover:no-underline">
              ad campaign
            </Link>{" "}
            for it, login and continue from your panel.
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          Your media <span className="font-semibold">will be reviewed</span> and listed if
          suitable for our directory.
        </p>

        <button
          type="submit"
          className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-medium py-3 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
}
