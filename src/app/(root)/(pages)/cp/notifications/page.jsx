import { Bell } from "lucide-react";
import CpCard from "@/components/Cp/CpCard";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Notifications List</h1>
      </div>

      <CpCard className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            You don&apos;t have any notification!
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            When you receive notifications, they will appear here.
          </p>
        </div>
      </CpCard>
    </div>
  );
}
