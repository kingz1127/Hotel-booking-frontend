// import { BASE_URL } from "./config";

// export async function createRoom(formData){
//     try{
//         const res = await fetch(BASE_URL + "rooms",{
//             method: "POST",
//             body: formData,
//         });

//         if(res.ok){
//             const data = await res.json();

//             return data;
//        } } catch (error){
//             throw new Error(error.message);
        
//     }
// }

// export async function getAllRooms(page, size) {
//   try {
//     const res = await fetch(BASE_URL + `/rooms?page=${page}&size=${size}`);

//     if (res.ok) {
//       const data = await res.json();

//       return data;
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// export async function getRoomById(id) {
//   try {
//     const res = await fetch(BASE_URL + `/rooms/${id}`);

//     if (res.ok) {
//       const data = await res.json();

//       return data;
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

import { BASE_URL } from "./config";

// Base API path
const API_BASE = `${BASE_URL}/api/v1/`;

export async function createRoom(roomData, imageFile) {
  try {
    const url = API_BASE + "rooms";
    console.log("Creating room at:", url);
    
    // Create FormData
    const formData = new FormData();
    
    // Add 'data' parameter as JSON string
    formData.append('data', JSON.stringify(roomData));
    
    // Add 'file' parameter if imageFile exists
    if (imageFile) {
      formData.append('file', imageFile);
    }
    
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();

  } catch (error) {
    console.error("Create room error:", error);
    throw error;
  }
}

export async function getAllRooms(page, size) {
  try {
    const url = API_BASE + `rooms?page=${page}&size=${size}`;
    console.log("Fetching rooms from:", url);
    
    const response = await fetch(url);

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();

  } catch (error) {
    console.error("Get all rooms error:", error);
    throw error;
  }
}

export async function getRoomById(id) {
  try {
    const url = API_BASE + `rooms/${id}`;
    console.log("Fetching room from:", url);
    
    const response = await fetch(url);

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();

  } catch (error) {
    console.error("Get room by ID error:", error);
    throw error;
  }
}

export async function updateRoom(id, roomData, imageFile) {
  try {
    const url = API_BASE + `rooms/${id}`;
    console.log("Updating room at:", url);
    
    // Create FormData
    const formData = new FormData();
    
    // Add 'data' parameter as JSON string
    formData.append('data', JSON.stringify(roomData));
    
    // Add 'file' parameter if new image provided
    if (imageFile) {
      formData.append('file', imageFile);
    }
    
    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();

  } catch (error) {
    console.error("Update room error:", error);
    throw error;
  }
}

export async function deleteRoom(id) {
  try {
    const url = API_BASE + `rooms/${id}`;
    console.log("Deleting room at:", url);
    
    const response = await fetch(url, {
      method: "DELETE",
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (response.ok) {
      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Delete response data:", data);
        return data;
      } else {
        // If no JSON body, return success status
        console.log("Delete successful, no JSON body returned");
        return { success: true, id: id };
      }
    } else {
      // Try to get error message
      let errorMessage = `Failed to delete room. Status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        // Ignore if can't read error text
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Delete room error:", error);
    throw error;
  }
}