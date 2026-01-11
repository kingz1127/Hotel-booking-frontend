import { BiBook } from "react-icons/bi"; 
import { ImStatsBars2 } from "react-icons/im"; 

import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  Bed, 
  UserCog, 
  LogOut, 
  Settings,
  Shield,
  BarChart3
} from "lucide-react";
import { logoutAdmin } from "../../services/api.admin.js";
import { toast } from "react-toastify";
import AdminLogout from "./AdminLogout.js";
import { useState } from "react";

export default function AdminSideBar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogoutConfirm = () => {
    logoutAdmin();
    toast.success("Logged out successfully");
    setShowLogoutModal(false);
    navigate("/admin/login");
  };
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutAdmin();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    }
  };

  // Get admin info for display
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  return (
    <div className="w-64 bg-my-Bg text-white h-screen flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#c1bd3f] to-[#a8a535] rounded-xl flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm">Hotel Management</p>
          </div>
        </div>
        
        {/* Admin Info */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <p className="font-medium truncate">{admin.fullName || admin.email}</p>
          <p className="text-gray-400 text-sm">{admin.role || "Administrator"}</p>
        </div>
      </div>

      {/* Navigation Links - CHANGED TO ABSOLUTE PATHS */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Changed from: to="dashboard" to to="/admin/dashboard" */}
        <NavLink
  to="/admin/dashboard"
  onClick={(e) => {
    console.log("=== DASHBOARD NAVLINK CLICKED ===");
    console.log("Event:", e);
    console.log("Navigating to: /admin/dashboard");
    console.log("Current URL:", window.location.href);
  }}
  className={({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
      isActive 
        ? "bg-[#c1bd3f] text-white font-semibold" 
        : "hover:bg-gray-800"
    }`
  }
>
  <Home className="h-5 w-5" />
  Dashboard
</NavLink>

        {/* Changed from: to="customers" to to="/admin/customers" */}
        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <Users className="h-5 w-5" />
          Customers
        </NavLink>

        {/* Changed from: to="rooms" to to="/admin/rooms" */}
        <NavLink
          to="/admin/rooms"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <Bed className="h-5 w-5" />
          Rooms Management
        </NavLink>

         <NavLink
          to="/admin/roomstatus"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <ImStatsBars2 className="h-5 w-5" />
          Room Status
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <BiBook  className="h-5 w-5" />
          Bookings
        </NavLink>

        

        {/* Changed from: to="staffs" to to="/admin/staffs" */}
        <NavLink
          to="/admin/staffs"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <UserCog className="h-5 w-5" />
          Staff Management
        </NavLink>

        {/* Changed from: to="reports" to to="/admin/reports" */}
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <BarChart3 className="h-5 w-5" />
          Reports & Analytics
        </NavLink>

        {/* Changed from: to="settings" to to="/admin/settings" */}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-white font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
        >
          <Settings className="h-5 w-5" />
          Settings
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
        
        <div className="mt-3 text-center">
          <p className="text-gray-400 text-sm">
            Hotel Admin System v1.0
          </p>
        </div>
      </div>

      <AdminLogout
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

    </div>
  );
}