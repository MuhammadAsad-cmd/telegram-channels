import { apiPublic, api } from "./axios";

function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

export const fetchChannels = (params = {}) => {
  const query = buildQueryString(params);
  return apiPublic.get(`/channel/fetch${query ? `?${query}` : ""}`);
};

export const fetchChannelBySlug = (slug) => {
  return apiPublic.get(`/channel/fetch?slug=${encodeURIComponent(slug)}`);
};

export const fetchUserChannels = (params = {}) => {
  const query = buildQueryString(params);
  return api.get(`/channel/fetch/user${query ? `?${query}` : ""}`);
};

export const fetchChannelInfo = (link) => {
  return api.post("/channel/info", { link });
};

export const createChannel = (payload) => {
  return api.post("/channel/create", payload);
};
