"use client";

import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";

export default function AccountSettingPage() {
  const [formData, setFormData] = useState({
    fullName: "Muhammad Asad",
    email: "ma6530028@gmail.com",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update:", formData);
  };

  const handleDelete = () => {
    console.log("Delete account");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Account Setting</h1>
      </div>

      <CpCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
            <p className="text-gray-500 text-sm mb-2">Leave it empty if you don&apos;t want to change it.</p>
            <div className="relative mb-3">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="confirm password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-accent-secondary hover:bg-accent-secondary/90 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Update
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
