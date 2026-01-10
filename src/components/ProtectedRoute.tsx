// import { Navigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function ProtectedRoute({ children, role }) {
//   // console.log("=== PROTECTED ROUTE DEBUG (sessionStorage) ===");
//   // console.log("Checking for role:", role);
  
//   // For SUPER_ADMIN role
//   if (role === "SUPER_ADMIN") {
//     const superAdmin = JSON.parse(sessionStorage.getItem("superAdmin") || "null");
//     console.log("Super admin from sessionStorage:", superAdmin);
    
//     if (!superAdmin?.token) {
//       console.log("No super admin session, redirecting to /super-admin");
//       return <Navigate to="/super-admin" replace />;
//     }
//     return children;
//   }

//   // For ADMIN role - Check sessionStorage for admin
//   if (role === "ADMIN") {
//     const adminStr = sessionStorage.getItem("admin");
//     // console.log("Raw admin from sessionStorage:", adminStr);
    
//     let admin = null;
//     try {
//       admin = adminStr ? JSON.parse(adminStr) : null;
//       // console.log("Parsed admin:", admin);
//       // console.log("Admin token exists?", !!admin?.token);
//       // console.log("Admin role:", admin?.role);
//     } catch (error) {
//       console.error("Error parsing admin:", error);
//     }
    
//     // Check if admin has token AND is actually an admin (not a customer)
//     const isValidAdmin = admin?.token && (admin?.role === "ADMIN" || admin?.role === "SUPER_ADMIN");
    
//     if (!isValidAdmin) {
//       console.log("Invalid or missing admin session, redirecting to /admin/login");
//       toast.error("Admin access required");
//       return <Navigate to="/admin/login" replace />;
//     }
    
//     // console.log("✅ Valid admin session - Allowing access");
//     return children;
//   }

//   // For CUSTOMER role - Check sessionStorage for customer
//   if (role === "CUSTOMER") {
//     const customerStr = sessionStorage.getItem("customer");
//     const customerToken = sessionStorage.getItem("customerToken");
    
//     console.log("Customer from sessionStorage:", customerStr);
//     console.log("Customer token from sessionStorage:", customerToken);
    
//     let customer = null;
//     if (customerStr) {
//       try {
//         customer = JSON.parse(customerStr);
//         console.log("Parsed customer:", customer);
//         console.log("Customer role:", customer?.role);
//       } catch (error) {
//         console.error("Error parsing customer:", error);
//       }
//     }
    
//     // Check if customer has token AND is actually a customer (not an admin)
//     const hasCustomerToken = !!(customerToken || customer?.token);
//     const isCustomerRole = customer?.role === "CUSTOMER";
    
//     console.log("Has customer token?", hasCustomerToken);
//     console.log("Is customer role?", isCustomerRole);
    
//     if (!hasCustomerToken || !isCustomerRole) {
//       console.log("Invalid or missing customer session, redirecting to /login");
      
//       // Check if it's an admin trying to access customer route
//       const admin = sessionStorage.getItem("admin");
//       if (admin) {
//         toast.error("Admins cannot access customer pages. Please login as customer.");
//       } else {
//         toast.info("Please login to continue");
//       }
      
//       return <Navigate to="/login" replace />;
//     }
    
//     console.log("✅ Valid customer session - Allowing access");
//     return children;
//   }

//   // Default check (if no role specified or for backward compatibility)
//   // Check all possible sessionStorage authentication methods
//   const admin = sessionStorage.getItem("admin");
//   const customer = sessionStorage.getItem("customer");
//   const customerToken = sessionStorage.getItem("customerToken");
//   const adminToken = sessionStorage.getItem("adminToken");
  
//   console.log("Default check - Admin session:", !!admin);
//   console.log("Default check - Customer session:", !!customer);
//   console.log("Default check - Customer token:", !!customerToken);
//   console.log("Default check - Admin token:", !!adminToken);
  
