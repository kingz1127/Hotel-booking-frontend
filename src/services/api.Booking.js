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