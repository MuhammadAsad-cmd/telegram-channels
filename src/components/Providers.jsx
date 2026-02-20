"use client";

import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAuthBridge from "@/components/Auth/GoogleAuthBridge";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <GoogleAuthBridge />
        {children}
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </AuthProvider>
    </SessionProvider>
  );
}
