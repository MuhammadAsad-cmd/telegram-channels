import { api } from "./axios";

// ── Stats ────────────────────────────────────────────────────────────────────
/** GET /admin/stats — returns users, channels, categories, sessions stats */
export const adminFetchStats = () => api.get("/admin/stats");

function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

// ── Categories ────────────────────────────────────────────────────────────────
/** GET /category/fetch — returns { result, message, data: Category[] } */
export const adminFetchCategories = () => api.get("/category/fetch");

/** POST /category/create — body: { title } */
export const adminCreateCategory = (payload) =>
  api.post("/category/create", { title: payload.title });

/** PUT /category/update/:id — body: { title } */
export const adminUpdateCategory = (id, payload) =>
  api.put(`/category/update/${id}`, { title: payload.title });

/** DELETE /category/remove/:id */
export const adminDeleteCategory = (id) => api.delete(`/category/remove/${id}`);

// ── Channels ──────────────────────────────────────────────────────────────────
/** GET /channel/fetch — query: page, limit, status?, search? — returns { data, pagination } */
export const adminFetchChannels = (params = {}) => {
  const query = buildQueryString(params);
  return api.get(`/channel/fetch${query ? `?${query}` : ""}`);
};

/** GET /channel/fetch?slug=… — returns full channel by slug (any status) */
export const adminFetchChannelBySlug = (slug) =>
  api.get(`/channel/fetch?slug=${encodeURIComponent(slug)}`);

/** POST /channel/create — body: telegramId, title, username, description, longDescription, photo, inviteLink, memberCount, category, hashtags */
export const adminCreateChannel = (payload) =>
  api.post("/channel/create", payload);

/** POST /channel/update/:id — body: { status } — enum: pending | approved | cancelled */
export const adminUpdateChannelStatus = (id, status) =>
  api.put(`/channel/update/${id}`, { status });

/** DELETE /channel/remove/:id */
export const adminDeleteChannel = (id) => api.delete(`/channel/remove/${id}`);

// ── Users ────────────────────────────────────────────────────────────────────
/** GET /user/fetch — returns { result, message, data: User[] } */
export const adminFetchUsers = () => api.get("/user/fetch");
