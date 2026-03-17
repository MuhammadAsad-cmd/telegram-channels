import { apiPublic } from "./axios";

/** GET /blog/fetch — returns all blogs */
export const fetchBlogs = () => apiPublic.get("/blog/fetch");

/** GET /blog/fetch?slug=xxx — returns single blog by slug */
export const fetchBlogBySlug = (slug) =>
  apiPublic.get(`/blog/fetch?slug=${encodeURIComponent(slug)}`);
