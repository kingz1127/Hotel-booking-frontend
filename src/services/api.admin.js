

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
    
    console.log("=== VERIFICATION DEBUG ===");
    console.log("Email from form:", verificationData.email);
    console.log("Code from form:", verificationData.code);
    
    // CRITICAL FIX: Change field name from 'verificationCode' to 'code'
    const payload = {
      email: verificationData.email.trim().toLowerCase(),
      code: verificationData.code.toString().trim()  // MUST BE 'code' NOT 'verificationCode'
    };
    
    console.log("Payload being sent to backend:", JSON.stringify(payload));
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);
    
    if (!response.ok) {
      console.error("Verification failed:", responseText);
      
      let errorMessage = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error || errorJson.message || responseText;
      } catch (e) {
        // Keep text if not JSON
      }
      
      const errorLower = errorMessage.toLowerCase();
      
      if (errorLower.includes("admin not found") || 
          errorLower.includes("not found with email")) {
        throw new Error("Email not registered as admin.");
      }
      else if (errorLower.includes("inactive")) {
        throw new Error("Account is inactive.");
      }
      else if (errorLower.includes("invalid verification code") ||
               errorLower.includes("invalid code")) {
        throw new Error("Invalid code. Please check and try again.");
      }
      else if (errorLower.includes("expired")) {
        throw new Error("Code has expired. Request a new code.");
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse successful response
    try {
      const result = JSON.parse(responseText);
      console.log("Verification successful! Result:", result);
      return result;
    } catch (jsonError) {
      console.log("Verification successful (non-JSON response):", responseText);
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

export const getAdminHierarchyStats = async (adminId) => {
  try {
    const response = await axios.get(`${API_URL}/admins/${adminId}/hierarchy-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin hierarchy stats:', error);
    throw error;
  }
};