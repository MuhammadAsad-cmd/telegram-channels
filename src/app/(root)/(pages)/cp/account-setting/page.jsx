"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Mail, Lock, ImagePlus, Loader2 } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";
import { ProfileSkeleton } from "@/components/UI/Skeleton";
import { useProfile, useUpdateUser } from "@/hooks/useAuth";

export default function AccountSettingPage() {
  const { profile, isLoading, error: profileError, refetch } = useProfile();
  const { handleUpdateUser, isLoading: updateIsLoading, error: updateError } = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name ?? "",
        email: profile.email ?? "",
      }));
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) {
      data.append("password", formData.password);
    }
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    await handleUpdateUser(data);
    refetch();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, image: file ?? null }));
  };

  const handleDelete = () => {
    console.log("Delete account");
  };

  const errorMessage = updateError;
  const passwordsMatch = formData.password === formData.confirmPassword || !formData.password;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Account Setting</h1>
        </div>
        <CpCard className="p-6">
          <ProfileSkeleton />
        </CpCard>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Account Setting</h1>
        </div>
        <CpCard className="p-6">
          <p className="text-accent-red">Failed to load profile. Please try again.</p>
        </CpCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Account Setting</h1>
      </div>

      <CpCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              {profile?.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-800 font-medium mb-2">Profile Image</label>
              <label className="flex items-center gap-2 cursor-pointer w-full shrink-0">
                <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent-primary transition-colors bg-white">
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-sm text-gray-600">
                  {formData.image ? formData.image.name : "Choose new image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Password</label>
            <p className="text-gray-500 text-sm mb-2">
              Leave it empty if you don&apos;t want to change it.
            </p>
            <div className="relative mb-3">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateIsLoading || !passwordsMatch}
            className="flex items-center gap-2 px-6 py-3 bg-accent-secondary hover:bg-accent-secondary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            {updateIsLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </CpCard>

      <CpCard className="p-6 border-accent-red/20">
        <h3 className="font-semibold text-gray-800 mb-2">Delete your account</h3>
        <p className="text-gray-600 text-sm mb-4">
          If you want to delete all your data permanently from our website you can press the button
          below. Once you delete your account, the account can not be recovered at all.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          className="px-6 py-3 bg-accent-red hover:bg-accent-red/90 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Delete
        </button>
      </CpCard>
    </div>
  );
}
