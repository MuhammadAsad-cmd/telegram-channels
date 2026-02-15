"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfile } from "@/lib/api/userService";
import { logout as logoutApi } from "@/lib/api/authService";
import { setAuthCookie, getAuthCookie, clearAuthCookie } from "@/lib/cookies";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore errors - we're logging out anyway
    } finally {
      clearAuthCookie();
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = useCallback((newToken, newUser) => {
    setAuthCookie(newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const storedToken = getAuthCookie();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await getProfile();
        if (data?.result && data?.data) {
          setToken(storedToken);
          setUser(data.data);
        } else {
          clearAuthCookie();
        }
      } catch {
        clearAuthCookie();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
