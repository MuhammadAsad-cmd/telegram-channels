"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </AuthProvider>
  );
}
