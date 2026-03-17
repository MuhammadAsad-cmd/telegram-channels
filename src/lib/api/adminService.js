import { apiPublic } from "./axios";
import { getAdminCookie, clearAdminCookie } from "@/lib/cookies";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://telegram-server-tau.vercel.app/api";

// Admin API instance (uses admin_token; 401/403 → redirect to admin login)
const apiAdmin = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiAdmin.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  if (typeof window !== "undefined") {
    const token = getAdminCookie();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiAdmin.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      clearAdminCookie();
      window.location.href = "/admin-dashboard/login";
    }
    return Promise.reject(err);
  }
);

/** POST /admin/login — body: { email, password } — returns { data: { token, ... } } */
export const adminLogin = (payload) =>
  apiPublic.post("/admin/login", { email: payload.email, password: payload.password });

// ── Stats ────────────────────────────────────────────────────────────────────
/** GET /admin/stats — returns users, channels, categories, sessions stats */
export const adminFetchStats = () => apiAdmin.get("/admin/stats");

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
export const adminFetchCategories = () => apiAdmin.get("/category/fetch");

/** POST /category/create — body: { title } */
export const adminCreateCategory = (payload) =>
  apiAdmin.post("/category/create", { title: payload.title });

/** PUT /category/update/:id — body: { title } */
export const adminUpdateCategory = (id, payload) =>
  apiAdmin.put(`/category/update/${id}`, { title: payload.title });

/** DELETE /category/remove/:id */
export const adminDeleteCategory = (id) => apiAdmin.delete(`/category/remove/${id}`);

// ── Channels ──────────────────────────────────────────────────────────────────
/** GET /channel/fetch — query: page, limit, status?, search? — returns { data, pagination } */
export const adminFetchChannels = (params = {}) => {
  const query = buildQueryString(params);
  return apiAdmin.get(`/channel/fetch${query ? `?${query}` : ""}`);
};

/** GET /channel/fetch?slug=… — returns full channel by slug (any status) */
export const adminFetchChannelBySlug = (slug) =>
  apiAdmin.get(`/channel/fetch?slug=${encodeURIComponent(slug)}`);

/** POST /channel/create — body: telegramId, title, username, description, longDescription, photo, inviteLink, memberCount, category, hashtags */
export const adminCreateChannel = (payload) =>
  apiAdmin.post("/channel/create", payload);

/** POST /channel/update/:id — body: { status } — enum: pending | approved | cancelled */
export const adminUpdateChannelStatus = (id, status) =>
  apiAdmin.put(`/channel/update/${id}`, { status });

/** DELETE /channel/remove/:id */
export const adminDeleteChannel = (id) => apiAdmin.delete(`/channel/remove/${id}`);

// ── Users ────────────────────────────────────────────────────────────────────
/** GET /user/fetch — returns { result, message, data: User[] } */
export const adminFetchUsers = () => apiAdmin.get("/user/fetch");

// ── Admins ───────────────────────────────────────────────────────────────────
/** GET /admin/fetch — returns { result, message, data: Admin[] } */
export const adminFetchAdmins = () => apiAdmin.get("/admin/fetch");

/** POST /admin/register — form-data: email, name, password, image (file) */
export const adminRegister = (formData) => apiAdmin.post("/admin/register", formData);

/** POST /admin/change-password — body: { currentPassword, newPassword } — changes own password */
export const adminChangePassword = (payload) =>
  apiAdmin.post("/admin/change-password", {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });

/** POST /admin/change-password — body: { adminId?, currentPassword, newPassword } — changes admin password (Bearer token required) */
export const adminChangeAdminPassword = (adminId, payload) =>
  apiAdmin.post("/admin/change-password", {
    ...(adminId && { adminId }),
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });

// ── Crypto Payment Methods ───────────────────────────────────────────────────
/** GET /crypto/fetch — returns { result, message, data: CryptoPayment[] } */
export const adminFetchCrypto = () => apiAdmin.get("/crypto/fetch");

/** POST /crypto/create — form-data: title, description, paymentId, paymentImage (file) */
export const adminCreateCrypto = (formData) =>
  apiAdmin.post("/crypto/create", formData);

/** PUT /crypto/update/:id — form-data: title, description, paymentId, paymentImage (file, optional) */
export const adminUpdateCrypto = (id, formData) =>
  apiAdmin.put(`/crypto/update/${id}`, formData);

/** DELETE /crypto/remove/:id */
export const adminRemoveCrypto = (id) => apiAdmin.delete(`/crypto/remove/${id}`);

// ── Deposit Requests ─────────────────────────────────────────────────────────
/** GET /request/fetch — optional query: id (single request) — returns { result, message, data } */
export const adminFetchRequests = (params = {}) => {
  const query = buildQueryString(params);
  return apiAdmin.get(`/request/fetch${query ? `?${query}` : ""}`);
};

/** PUT /request/approve/:id */
export const adminApproveRequest = (id) => apiAdmin.put(`/request/approve/${id}`);

/** PUT /request/cancel/:id */
export const adminCancelRequest = (id) => apiAdmin.put(`/request/cancel/${id}`);

/** DELETE /request/remove/:id */
export const adminRemoveRequest = (id) => apiAdmin.delete(`/request/remove/${id}`);

// ── Invoices ─────────────────────────────────────────────────────────────────
/** GET /invoice/fetch — optional query: id (single invoice) — returns { result, message, data } */
export const adminFetchInvoices = (params = {}) => {
  const query = buildQueryString(params);
  return apiAdmin.get(`/invoice/fetch${query ? `?${query}` : ""}`);
};

// ── Contacts ─────────────────────────────────────────────────────────────────
/** GET /contact/fetch — optional ?id=xxx for single contact — returns { result, message, data } */
export const adminFetchContacts = (params = {}) => {
  const query = buildQueryString(params);
  return apiAdmin.get(`/contact/fetch${query ? `?${query}` : ""}`);
};

/** PUT /contact/update/:id — body: { subject?, ... } */
export const adminUpdateContact = (id, payload) =>
  apiAdmin.put(`/contact/update/${id}`, payload);

/** DELETE /contact/remove/:id */
export const adminRemoveContact = (id) => apiAdmin.delete(`/contact/remove/${id}`);

// ── Blogs ────────────────────────────────────────────────────────────────────
/** GET /blog/fetch — optional ?slug=xxx for single blog — returns { result, message, data } */
export const adminFetchBlogs = (params = {}) => {
  const query = buildQueryString(params);
  return apiAdmin.get(`/blog/fetch${query ? `?${query}` : ""}`);
};

/** POST /blog/create — form-data: title, content, image (file) */
export const adminCreateBlog = (formData) => apiAdmin.post("/blog/create", formData);

/** PUT /blog/update/:id — form-data: title?, content?, image? (file, optional) */
export const adminUpdateBlog = (id, formData) =>
  apiAdmin.put(`/blog/update/${id}`, formData);

/** DELETE /blog/remove/:id */
export const adminRemoveBlog = (id) => apiAdmin.delete(`/blog/remove/${id}`);
