import { api } from "./axios";

/** GET /package/fetch — returns { result, message, data: Package[] } */
export const fetchPackages = () => api.get("/package/fetch");

/** POST /activation-package/activate — body: { packageId } */
export const activatePackage = (payload) =>
  api.post("/activation-package/activate", payload);

/** GET /activation-package/current?userId=... — returns active package info */
export const fetchCurrentActivePackage = (userId) =>
  api.get(
    `/activation-package/current?userId=${encodeURIComponent(String(userId))}`,
  );

