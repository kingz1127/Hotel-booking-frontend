// import { BASE_URL } from "./config";

// const API_BASE = `${BASE_URL}/api/v1/admin/`;

// // Get all admins (Super Admin only)
// export async function getAllAdmins() {
//   try {
//     const token = localStorage.getItem("superAdminToken");
//     const url = API_BASE + "all";
    
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to fetch admins: ${response.status} - ${errorText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error("Get all admins error:", error);
//     throw error;
//   }
// }


// // Create new admin (Super Admin only)
// export async function createAdmin(adminData) {
//   try {
//     const token = localStorage.getItem("superAdminToken");
//     const url = API_BASE + "create";
    
//     // Transform data for backend: combine firstName + lastName into fullName
//     const backendData = {
//       fullName: `${adminData.firstName} ${adminData.lastName}`,
//       email: adminData.email,
//       phoneNumber: adminData.phoneNumber,
//       role: "ADMIN",
//       // Note: permissions not supported by backend yet
//       // permissions: adminData.permissions
//     };
    
//     console.log("Creating admin with data:", backendData);
    
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(backendData),
//     });

//     const responseText = await response.text();
    
//     if (!response.ok) {
//       console.error("Create admin failed:", response.status, responseText);
//       throw new Error(responseText || `Failed to create admin: ${response.status}`);
//     }
    
//     // Try to parse as JSON
//     try {
//       const result = JSON.parse(responseText);
//       console.log("Admin created successfully:", result);
//       return result;
//     } catch (jsonError) {
//       // If plain text response
//       console.log("Admin created (plain text):", responseText);
//       return {
//         success: true,
//         message: responseText,
//         id: adminData.email // temporary ID
//       };
//     }
//   } catch (error) {
//     console.error("Create admin error:", error);
//     throw error;
//   }
// }

// // Send login code to admin email
// export async function adminLogin(emailData) {
//   try {
//     const url = API_BASE + "login/request";
    
//     console.log("Requesting login code for:", emailData.email);
    
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email: emailData.email }),
//     });

//     // Get response as text first
//     const responseText = await response.text();
    
//     // Handle error cases
//     if (!response.ok) {
//       console.error("Login request failed:", response.status, responseText);
      
//       // Parse error message from backend
//       let errorMessage = responseText;
      
//       // Check for specific error messages from backend
//       const errorLower = responseText.toLowerCase();
      
//       if (errorLower.includes("admin not found") || 
//           errorLower.includes("not found with email") ||
//           errorLower.includes("email not found")) {
//         errorMessage = "This email is not registered as an admin. Please contact super admin.";
//       } 
//       else if (errorLower.includes("inactive")) {
//         errorMessage = "Admin account is inactive. Contact super admin.";
//       }
//       else if (errorLower.includes("too many attempts") || response.status === 429) {
//         errorMessage = "Too many attempts. Please try again in 15 minutes.";
//       }
      
//       throw new Error(errorMessage);
//     }
    
//     // Success - always return consistent object
//     console.log("Login code sent:", responseText);
//     return {
//       success: true,
//       message: responseText,
//       email: emailData.email
//     };
//   } catch (error) {
//     console.error("Admin login request error:", error);
//     throw error;
//   }
// }

// // Verify admin code
// export async function verifyAdminCode(verificationData) {
//   try {
//     const url = API_BASE + "login/verify";
    
//     console.log("Verifying code for:", verificationData.email);
    
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: verificationData.email,
//         code: verificationData.code
//       }),
//     });

//     const responseText = await response.text();
    
//     if (!response.ok) {
//       console.error("Verification failed:", responseText);
      
//       // Parse error messages
//       let errorMessage = responseText;
//       const errorLower = responseText.toLowerCase();
      
//       if (errorLower.includes("admin not found") || 
//           errorLower.includes("not found with email")) {
//         errorMessage = "Email not registered as admin.";
//       }
//       else if (errorLower.includes("inactive")) {
//         errorMessage = "Account is inactive.";
//       }
//       else if (errorLower.includes("invalid verification code") ||
//                errorLower.includes("invalid code")) {
//         errorMessage = "Invalid code. Please check and try again.";
//       }
//       else if (errorLower.includes("expired")) {
//         errorMessage = "Code has expired. Request a new code.";
//       }
      
