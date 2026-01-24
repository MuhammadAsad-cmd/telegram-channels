"use client";

export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      {children}
    </div>
  );
}
