import { api } from "./axios";

/** GET /crypto/fetch — list payment methods for deposit (user auth) */
export const fetchCrypto = () => api.get("/crypto/fetch");

/** POST /request/create — form-data: evidence (file), crypto (id), amount */
export const createRequest = (formData) => api.post("/request/create", formData);
