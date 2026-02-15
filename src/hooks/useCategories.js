"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCategories } from "@/lib/api/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fetchCategories();
      if (data?.result && Array.isArray(data?.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, isLoading, error, refetch: loadCategories };
}
