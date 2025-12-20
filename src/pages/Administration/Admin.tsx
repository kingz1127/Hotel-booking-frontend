// src/pages/Administration/Admin.jsx
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import { useEffect } from "react";

export default function Admin() {
  const navigate = useNavigate();
  
  // Check if admin is authenticated
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Optional: Add session timeout check
  useEffect(() => {
    const checkAuth = () => {
      if (!admin?.token && !user?.token) {
        navigate("/admin/login");
      }
    };

    // Check auth every minute
    const interval = setInterval(checkAuth, 60000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [admin, user, navigate]);

  // Redirect to login if not authenticated
  if (!admin?.token && !user?.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex-1 overflow-auto">
        {/* Optional: Add a header bar */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {admin?.fullName?.split(" ")[0] || "Admin"}!
            </h2>
            <p className="text-gray-500 text-sm">
              Last login: {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "Just now"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem("admin");
                localStorage.removeItem("adminToken");
                navigate("/admin/login");
              }}
              className="md:hidden px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}