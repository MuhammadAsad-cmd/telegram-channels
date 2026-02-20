import axios from "axios";
import { getAuthCookie, clearAuthCookie } from "@/lib/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://telegram-server-tau.vercel.app/api";

const createApiInstance = (withAuth = false) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // When sending FormData, let the browser set Content-Type with boundary
  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  });

  if (withAuth) {
    instance.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = getAuthCookie();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if ((status === 401 || status === 403) && typeof window !== "undefined") {
          clearAuthCookie();
          const callbackUrl = `${window.location.origin}/login`;
          window.location.href = `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }
        return Promise.reject(error);
      },
    );
  }

  return instance;
};

export const apiPublic = createApiInstance(false);
export const api = createApiInstance(true);
