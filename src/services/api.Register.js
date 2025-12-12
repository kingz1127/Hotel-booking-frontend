export async function userRegister(userData){
    try{
        console.log("Sending to: http://localhost:8080/api/v1/register");
        
        const response = await fetch("http://localhost:8080/api/v1/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),      
     });

     console.log("Response status:", response.status);

     if (!response.ok){
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
     }
     return await response.json();

    } catch (error){
        console.error("Registration error:", error);
        throw error;
    }
}