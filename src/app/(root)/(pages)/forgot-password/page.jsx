"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import FormInput from "@/components/Auth/FormInput";
import AuthCard from "@/components/Auth/AuthCard";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { handleForgotPassword, isLoading, error } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword(email);
  };

  const errorMessage = error;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
      <AuthCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter your email address and we&apos;ll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              {errorMessage}
            </div>
          )}

          <FormInput
            type="email"
            name="email"
            placeholder="E-Mail Address"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
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
