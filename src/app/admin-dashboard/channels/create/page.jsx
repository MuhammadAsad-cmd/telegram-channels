"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Users, X, Radio } from "lucide-react";
import { toast } from "sonner";
import { fetchChannelInfo } from "@/lib/api/channelService";
import { adminCreateChannel, adminFetchCategories } from "@/lib/api/adminService";
import AdminSearchableSelect from "@/components/Admin/AdminSearchableSelect";
import Image from "next/image";

function formatMemberCount(count) {
  if (count == null || count === 0) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
}

export default function AdminChannelCreatePage() {
  const [mediaLink, setMediaLink] = useState("");
  const [channelInfo, setChannelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState([]);
  const [longDescription, setLongDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    adminFetchCategories()
      .then((res) => {
        const list = res.data?.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c._id, label: c.title })),
    [categories],
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
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to fetch channel info";
      toast.error(msg);
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
        memberCount: channelInfo.memberCount ?? 0,
        category,
        hashtags: hashtags.length > 0 ? hashtags : ["general"],
      };
      await adminCreateChannel(payload);
      toast.success("Channel created successfully");
      router.push("/admin-dashboard/channels");
    } catch (err) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create channel";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-secondary-dark rounded-2xl border border-white/6 p-6">
          <div className="h-6 w-32 bg-white/5 rounded-lg animate-pulse mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="bg-secondary-dark rounded-2xl border border-white/6 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <h3 className="font-semibold text-amber-200 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Note
        </h3>
        <ol className="text-sm space-y-2 list-decimal list-inside text-amber-100/90">
          <li>
            Do not add <strong>spam, scam, violence or pornographic</strong> content.
          </li>
          <li>
            Media containing <strong>illegal content</strong> will be{" "}
            <strong>REJECTED or DEACTIVATED</strong>.
          </li>
          <li>
            Make sure your media has proper <span className="text-amber-200 font-medium">language</span> and{" "}
            <span className="text-amber-200 font-medium">Translations</span> settings.
          </li>
          <li>
            Do not change the media username after adding.
          </li>
          <li>
            Set a proper photo for your media.
          </li>
        </ol>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          channelInfo ? handleAdd(e) : handleFetch(e);
        }}
        className="space-y-6"
      >
        <div className="bg-secondary-dark rounded-2xl border border-white/6 p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Media&apos;s Link</h2>
          <div className="space-y-3">
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  value={mediaLink}
                  onChange={(e) => setMediaLink(e.target.value)}
                  placeholder="https://t.me/dailychannels or username"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleFetch}
                disabled={isLoading}
                className="px-6 py-3 bg-accent-secondary hover:bg-accent-secondary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shrink-0 flex items-center justify-center gap-2"
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
            <p className="text-sm text-text-muted">Enter your Telegram media link</p>
          </div>

          {channelInfo && (
            <>
              <div className="mt-6 flex gap-4 items-center p-4 bg-white/5 rounded-xl border border-white/6">
                {channelInfo.photo ? (
                  <Image
                    width={56}
                    height={56}
                    unoptimized
                    src={channelInfo.photo}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Radio className="w-7 h-7 text-text-muted/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-text-primary truncate">{channelInfo.title}</h4>
                  <p className="text-sm text-text-muted">
                    {formatMemberCount(channelInfo.memberCount)} members
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Media Name</label>
                  <input
                    type="text"
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value.slice(0, 45))}
                    maxLength={45}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
                    placeholder="Media name"
                  />
                  <p className="text-xs text-text-muted mt-1">Keep it less than 45 characters.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Short Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 resize-none"
                    placeholder="Describe your media..."
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Write 150–170 characters for Google search descriptions.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Tags</label>
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
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50"
                    placeholder="Type a tag and press Enter to add"
                  />
                  {tagList.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tagList.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/15 text-accent-primary rounded-full text-sm font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setTagList((prev) => prev.filter((t) => t !== tag))}
                            className="p-0.5 hover:bg-accent-primary/20 rounded-full cursor-pointer"
                            aria-label={`Remove ${tag}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-text-muted mt-2">
                    Type and press Enter to add. Use the five most related keywords.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">
                    Long Description <span className="text-text-muted/60 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-primary/50 resize-none"
                    placeholder="Detailed description..."
                  />
                  <p className="text-xs text-text-muted mt-1">
                    A description of at least 300 words for better Google search visibility.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">Categories</label>
                  <AdminSearchableSelect
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select category"
                    searchPlaceholder="Search..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
        </div>
      </form>
    </div>
  );
}
