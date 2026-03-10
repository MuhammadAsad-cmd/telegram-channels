import { api } from "./axios";

/** GET /crypto/fetch — list payment methods for deposit (user auth) */
export const fetchCrypto = () => api.get("/crypto/fetch");

/** POST /request/create — form-data: evidence (file), crypto (id), amount */
export const createRequest = (formData) => api.post("/request/create", formData);

/** GET /request/fetch?user=userId — list requests for the given user (user auth) */
export const fetchRequestsByUser = (userId) =>
  api.get(`/request/fetch?user=${encodeURIComponent(userId)}`);
