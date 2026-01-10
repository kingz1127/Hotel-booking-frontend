// services/api.Bookings.js
const API_URL = "http://localhost:8080/api/v1";

// Get booking by ID
export const getBookingById = async (bookingId) => {
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch booking: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching booking:", error);
        throw error;
    }
};

// Confirm payment for a booking
export const confirmPayment = async (bookingId) => {
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/confirm-payment`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Payment confirmation failed: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error confirming payment:", error);
        throw error;
    }
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/bookings/user/${userId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cancellation failed: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error cancelling booking:", error);
        throw error;
    }
};

// Check room availability
export const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
    try {
        const response = await fetch(
            `${API_URL}/bookings/check-availability?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
        );

        if (!response.ok) {
            throw new Error(`Availability check failed: ${response.status}`);
        }

        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error("Error checking availability:", error);
        throw error;
    }
};

// Calculate booking price
export const calculateBookingPrice = async (roomId, checkInDate, checkOutDate, numberOfGuests) => {
    try {
        const response = await fetch(
            `${API_URL}/bookings/calculate-price?roomId=${roomId}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&numberOfGuests=${numberOfGuests}`
        );

        if (!response.ok) {
            throw new Error(`Price calculation failed: ${response.status}`);
        }

        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error("Error calculating price:", error);
        throw error;
    }
};

// Get all bookings (admin)
export const getAllBookings = async () => {
    try {
        const response = await fetch(`${API_URL}/bookings`);

        if (!response.ok) {
            throw new Error(`Failed to fetch all bookings: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw error;
    }
};

// Get bookings by status (admin)
export const getBookingsByStatus = async (status) => {
    try {
        const response = await fetch(`${API_URL}/bookings/status/${status}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch bookings by status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching bookings by status:", error);
        throw error;
    }
};

// Update the emergencyFixRoom function
export const emergencyFixRoom = async (roomId) => {
    try {
        console.log(`🔧 Running emergency fix for room #${roomId}...`);
        
        // First, check if room has active bookings
        console.log(`📋 Checking if room #${roomId} is currently occupied...`);
        
        try {
            const checkResponse = await fetch(
                `${API_URL}/bookings/room/${roomId}/active`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            
            if (checkResponse.ok) {
                const occupancyData = await checkResponse.json();
                
                if (occupancyData.currentlyOccupied) {
                    const booking = occupancyData.activeBookings[0];
                    throw new Error(
                        `Cannot fix room #${roomId}. Room is currently occupied by booking #${booking.id}. ` +
                        `Guest: ${booking.customerName} ` +
                        `(Check-out: ${booking.checkOutDate}). ` +
                        `Wait until customer checks out before fixing room availability.`
                    );
                }
                
                console.log(`✅ Room #${roomId} is not currently occupied. Safe to fix.`);
            }
        } catch (error) {
            if (error.message.includes("Cannot fix room")) {
                throw error;
            }
            console.warn(`⚠️ Could not check occupancy: ${error.message}`);
        }
        
        // Proceed with the emergency fix
        const response = await fetch(
            `${API_URL}/bookings/emergency-fix-room/${roomId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();
        
        if (!response.ok) {
            // Handle specific error for occupied rooms
            if (result.error && result.error.includes("currently occupied")) {
                throw new Error(result.error);
            }
            throw new Error(result.error || `Emergency fix failed: ${response.status}`);
        }

        console.log("✅ Emergency fix completed:", result);
        
        return {
            ...result,
            message: result.message || "Room fixed successfully",
            alreadyCorrect: result.alreadyCorrect || false
        };
        
    } catch (error) {
        console.error("❌ Emergency fix error:", error);
        throw error;
    }
};

export const emergencyFixAllRooms = async () => {
    try {
        console.log("🔧 Running emergency fix for ALL rooms...");
        
        // Add a confirmation prompt before fixing all rooms
        const userConfirmed = window.confirm(
            "⚠️ WARNING: This will attempt to fix availability for ALL rooms.\n\n" +
            "Are you sure you want to continue?\n\n" +
            "Note: Rooms with active bookings will not be fixed."
        );
        
        if (!userConfirmed) {
            throw new Error("Emergency fix cancelled by user");
        }
        
        const response = await fetch(
            `${API_URL}/bookings/emergency-fix-all-rooms`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Emergency fix all failed: ${errorText}`);
        }

        const result = await response.json();
        console.log("✅ Emergency fix all completed:", result);
        
        // Add warning if some rooms couldn't be fixed due to occupancy
        if (result.failedRooms && result.failedRooms.length > 0) {
            return {
                ...result,
                warning: `Some rooms (${result.failedRooms.length}) could not be fixed due to active bookings.`
            };
        }
        
        return result;
        
    } catch (error) {
        console.error("❌ Emergency fix all error:", error);
        throw error;
    }
};

export const diagnoseRoom = async (roomId) => {
    try {
        console.log(`🔍 Diagnosing room #${roomId}...`);
        
        const response = await fetch(
            `${API_URL}/bookings/diagnose-room/${roomId}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Diagnosis failed: ${errorText}`);
        }

        const result = await response.json();
        console.log("📊 Diagnosis result:", result);
        
        return result;
    } catch (error) {
        console.error("❌ Diagnosis error:", error);
        throw error;
    }
};

// Add this function to services/api.Bookings.js

// Check if room has active bookings
export const getActiveBookingsForRoom = async (roomId) => {
    try {
        const response = await fetch(
            `${API_URL}/bookings/room/${roomId}/active`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to check active bookings: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error checking active bookings:", error);
        throw error;
    }
};

// Add this to your services/api.Bookings.js
export const forceFixRoomAvailability = async (roomId) => {
  try {
    console.log(`🛠️ Force fixing room #${roomId}...`);
    
    // Get current room details
    const roomResponse = await fetch(`${API_URL}/rooms/${roomId}`);
    if (!roomResponse.ok) {
      throw new Error(`Failed to fetch room: ${roomResponse.status}`);
    }
    const room = await roomResponse.json();
    
    // Get all bookings
    const bookingsResponse = await fetch(`${API_URL}/bookings`);
    if (!bookingsResponse.ok) {
      throw new Error(`Failed to fetch bookings: ${bookingsResponse.status}`);
    }
    const allBookings = await bookingsResponse.json();
    
    // Count active bookings for this room
    const today = new Date().toISOString().split('T')[0];
    const roomBookings = Array.isArray(allBookings) 
      ? allBookings.filter(b => b.roomId === roomId)
      : [];
    
    const activeBookings = roomBookings.filter(booking => {
      const isActiveStatus = booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN';
      const isOngoing = new Date(booking.checkOutDate) >= new Date(today);
      return isActiveStatus && isOngoing;
    });
    
    console.log(`Active bookings: ${activeBookings.length}`);
    
    // Calculate correct availability
    const correctAvailable = Math.max(0, room.roomQuantity - activeBookings.length);
    
    // Update the room directly
    const updateResponse = await fetch(`${API_URL}/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...room,
        availableRooms: correctAvailable,
        isAvailable: correctAvailable > 0
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }
    
    const updatedRoom = await updateResponse.json();
    
    console.log("✅ Force fix completed:", updatedRoom);
    
    return {
      success: true,
      roomId: roomId,
      roomName: room.roomName,
      totalRooms: room.roomQuantity,
      activeBookings: activeBookings.length,
      oldAvailable: room.availableRooms,
      newAvailable: correctAvailable,
      message: `Room fixed: ${correctAvailable} available (was ${room.availableRooms})`
    };
    
  } catch (error) {
    console.error("❌ Force fix error:", error);
    throw error;
  }
};