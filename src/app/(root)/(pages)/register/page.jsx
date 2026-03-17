"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ImagePlus, Loader2 } from "lucide-react";
import GoogleButton from "@/components/Auth/GoogleButton";
import FormInput from "@/components/Auth/FormInput";
import AuthCard from "@/components/Auth/AuthCard";
import Divider from "@/components/Auth/Divider";
import { useRegister } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
    agreeToPolicy: false,
  });

  const { handleRegister, isLoading, error } = useRegister();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.files?.[0] ?? null,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    if (!formData.agreeToPolicy) {
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    handleRegister(data);
  };

  const handleGoogleSignIn = () => signIn("google", { callbackUrl: "/" });

  const errorMessage = error;
  const passwordsMatch = formData.password === formData.confirmPassword || !formData.confirmPassword;
  const agreedToPolicy = formData.agreeToPolicy;

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

          {formData.password && formData.confirmPassword && !passwordsMatch && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              Passwords do not match
            </div>
          )}

          {!agreedToPolicy && (formData.name || formData.email) && (
            <div className="p-3 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20 text-amber-700 text-sm">
              Please agree to the Terms & Privacy Policy
            </div>
          )}

          <FormInput
            type="text"
            name="name"
            placeholder="Full Name"
            icon={User}
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-gray-600 text-sm mb-2">Profile Image (optional)</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent-primary transition-colors bg-white">
                <ImagePlus className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-sm text-gray-600">
                {formData.image ? formData.image.name : "Choose image"}
              </span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeToPolicy"
              name="agreeToPolicy"
              checked={formData.agreeToPolicy}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 text-accent-primary border-gray-300 rounded focus:ring-accent-primary cursor-pointer"
            />
            <label htmlFor="agreeToPolicy" className="text-gray-600 text-sm cursor-pointer">
              I agree to the{" "}
              <Link href="/terms-of-service" className="text-accent-primary hover:underline">
                Terms of Service
              </Link>{" "}
              &{" "}
              <Link href="/privacy-policy" className="text-accent-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !passwordsMatch ||
              !agreedToPolicy
            }
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
