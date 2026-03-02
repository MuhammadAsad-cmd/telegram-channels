"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Loader2 } from "lucide-react";
import GoogleButton from "@/components/Auth/GoogleButton";
import FormInput from "@/components/Auth/FormInput";
import AuthCard from "@/components/Auth/AuthCard";
import Divider from "@/components/Auth/Divider";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { handleLogin, isLoading, error } = useLogin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/" });

  const errorMessage = error;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
      <AuthCard>
        <GoogleButton text="Sign in with Google" onClick={handleGoogleSignIn} />

        <Divider />

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
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-accent-primary border-gray-300 rounded focus:ring-accent-primary cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-gray-600 text-sm cursor-pointer">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/forgot-password"
            className="text-accent-primary hover:underline text-sm"
          >
            Forgot Your Password?
          </Link>
        </div>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent-primary hover:underline font-medium">
            Register
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
