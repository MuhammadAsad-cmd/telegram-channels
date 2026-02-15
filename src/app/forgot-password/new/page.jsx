"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import FormInput from "@/components/Auth/FormInput";
import AuthCard from "@/components/Auth/AuthCard";
import { useNewPassword } from "@/hooks/useAuth";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState(null);

  const { handleNewPassword, isLoading, error } = useNewPassword();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCode = sessionStorage.getItem("forgot_password_code");
      setCode(storedCode);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code && password && password === confirmPassword) {
      handleNewPassword({ code, password });
    }
  };

  const errorMessage = error;
  const passwordsMatch = password === confirmPassword || !confirmPassword;

  if (code === null) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
        <AuthCard>
          <p className="text-gray-600 text-sm mb-6">
            No verification session found. Please start the forgot password process again.
          </p>
          <Link
            href="/forgot-password"
            className="block w-full text-center py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Forgot Password
          </Link>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
      <AuthCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">New Password</h2>
        <p className="text-gray-600 text-sm mb-6">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              {errorMessage}
            </div>
          )}

          {password && confirmPassword && !passwordsMatch && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              Passwords do not match
            </div>
          )}

          <FormInput
            type="password"
            name="password"
            placeholder="New Password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={
              isLoading ||
              !passwordsMatch ||
              !password ||
              !confirmPassword
            }
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-accent-primary hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
