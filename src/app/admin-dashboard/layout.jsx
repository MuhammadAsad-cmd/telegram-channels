import AdminLayoutClient from "./AdminLayoutClient";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata = {
  title: "Admin Dashboard - Telegram Channels",
  description: "Admin management panel",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminAuthProvider>
  );
}
