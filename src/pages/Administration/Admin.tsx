// // src/pages/Administration/Admin.jsx
// import { Outlet, Navigate, useNavigate } from "react-router-dom";
// import AdminSideBar from "./AdminSideBar";
// import { useEffect } from "react";

// export default function Admin() {
//   const navigate = useNavigate();
  
//   // Check if admin is authenticated
//   const admin = JSON.parse(localStorage.getItem("admin") || "null");
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   // Optional: Add session timeout check
//   useEffect(() => {
//     const checkAuth = () => {
//       if (!admin?.token && !user?.token) {
//         navigate("/admin/login");
//       }
//     };

//     // Check auth every minute
//     const interval = setInterval(checkAuth, 60000);
    
//     // Cleanup
//     return () => clearInterval(interval);
//   }, [admin, user, navigate]);

//   // Redirect to login if not authenticated
//   if (!admin?.token && !user?.token) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <AdminSideBar />
//       <div className="flex-1 overflow-auto">
//         {/* Optional: Add a header bar */}
//         <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               Welcome back, {admin?.fullName?.split(" ")[0] || "Admin"}!
//             </h2>
//             <p className="text-gray-500 text-sm">
//               Last login: {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "Just now"}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => {
//                 localStorage.removeItem("admin");
//                 localStorage.removeItem("adminToken");
//                 navigate("/admin/login");
//               }}
//               className="md:hidden px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//         <Outlet />
//       </div>
//     </div>
//   );
// }


// src/pages/Administration/Admin.jsx
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import { useEffect, useState } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Check if admin is authenticated - ONLY check admin (not user!)
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  
  console.log("=== ADMIN COMPONENT DEBUG ===");
  console.log("Admin from localStorage:", admin);
  console.log("Admin token exists?", !!admin?.token);

  useEffect(() => {
    // Small delay to ensure localStorage is properly read
    const timer = setTimeout(() => {
      setLoading(false);
      
      // ONLY check admin token (not user token)
      if (!admin?.token) {
        console.log("No admin token found, redirecting to login");
        navigate("/admin/login", { replace: true });
      }
    }, 100);
    
    // Optional: Periodic check (only for admin)
    const interval = setInterval(() => {
      const currentAdmin = JSON.parse(localStorage.getItem("admin") || "null");
      if (!currentAdmin?.token) {
        console.log("Periodic check: No admin token, redirecting");
        navigate("/admin/login", { replace: true });
      }
    }, 60000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [admin, navigate]);

  // Show loading while checking
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

  // Redirect to login if not authenticated as ADMIN (NOT checking user!)
  if (!admin?.token) {
    console.log("Redirect condition met: No admin token");
    return <Navigate to="/admin/login" replace />;
  }

  console.log("Rendering admin layout with Outlet");

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



// // src/pages/Administration/Admin.jsx
// import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
// import AdminSideBar from "./AdminSideBar";
// import { useEffect } from "react";

// export default function Admin() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Check if admin is authenticated - ONLY check admin
//   const admin = JSON.parse(localStorage.getItem("admin") || "null");
  
//   console.log("=== ADMIN COMPONENT DEBUG ===");
//   console.log("Admin from localStorage:", admin);
//   console.log("Admin token:", admin?.token);
//   console.log("Current pathname:", location.pathname);

//   // Redirect from /admin to /admin/dashboard
//   useEffect(() => {
//     if (location.pathname === "/admin") {
//       console.log("Redirecting /admin to /admin/dashboard");
//       navigate("/admin/dashboard", { replace: true });
//     }
//   }, [location, navigate]);

//   useEffect(() => {
//     const checkAuth = () => {
//       if (!admin?.token) {
//         console.log("No admin token, redirecting to login");
//         navigate("/admin/login");
//       }
//     };

//     // Initial check
//     checkAuth();
    
//     // Check auth every minute
//     const interval = setInterval(checkAuth, 60000);
    
//     // Cleanup
//     return () => clearInterval(interval);
//   }, [admin, navigate]);

//   // Redirect to login if not authenticated as ADMIN
//   if (!admin?.token) {
//     console.log("Redirecting to /admin/login - no admin token");
//     return <Navigate to="/admin/login" replace />;
//   }

//   console.log("Rendering admin layout with Outlet");

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <AdminSideBar />
//       <div className="flex-1 overflow-auto">
//         <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               Welcome back, {admin?.fullName?.split(" ")[0] || "Admin"}!
//             </h2>
//             <p className="text-gray-500 text-sm">
//               Last login: {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "Just now"}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => {
//                 localStorage.removeItem("admin");
//                 localStorage.removeItem("adminToken");
//                 navigate("/admin/login");
//               }}
//               className="md:hidden px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//         <Outlet />
//       </div>
//     </div>
//   );
// }