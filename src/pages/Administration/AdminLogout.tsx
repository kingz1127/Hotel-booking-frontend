// src/components/LogoutModal.jsx
import { X } from "lucide-react";

export default function AdminLogout({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Logout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 font-medium">⚠️ You're about to log out</p>
              <p className="text-red-600 text-sm mt-1">
                You'll need to enter your verification code again to log back in.
              </p>
            </div>
            
            <p className="text-gray-600">
              Are you sure you want to log out from the admin dashboard?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}