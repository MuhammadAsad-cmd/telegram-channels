"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { adminLogin as adminLoginApi } from "@/lib/api/adminService";
import { setAdminCookie, getAdminCookie, clearAdminCookie } from "@/lib/cookies";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token;

  const logout = useCallback(() => {
    clearAdminCookie();
    setToken(null);
    setAdmin(null);
  }, []);

  const login = useCallback((newToken, adminData = null) => {
    setAdminCookie(newToken);
    setToken(newToken);
    setAdmin(adminData ?? { email: "admin" });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    const storedToken = getAdminCookie();
    if (storedToken) {
      setToken(storedToken);
      setAdmin({ email: "admin" });
    }
    setIsLoading(false);
  }, []);

  const value = {
    admin,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    adminLoginApi,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuthContext() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuthContext must be used within AdminAuthProvider");
  }
  return context;
}
