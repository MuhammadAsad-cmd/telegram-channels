"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchChannels } from "@/lib/api/channelService";

export function useChannels(initialParams = {}) {
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
      const { data } = await fetchChannels(mergedParams);
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
    loadChannels(initialParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
