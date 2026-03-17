const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://telegram-server-tau.vercel.app/api";

export async function generateMetadata({ params }) {
  const resolved = await params;
  const slug = resolved?.slug;
  if (!slug) return { title: "Blog | Telegram Channels" };

  try {
    const res = await fetch(`${BASE_URL}/blog/fetch?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    const blog = json?.data?.[0];
    if (!blog) return { title: "Blog Not Found | Telegram Channels" };

    const description =
      blog.content?.replace(/<[^>]*>/g, "").trim().slice(0, 160) || blog.title;

    return {
      title: `${blog.title} | Telegram Channels Blog`,
      description,
    };
  } catch {
    return { title: "Blog | Telegram Channels" };
  }
}

export default function BlogSlugLayout({ children }) {
  return children;
}
