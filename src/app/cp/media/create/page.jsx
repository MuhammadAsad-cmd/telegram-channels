"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Users, X } from "lucide-react";
import { toast } from "sonner";
import CpCard from "@/components/Cp/CpCard";
import SelectDropdown from "@/components/UI/SelectDropdown";
import { FormSkeleton, Skeleton } from "@/components/UI/Skeleton";
import { fetchChannelInfo, createChannel } from "@/lib/api/channelService";
import { useCategories } from "@/hooks/useCategories";
import { languageOptions } from "@/lib/countryData";
import { getCountryOptions } from "@/lib/countryData";
import Link from "next/link";
import Image from "next/image";

export default function CpMediaCreatePage() {
  const [mediaLink, setMediaLink] = useState("");
  const [channelInfo, setChannelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState([]);
  const [longDescription, setLongDescription] = useState("");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("PK");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const countryOptions = useMemo(() => getCountryOptions(), []);

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ value: c._id, label: c.title })),
    [categories]
  );

  const languageOptionsWithFlag = useMemo(
    () =>
      languageOptions.map((l) => ({
        value: l.value,
        label: `${l.code} ${l.label}`,
      })),
    []
  );

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!mediaLink.trim()) return;
    setIsLoading(true);
    setChannelInfo(null);
    try {
      let link = mediaLink.trim();
      if (link && !/^https?:\/\//i.test(link)) {
        link = link.startsWith("t.me/") ? `https://${link}` : `https://t.me/${link.replace(/^@/, "")}`;
      }
      const { data } = await fetchChannelInfo(link);
      if (data?.result && data?.data) {
        const info = data.data;
        setChannelInfo(info);
        setMediaName((info.title ?? "").slice(0, 45));
        setShortDescription(info.description ?? "");
        setLongDescription(info.description ?? "");
        toast.success(data?.message ?? "Channel info fetched successfully");
      } else {
        toast.error(data?.message ?? "Failed to fetch channel info");
      }
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? "Failed to fetch channel info";
      toast.error(message);
      setChannelInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!channelInfo || !category) {
      toast.error("Please select a category");
      return;
    }
    setIsSubmitting(true);
    try {
      const hashtags = tagList.length > 0 ? tagList : ["general"];

      const payload = {
        telegramId: channelInfo.telegramId,
        title: mediaName || channelInfo.title,
        username: channelInfo.username,
        description: shortDescription,
        longDescription: longDescription || shortDescription,
        photo: channelInfo.photo,
        inviteLink: channelInfo.inviteLink,
        memberCount: channelInfo.memberCount,
        category,
        hashtags: hashtags.length > 0 ? hashtags : ["general"],
      };

      const { data } = await createChannel(payload);
      if (data?.result && data?.data) {
        toast.success(data?.message ?? "Channel created successfully");
        router.push("/cp/media");
      } else {
        toast.error(data?.message ?? "Failed to create channel");
      }
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? "Failed to create channel";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMemberCount = (count) => {
    if (count == null || count === 0) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  if (categoriesLoading) {
    return (
      <div className="space-y-6">
        <CpCard className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CpCard>
        <CpCard className="p-6">
          <FormSkeleton />
        </CpCard>
      </div>
    );
  }

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
          <li>
            Do not change the media username after adding.
          </li>
          <li>
            Set a proper photo for your media.
          </li>
        </ol>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); channelInfo ? handleAdd(e) : handleFetch(e); }} className="space-y-6">
        <CpCard className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Media&apos;s Link</h2>
          <div className="space-y-3">
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={mediaLink}
                  onChange={(e) => setMediaLink(e.target.value)}
                  placeholder="https://t.me/dailychannels or username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleFetch}
                disabled={isLoading}
                className="px-6 py-3 bg-accent-secondary hover:bg-accent-secondary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500">Enter your Telegram media link</p>
          </div>

          {channelInfo && (
            <>
              <div className="mt-6 flex gap-4 items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white">
                {channelInfo.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image
                    width={56}
                    height={56}
                    unoptimized
                    src={channelInfo.photo}
                    alt={channelInfo.title ?? "Channel"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{channelInfo.title}</h4>
                  <p className="text-sm text-gray-600">
                    {formatMemberCount(channelInfo.memberCount)} members
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Media Name</label>
                  <input
                    type="text"
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value.slice(0, 45))}
                    maxLength={45}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                    placeholder="Media name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Keep it less than 45 characters.</p>
                </div>

                {/* <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="nsfw"
                    checked={nsfw}
                    onChange={(e) => setNsfw(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                  />
                  <label htmlFor="nsfw" className="text-sm text-gray-700 cursor-pointer">
                    NSFW (This media is not safe for work/family and may include adults content.)
                  </label>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary resize-y"
                    placeholder="Describe your media..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Write 150–170 characters for Google search descriptions.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = tagInput.trim().toLowerCase();
                        if (value && !tagList.includes(value)) {
                          setTagList((prev) => [...prev, value]);
                          setTagInput("");
                        }
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
                    placeholder="Type a tag and press Enter to add"
                  />
                  {tagList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tagList.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setTagList((prev) => prev.filter((t) => t !== tag))}
                            className="p-0.5 cursor-pointer hover:bg-accent-primary/20 rounded-full transition-colors"
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Type and press Enter to add. Use the five most related keywords.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary resize-y"
                    placeholder="Detailed description..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A description of at least 300 words for better Google search visibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <SelectDropdown
                      options={languageOptionsWithFlag}
                      value={language}
                      onChange={setLanguage}
                      placeholder="Select language"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <Link href="#" className="text-accent-primary hover:underline">Help us to add your language here! TRANSLATIONS</Link>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <SelectDropdown
                      options={countryOptions}
                      value={country}
                      onChange={setCountry}
                      placeholder="Select country"
                      searchable
                      searchPlaceholder="Search country..."
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                    <SelectDropdown
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                      placeholder="Select category"
                      searchable
                      searchPlaceholder="Search..."
                    />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">Feature This Media</p>
                    <p className="text-sm text-gray-600 mt-0.5">Featured this media for a month $20</p>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                      <li>Displayed on main page of its language</li>
                      <li>Beginning of its category</li>
                      <li>Related channels section</li>
                      <li>Top of search page</li>
                      <li>Eye-catching featured badge</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={featured}
                    onClick={() => setFeatured((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
                      featured ? "bg-accent-primary" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                        featured ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div> */}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "ADD"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </CpCard>
      </form>
    </div>
  );
}
