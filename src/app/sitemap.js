const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://telegram-channels-net.vercel.app/";

/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const staticRoutes = [
    "",
    "/search",
    "/ranking",
    "/trending",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/search" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/search" ? 0.9 : 0.7,
  }));

  return staticRoutes;
}
