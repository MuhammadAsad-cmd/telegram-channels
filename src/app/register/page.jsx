"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import GoogleButton from "@/components/Auth/GoogleButton";
import FormInput from "@/components/Auth/FormInput";
import AuthCard from "@/components/Auth/AuthCard";
import Divider from "@/components/Auth/Divider";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToPolicy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agreeToPolicy) {
      alert("Please agree to the Terms & Privacy Policy");
      return;
    }
    console.log("Register submitted:", formData);
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5ebef] flex items-center justify-center py-12 px-4">
      <AuthCard>
        <GoogleButton text="Sign up with Google" onClick={handleGoogleSignIn} />

        <Divider />

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Link href="/terms" className="text-accent-primary hover:underline">
                Terms of Service
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-accent-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-accent-primary hover:bg-accent-primary/90 text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            Register
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
