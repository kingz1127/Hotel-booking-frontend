// api.superadmin.js
import { BASE_URL } from "./config";

const API_BASE = `${BASE_URL}/api/v1/super-admin/`;

// Super Admin login
export async function superAdminLogin(credentials) {
  try {
    const url = API_BASE + "login";
    console.log("Super admin login at:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Super admin login failed: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Super admin login error:", error);
    throw error;
  }
}

// Get system stats
export async function getSystemStats() {
  try {
    const superAdmin = JSON.parse(localStorage.getItem("superAdmin") || "{}");
    const token = superAdmin.token;
    
    const url = API_BASE + "stats";
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get stats: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get system stats error:", error);
    throw error;
  }
}

// Get audit logs
export async function getAuditLogs(page = 0, size = 20) {
  try {
    const superAdmin = JSON.parse(localStorage.getItem("superAdmin") || "{}");
    const token = superAdmin.token;
    
    const url = API_BASE + `audit-logs?page=${page}&size=${size}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get audit logs: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get audit logs error:", error);
    throw error;
  }
}

// Verify super admin token
export async function verifySuperAdminToken() {
  try {
    const superAdmin = JSON.parse(localStorage.getItem("superAdmin") || "{}");
    const token = superAdmin.token;
    
    if (!token) {
      return { valid: false };
    }
    
    const url = API_BASE + "verify";
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { valid: false };
    }
    
    return await response.json();
  } catch (error) {
    console.error("Verify token error:", error);
    return { valid: false };
  }
}