// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Check if user is authenticated
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const superAdmin = JSON.parse(localStorage.getItem("superAdmin") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  // Check based on required role
  if (role === "SUPER_ADMIN") {
    if (!superAdmin?.token) {
      return <Navigate to="/super-admin" replace />;
    }
    return children;
  }

  // For ADMIN role:
if (role === "ADMIN") {
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  if (!admin?.token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
  // For regular users
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}