"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import {
  login as loginApi,
  register as registerApi,
  forgotPassword as forgotPasswordApi,
  verifyForgotPassword as verifyForgotPasswordApi,
  newPassword as newPasswordApi,
} from "@/lib/api/authService";
import { getProfile, updateUser as updateUserApi } from "@/lib/api/userService";

function getErrorMessage(error) {
  return error?.response?.data?.message ?? error?.message ?? "Something went wrong";
}

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = useCallback(
    async (credentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await loginApi(credentials);
        const { token, data } = response.data ?? {};
        if (token && data) {
          login(token, data);
          toast.success("Successfully logged in");
          const returnTo =
            typeof window !== "undefined"
              ? new URLSearchParams(window.location.search).get("returnTo")
              : null;
          router.push(returnTo || "/cp");
        }
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [login, router],
  );

  return { handleLogin, isLoading, error };
}

export function useRegister() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = useCallback(
    async (formData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await registerApi(formData);
        const { token, data } = response.data ?? {};
        if (token && data) {
          login(token, data);
          toast.success("Successfully registered");
          router.push("/cp");
        } else {
          toast.success("Successfully registered. Please log in.");
          router.push("/login");
        }
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [login, router],
  );

  return { handleRegister, isLoading, error };
}

export function useForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleForgotPassword = useCallback(
    async (email) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await forgotPasswordApi(email);
        const code = response.data?.code;
        if (code && typeof window !== "undefined") {
          sessionStorage.setItem("forgot_password_code", code);
          toast.success("OTP sent to your email");
          router.push("/forgot-password/verify");
        }
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { handleForgotPassword, isLoading, error };
}

export function useVerifyForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = useCallback(
    async ({ otp, code }) => {
      setIsLoading(true);
      setError(null);
      try {
        await verifyForgotPasswordApi(otp, code);
        toast.success("OTP verified");
        router.push("/forgot-password/new");
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { handleVerify, isLoading, error };
}

export function useNewPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNewPassword = useCallback(
    async ({ code, password }) => {
      setIsLoading(true);
      setError(null);
      try {
        await newPasswordApi(code, password);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("forgot_password_code");
        }
        toast.success("Password updated. Please log in.");
        router.push("/login");
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { handleNewPassword, isLoading, error };
}

export function useProfile() {
  const { isAuthenticated } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getProfile();
      if (data?.result && data?.data) {
        setProfile(data.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    refetch();
  }, [isAuthenticated, refetch]);

  return { profile, isLoading, error, refetch };
}

export function useUpdateUser() {
  const { updateUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateUser = useCallback(
    async (formData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateUserApi(formData);
        const userData = response.data?.data;
        if (userData) {
          updateUser(userData);
          toast.success("Profile updated successfully");
        }
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [updateUser],
  );

  return { handleUpdateUser, isLoading, error };
}
