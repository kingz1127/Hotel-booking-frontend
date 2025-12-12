export async function loginUser(loginData) {
  try {
    
    if (!loginData.email || !loginData.password) {
      throw new Error("Email and Password are required");
    }
    
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
      throw new Error(errorText || "Invalid email or password");
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("API: Login error:", error);
    throw error;
  }
}