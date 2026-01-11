
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import { useEffect, useState } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  
  const admin = JSON.parse(
    localStorage.getItem("admin") || 
    sessionStorage.getItem("admin") || 
    "null"
  );
  
  

  useEffect(() => {
    // console.log("Admin useEffect running");
    setLoading(false);
    
    
    const interval = setInterval(() => {
      const currentAdmin = JSON.parse(
        localStorage.getItem("admin") || 
        sessionStorage.getItem("admin") || 
        "null"
      );
      if (!currentAdmin?.token) {
        console.log("Periodic check: No admin token, redirecting");
        navigate("/admin/login", { replace: true });
      }
    }, 60000);
    
    return () => {
      
      clearInterval(interval);
    };
  }, [navigate]);

 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c1bd3f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

 
  if (!admin?.token) {
   
    return <Navigate to="/admin/login" replace />;
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex-1 overflow-auto">
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
                // Clear BOTH storage locations
                localStorage.removeItem("admin");
                localStorage.removeItem("adminToken");
                sessionStorage.removeItem("admin");
                sessionStorage.removeItem("adminToken");
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