//   // If any session exists, allow access
//   if (!admin && !customer && !customerToken && !adminToken) {
//     console.log("No session found, redirecting to /login");
//     return <Navigate to="/login" replace />;
//   }
  
//   console.log("✅ Some session exists - Allowing access");
//   return children;
// }


import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children, role }) {
  // Use useEffect for side effects (toasts)
  useEffect(() => {
    if (role === "ADMIN") {
      const adminStr = sessionStorage.getItem("admin");
      let admin = null;
      try {
        admin = adminStr ? JSON.parse(adminStr) : null;
      } catch (error) {
        console.error("Error parsing admin:", error);
      }
      
      const isValidAdmin = admin?.token && (admin?.role === "ADMIN" || admin?.role === "SUPER_ADMIN");
      
      if (!isValidAdmin) {
        console.log("Invalid or missing admin session, redirecting to /admin/login");
        toast.error("Admin access required");
      }
    }
    
    if (role === "CUSTOMER") {
      const customerStr = sessionStorage.getItem("customer");
      const customerToken = sessionStorage.getItem("customerToken");
      
      let customer = null;
      if (customerStr) {
        try {
          customer = JSON.parse(customerStr);
        } catch (error) {
          console.error("Error parsing customer:", error);
        }
      }
      
      const hasCustomerToken = !!(customerToken || customer?.token);
      const isCustomerRole = customer?.role === "CUSTOMER";
      
      if (!hasCustomerToken || !isCustomerRole) {
        const admin = sessionStorage.getItem("admin");
        if (admin) {
          toast.error("Admins cannot access customer pages. Please login as customer.");
        } else {
          toast.info("Please login to continue");
        }
      }
    }
  }, [role]); // Run when role changes

  // For SUPER_ADMIN role
  if (role === "SUPER_ADMIN") {
    const superAdmin = JSON.parse(sessionStorage.getItem("superAdmin") || "null");
    
    if (!superAdmin?.token) {
      console.log("No super admin session, redirecting to /super-admin");
      return <Navigate to="/super-admin" replace />;
    }
    return children;
  }

  // For ADMIN role - Check sessionStorage for admin
  if (role === "ADMIN") {
    const adminStr = sessionStorage.getItem("admin");
    
    let admin = null;
    try {
      admin = adminStr ? JSON.parse(adminStr) : null;
    } catch (error) {
      console.error("Error parsing admin:", error);
    }
    
    // Check if admin has token AND is actually an admin (not a customer)
    const isValidAdmin = admin?.token && (admin?.role === "ADMIN" || admin?.role === "SUPER_ADMIN");
    
    if (!isValidAdmin) {
      console.log("Invalid or missing admin session, redirecting to /admin/login");
      return <Navigate to="/admin/login" replace />;
    }
    
    return children;
  }

  // For CUSTOMER role - Check sessionStorage for customer
  if (role === "CUSTOMER") {
    const customerStr = sessionStorage.getItem("customer");
    const customerToken = sessionStorage.getItem("customerToken");
    
    let customer = null;
    if (customerStr) {
      try {
        customer = JSON.parse(customerStr);
      } catch (error) {
        console.error("Error parsing customer:", error);
      }
    }
    
    // Check if customer has token AND is actually a customer (not an admin)
    const hasCustomerToken = !!(customerToken || customer?.token);
    const isCustomerRole = customer?.role === "CUSTOMER";
    
    if (!hasCustomerToken || !isCustomerRole) {
      console.log("Invalid or missing customer session, redirecting to /login");
      return <Navigate to="/login" replace />;
    }
    
    return children;
  }

  // Default check (if no role specified or for backward compatibility)
  const admin = sessionStorage.getItem("admin");
  const customer = sessionStorage.getItem("customer");
  const customerToken = sessionStorage.getItem("customerToken");
  const adminToken = sessionStorage.getItem("adminToken");
  
  // If any session exists, allow access
  if (!admin && !customer && !customerToken && !adminToken) {
    console.log("No session found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  
  return children;
}