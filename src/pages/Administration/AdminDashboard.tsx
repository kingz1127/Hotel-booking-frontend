// src/pages/Administration/AdminDashboard.jsx
import { LogOut } from "lucide-react";
import { logoutAdmin } from "../../services/api.admin.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (window.confirm("Log out from admin dashboard?")) {
      logoutAdmin();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    }
  };

  return (
    <div className="p-6">
      {/* Header with logout button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your hotel operations</p>
        </div>
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
      
      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Your dashboard cards/content here */}
      </div>
    </div>
  );
}