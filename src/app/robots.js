const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://telegram-channels-net.vercel.app/";

/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cp/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
