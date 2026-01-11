// // export async function loginUser(loginData) {
// //   try {
    
// //     if (!loginData.email || !loginData.password) {
// //       throw new Error("Email and Password are required");
// //     }
    
// //     const response = await fetch("http://localhost:8080/api/v1/login", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(loginData),
// //     });
    
// //     console.log("API: Response status:", response.status);
    
// //     if (!response.ok) {
// //       const errorText = await response.text();
// //       throw new Error(errorText || "Invalid email or password");
// //     }
    
// //     const data = await response.json();
// //     return data;
    
// //   } catch (error) {
// //     console.error("API: Login error:", error);
// //     throw error;
// //   }
// // }


// export async function loginUser(loginData) {
//   try {
    
//     if (!loginData.email || !loginData.password) {
//       throw new Error("Email and Password are required");
//     }
    
//     console.log("API: Calling login endpoint with:", loginData);
    
//     const response = await fetch("http://localhost:8080/api/v1/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(loginData),
//     });
    
//     console.log("API: Response status:", response.status);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("API: Error response text:", errorText);
//       throw new Error(errorText || "Invalid email or password");
//     }
    
//     const data = await response.json();
    
//     // CRITICAL: Log the exact response structure
//     console.log("API: Login response data:", data);
//     console.log("API: Response type:", typeof data);
//     console.log("API: Is array?", Array.isArray(data));
//     console.log("API: All keys:", Object.keys(data || {}));
    
//     // Check for specific fields
//     if (data) {
//       console.log("API: Has 'id'?", 'id' in data);
//       console.log("API: Has 'userId'?", 'userId' in data);
//       console.log("API: Has 'customerId'?", 'customerId' in data);
//       console.log("API: Has 'token'?", 'token' in data);
//       console.log("API: Has 'user' object?", data.user);
//       console.log("API: Has 'data' object?", data.data);
//     }
    
//     return data;
    
//   } catch (error) {
//     console.error("API: Login error:", error);
//     throw error;
//   }
// }

export async function loginUser(loginData) {
  try {
    console.log("🔐 LOGIN ATTEMPT for:", loginData.email);
    
    const response = await fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });
    
    console.log("📊 Login response status:", response.status);
    
    const responseText = await response.text();
    console.log("📄 Raw login response:", responseText);
    
    if (!response.ok) {
      throw new Error(responseText || "Login failed");
    }
    
    const data = JSON.parse(responseText);
    console.log("✅ Parsed login data:", data);
    
    // **CRITICAL**: Log which customer ID we got
    console.log("👤 Login API says customer ID is:", data.id);
    console.log("👤 Login API says customer email is:", data.email);
    
    // Check if email matches
    if (data.email !== loginData.email) {
      console.warn("⚠️ WARNING: Login email doesn't match!");
      console.log("   Expected:", loginData.email);
      console.log("   Got:", data.email);
    }
    
    return data;
    
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}