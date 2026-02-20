import { apiPublic, api } from "./axios";

export const login = (credentials) =>
  apiPublic.post("/user/login", credentials);

export const register = (formData) => apiPublic.post("/user/register", formData);

export const forgotPassword = (email) =>
  apiPublic.post("/user/forgot-password", { email });

export const verifyForgotPassword = (otp, code) =>
  apiPublic.post("/user/verify-forgot-password", { otp, code });

export const newPassword = (code, password) =>
  apiPublic.post("/user/new-password", { code, password });

export const logout = () => api.get("/user/logout");

export const socialLogin = (data) => apiPublic.post("/user/social", data);