//       throw new Error(errorMessage);
//     }
    
//     // Parse JSON response
//     try {
//       const result = JSON.parse(responseText);
//       console.log("Verification successful:", result);
//       return result;
//     } catch (jsonError) {
//       // If it's plain text, create a basic response
//       console.log("Verification successful (plain text):", responseText);
//       return {
//         success: true,
//         message: responseText,
//         email: verificationData.email,
//         token: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//       };
//     }
//   } catch (error) {
//     console.error("Verify admin code error:", error);
//     throw error;
//   }
// }

// // Resend admin code (can be called by admin or super admin)
// export async function resendAdminCode(adminId) {
//   try {
//     const token = localStorage.getItem("superAdminToken") || localStorage.getItem("adminToken");
//     const url = API_BASE + `resend-code/${adminId}`;
    
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to resend code: ${response.status} - ${errorText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error("Resend admin code error:", error);
//     throw error;
//   }
// }

// // Delete admin (Super Admin only)
// export async function deleteAdmin(adminId) {
//   try {
//     const token = localStorage.getItem("superAdminToken");
//     const url = API_BASE + `delete/${adminId}`;
    
//     const response = await fetch(url, {
//       method: "DELETE",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Failed to delete admin: ${response.status} - ${errorText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error("Delete admin error:", error);
//     throw error;
//   }
// }

// // Get current admin info (authenticated admin)
// export async function getCurrentAdmin() {
//   try {
//     const token = localStorage.getItem("adminToken");
//     const adminData = localStorage.getItem("admin");
    
//     if (!token || !adminData) {
//       throw new Error("Not authenticated");
//     }
    
//     return JSON.parse(adminData);
//   } catch (error) {
//     console.error("Get current admin error:", error);
//     throw error;
//   }
// }

// // Logout admin
// export function logoutAdmin() {
//   localStorage.removeItem("adminToken");
//   localStorage.removeItem("admin");
// }

// // Toggle admin status (enable/disable)
// export const toggleAdminStatus = async (adminId, isActive) => {
//   const response = await fetch(`${API_BASE_URL}/admins/${adminId}/status`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ isActive }),
//   });
  
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Failed to update admin status');
//   }
  
//   return await response.json();
// };

// // Get admin statistics
// export const getAdminStats = async () => {
//   const response = await fetch(`${API_BASE_URL}/admins/stats`);
  
//   if (!response.ok) {
//     throw new Error('Failed to fetch admin statistics');
//   }
  
//   return await response.json();
// };

// // Get subordinates for an admin (staff and customers)
// export const getAdminSubordinates = async (adminId) => {
//   const response = await fetch(`${API_BASE_URL}/admins/${adminId}/subordinates`);
  
//   if (!response.ok) {
//     throw new Error('Failed to fetch subordinate data');
//   }
  
//   return await response.json();
// };

import { BASE_URL } from "./config";

const API_BASE = `${BASE_URL}/api/v1/admin/`;

// Get all admins (Super Admin only)
export async function getAllAdmins() {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + "all";
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch admins: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get all admins error:", error);
    throw error;
  }
}

// Create new admin (Super Admin only)
export async function createAdmin(adminData) {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + "create";
    
    // Transform data for backend: combine firstName + lastName into fullName
    const backendData = {
      fullName: `${adminData.firstName} ${adminData.lastName}`,
      email: adminData.email,
      phoneNumber: adminData.phoneNumber,
      role: "ADMIN",
      // Note: permissions not supported by backend yet
      // permissions: adminData.permissions
    };
    
    console.log("Creating admin with data:", backendData);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("Create admin failed:", response.status, responseText);
      throw new Error(responseText || `Failed to create admin: ${response.status}`);
    }
    
    // Try to parse as JSON
    try {
      const result = JSON.parse(responseText);
      console.log("Admin created successfully:", result);
      return result;
    } catch (jsonError) {
      // If plain text response
      console.log("Admin created (plain text):", responseText);
      return {
        success: true,
        message: responseText,
        id: adminData.email // temporary ID
      };
    }
  } catch (error) {
    console.error("Create admin error:", error);
    throw error;
  }
}

