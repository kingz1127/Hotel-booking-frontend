// export async function loginUser(loginData) {
//   try {
    
//     if (!loginData.email || !loginData.password) {
//       throw new Error("Email and Password are required");
//     }
    
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
//       throw new Error(errorText || "Invalid email or password");
//     }
    
//     const data = await response.json();
//     return data;
    
//   } catch (error) {
//     console.error("API: Login error:", error);
//     throw error;
//   }
// }


export async function loginUser(loginData) {
  try {
    
    if (!loginData.email || !loginData.password) {
      throw new Error("Email and Password are required");
    }
    
    console.log("API: Calling login endpoint with:", loginData);
    
    const response = await fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    
    console.log("API: Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API: Error response text:", errorText);
      throw new Error(errorText || "Invalid email or password");
    }
    
    const data = await response.json();
    
    // CRITICAL: Log the exact response structure
    console.log("API: Login response data:", data);
    console.log("API: Response type:", typeof data);
    console.log("API: Is array?", Array.isArray(data));
    console.log("API: All keys:", Object.keys(data || {}));
    
    // Check for specific fields
    if (data) {
      console.log("API: Has 'id'?", 'id' in data);
      console.log("API: Has 'userId'?", 'userId' in data);
      console.log("API: Has 'customerId'?", 'customerId' in data);
      console.log("API: Has 'token'?", 'token' in data);
      console.log("API: Has 'user' object?", data.user);
      console.log("API: Has 'data' object?", data.data);
    }
    
    return data;
    
  } catch (error) {
    console.error("API: Login error:", error);
    throw error;
  }
}