import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard - Telegram Channels",
  description: "Admin management panel",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
