"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

const BACKEND_ERROR_MESSAGES = {
  "Email already associated with another account":
    "This email is already registered with a password. Please sign in with your email and password instead, or use a different Google account.",
};

/**
 * Syncs NextAuth session (Google sign-in) with AuthContext so the backend token
 * is stored in cookies and used by the existing API client.
 */
export default function GoogleAuthBridge() {
  const { data: session, status } = useSession();
  const { isAuthenticated, login } = useAuthContext();
  const errorHandledRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session) {
      errorHandledRef.current = false;
      return;
    }

    if (session.backendError) {
      if (errorHandledRef.current) return;
      errorHandledRef.current = true;
      const message =
        BACKEND_ERROR_MESSAGES[session.backendError] || session.backendError;
      toast.error(message);
      signOut({ callbackUrl: "/login" });
      return;
    }

    if (!session?.backendToken || !session?.backendUser) return;
    if (isAuthenticated) return;

    login(session.backendToken, session.backendUser);
  }, [status, session, isAuthenticated, login]);

  return null;
}
