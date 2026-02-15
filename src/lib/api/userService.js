import { api } from "./axios";

export const getProfile = () => api.get("/user/profile");

export const updateUser = (formData) => api.put("/user/update", formData);
