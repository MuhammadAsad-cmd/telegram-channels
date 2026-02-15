"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import AuthCard from "@/components/Auth/AuthCard";
import { useVerifyForgotPassword } from "@/hooks/useAuth";

export default function VerifyForgotPasswordPage() {
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState(null);

  const { handleVerify, isLoading, error } = useVerifyForgotPassword();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCode = sessionStorage.getItem("forgot_password_code");
      setCode(storedCode);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code && otp) {
      handleVerify({ otp, code });
    }
  };

  const errorMessage = error;

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
            No verification session found. Please request a new OTP.
          </p>
          <Link
            href="/forgot-password"
            className="block w-full text-center py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Back to Forgot Password
          </Link>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
      <AuthCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter the OTP sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              {errorMessage}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
            required
          />

          <button
            type="submit"
            disabled={isLoading || otp.length < 4}
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/forgot-password" className="text-accent-primary hover:underline text-sm">
            Request new OTP
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
