"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchUserChannels } from "@/lib/api/channelService";
import { useAuthContext } from "@/context/AuthContext";

export function useUserChannels(initialParams = {}) {
  const { isAuthenticated } = useAuthContext();
  const [channels, setChannels] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const loadChannels = useCallback(async (fetchParams) => {
    const mergedParams = fetchParams ? { ...params, ...fetchParams } : { ...params };
    if (fetchParams) setParams(mergedParams);
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fetchUserChannels(mergedParams);
      if (data?.result && Array.isArray(data?.data)) {
        setChannels(data.data);
        setPagination(data?.pagination ?? null);
      } else {
        setChannels([]);
        setPagination(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load channels");
      setChannels([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (isAuthenticated) {
      loadChannels(initialParams);
    } else {
      setChannels([]);
      setPagination(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const updateFilters = useCallback((newParams) => {
    loadChannels(newParams);
  }, [loadChannels]);

  return {
    channels,
    pagination,
    isLoading,
    error,
    params,
    loadChannels,
    updateFilters,
  };
}
