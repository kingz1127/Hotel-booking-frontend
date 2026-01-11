
// // export async function getAllUsers() {
// //     try {
// //         console.log("Fetching users from: http://localhost:8080/api/v1/customers");
        
// //         const response = await fetch("http://localhost:8080/api/v1/customers", {
// //             method: "GET",
// //             headers: {
// //                 "Content-Type": "application/json",
// //             },
// //         });

// //         console.log("Response status:", response.status);

// //         if (!response.ok) {
// //             const errorText = await response.text();
// //             throw new Error(`Server error: ${response.status} - ${errorText}`);
// //         }
        
// //         return await response.json();

// //     } catch (error) {
// //         console.error("Error fetching users:", error);
// //         throw error;
// //     }
// // }

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
        
//         const result = await response.json();
//         console.log("API Result structure:", result);
        
//         // Handle different response formats
//         if (Array.isArray(result)) {
//             return result; // Direct array
//         } else if (result.data && Array.isArray(result.data)) {
//             return result.data; // Nested in data property
//         } else if (result.users && Array.isArray(result.users)) {
//             return result.users; // Nested in users property
//         } else if (result.customers && Array.isArray(result.customers)) {
//             return result.customers; // Nested in customers property
//         } else {
//             console.warn("Unexpected API response format:", result);
//             return []; // Return empty array as fallback
//         }

//     } catch (error) {
//         console.error("Error fetching users:", error);
//         throw error;
//     }
// }

// export async function getUserById(id){
//     try{
//         const response = await fetch(`http://localhost:8080/api/v1/customers/${id}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });
//       if (!response.ok) {
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
        console.log("API Result:", result);
        
        // Check if result is an object with data property
        if (result && typeof result === 'object') {
            // Try to extract array from various possible properties
            const possibleArrays = [
                result.data,
                result.users,
                result.customers,
                result.content,
                result
            ];
            
            for (const arr of possibleArrays) {
                if (Array.isArray(arr)) {
                    console.log(`Found array with ${arr.length} items`);
                    return arr;
                }
            }
        }
        
        console.warn("Could not find array in response, returning empty array");
        return [];
        
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

// Add this debug function
export async function debugCustomerAPI() {
    try {
        const response = await fetch("http://localhost:8080/api/v1/customers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        console.log("Debug - Status:", response.status);
        console.log("Debug - Headers:", response.headers);
        
        const text = await response.text();
        console.log("Debug - Raw response:", text);
        
        try {
            const json = JSON.parse(text);
            console.log("Debug - Parsed JSON:", json);
            return json;
        } catch (e) {
            console.log("Debug - Response is not JSON:", text);
            return text;
        }
        
    } catch (error) {
        console.error("Debug API error:", error);
        return null;
    }
}