// Send login code to admin email
export async function adminLogin(emailData) {
  try {
    const url = API_BASE + "login/request";
    
    console.log("Requesting login code for:", emailData.email);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailData.email }),
    });

    // Get response as text first
    const responseText = await response.text();
    
    // Handle error cases
    if (!response.ok) {
      console.error("Login request failed:", response.status, responseText);
      
      // Parse error message from backend
      let errorMessage = responseText;
      
      // Check for specific error messages from backend
      const errorLower = responseText.toLowerCase();
      
      if (errorLower.includes("admin not found") || 
          errorLower.includes("not found with email") ||
          errorLower.includes("email not found")) {
        errorMessage = "This email is not registered as an admin. Please contact super admin.";
      } 
      else if (errorLower.includes("inactive")) {
        errorMessage = "Admin account is inactive. Contact super admin.";
      }
      else if (errorLower.includes("too many attempts") || response.status === 429) {
        errorMessage = "Too many attempts. Please try again in 15 minutes.";
      }
      
      throw new Error(errorMessage);
    }
    
    // Success - always return consistent object
    console.log("Login code sent:", responseText);
    return {
      success: true,
      message: responseText,
      email: emailData.email
    };
  } catch (error) {
    console.error("Admin login request error:", error);
    throw error;
  }
}

// Verify admin code
export async function verifyAdminCode(verificationData) {
  try {
    const url = API_BASE + "login/verify";
    
    console.log("Verifying code for:", verificationData.email);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: verificationData.email,
        code: verificationData.code
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("Verification failed:", responseText);
      
      // Parse error messages
      let errorMessage = responseText;
      const errorLower = responseText.toLowerCase();
      
      if (errorLower.includes("admin not found") || 
          errorLower.includes("not found with email")) {
        errorMessage = "Email not registered as admin.";
      }
      else if (errorLower.includes("inactive")) {
        errorMessage = "Account is inactive.";
      }
      else if (errorLower.includes("invalid verification code") ||
               errorLower.includes("invalid code")) {
        errorMessage = "Invalid code. Please check and try again.";
      }
      else if (errorLower.includes("expired")) {
        errorMessage = "Code has expired. Request a new code.";
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse JSON response
    try {
      const result = JSON.parse(responseText);
      console.log("Verification successful:", result);
      return result;
    } catch (jsonError) {
      // If it's plain text, create a basic response
      console.log("Verification successful (plain text):", responseText);
      return {
        success: true,
        message: responseText,
        email: verificationData.email,
        token: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }
  } catch (error) {
    console.error("Verify admin code error:", error);
    throw error;
  }
}

// Resend admin code (can be called by admin or super admin)
export async function resendAdminCode(adminId) {
  try {
    const token = localStorage.getItem("superAdminToken") || localStorage.getItem("adminToken");
    const url = API_BASE + `resend-code/${adminId}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to resend code: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Resend admin code error:", error);
    throw error;
  }
}

// Delete admin (Super Admin only)
export async function deleteAdmin(adminId) {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + `delete/${adminId}`;
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete admin: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Delete admin error:", error);
    throw error;
  }
}

// Get current admin info (authenticated admin)
export async function getCurrentAdmin() {
  try {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      throw new Error("Not authenticated");
    }
    
    return JSON.parse(adminData);
  } catch (error) {
    console.error("Get current admin error:", error);
    throw error;
  }
}

// Logout admin
export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
}

// Toggle admin status (enable/disable) - FIXED: Use API_BASE
export const toggleAdminStatus = async (adminId, isActive) => {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + `toggle-status/${adminId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update admin status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Toggle admin status error:", error);
    throw error;
  }
};

// Get admin statistics - FIXED: Use API_BASE
export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + "stats";
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch admin statistics: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get admin stats error:", error);
    throw error;
  }
};

// Get subordinates for an admin (staff and customers) - FIXED: Use API_BASE
export const getAdminSubordinates = async (adminId) => {
  try {
    const token = localStorage.getItem("superAdminToken");
    const url = API_BASE + `subordinates/${adminId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch subordinate data: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get admin subordinates error:", error);
    throw error;
  }
};