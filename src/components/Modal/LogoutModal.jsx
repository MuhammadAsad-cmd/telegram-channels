"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  const router = useRouter();

  const handleLogout = async () => {
    await onConfirm?.();
    onClose();
    router.push("/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="dark" size="sm">
      <div className="text-center py-4">
        <h3 className="text-xl font-semibold text-text-primary mb-2">Log out?</h3>
        <p className="text-text-muted text-sm mb-6">Are you sure you want to log out of your account?</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-white/6 rounded-lg text-text-primary font-medium hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-2.5 bg-accent-red hover:bg-accent-red/90 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </Modal>
  );
}
