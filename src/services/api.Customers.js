
// export async function getAllUsers() {
//     try {
//         console.log("Fetching users from: http://localhost:8080/api/v1/customers");
        
//         const response = await fetch("http://localhost:8080/api/v1/customers", {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         console.log("Response status:", response.status);

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Server error: ${response.status} - ${errorText}`);
//         }
        
//         return await response.json();

//     } catch (error) {
//         console.error("Error fetching users:", error);
//         throw error;
//     }
// }

export async function getAllUsers() {
    try {
        console.log("Fetching users from: http://localhost:8080/api/v1/customers");
        
        const response = await fetch("http://localhost:8080/api/v1/customers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log("API Result structure:", result);
        
        // Handle different response formats
        if (Array.isArray(result)) {
            return result; // Direct array
        } else if (result.data && Array.isArray(result.data)) {
            return result.data; // Nested in data property
        } else if (result.users && Array.isArray(result.users)) {
            return result.users; // Nested in users property
        } else if (result.customers && Array.isArray(result.customers)) {
            return result.customers; // Nested in customers property
        } else {
            console.warn("Unexpected API response format:", result);
            return []; // Return empty array as fallback
        }

    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function getUserById(id){
    try{
        const response = await fetch(`http://localhost:8080/api/v1/customers/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
      if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        return await response.json();

    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}