
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoomById } from "../../services/api.room.js";
import { toast } from "react-toastify";
import { LiquidButton } from "@/components/ui/liquid.js";

export default function CreateBookings() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: ""
  });

  useEffect(() => {
    const fetchRoomAndCheckAuth = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login to book a room");
        navigate("/login");
        return;
      }

      try {
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
      } catch (error) {
        toast.error("Room not found");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndCheckAuth();
  }, [roomId, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const userPhone = localStorage.getItem("userPhone");
    
    // Validate dates
    const today = new Date().toISOString().split('T')[0];
    if (bookingData.checkIn < today) {
      toast.error("Check-in date must be today or in the future");
      return;
    }
    
    if (bookingData.checkOut <= bookingData.checkIn) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    
    // Prepare booking payload matching backend requirements
    const bookingPayload = {
      roomId: parseInt(roomId),
      userId: parseInt(userId),
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      numberOfGuests: parseInt(bookingData.guests),
      totalAmount: calculateTotalPrice(),
      specialRequests: bookingData.specialRequests || "",
      contactPhone: userPhone || "1234567890", // Default if missing
      contactEmail: userEmail || "user@example.com" // Default if missing
    };
    
    console.log("Creating booking with payload:", bookingPayload);

    try {
      const response = await fetch("http://localhost:8080/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      // Get response text first
      const responseText = await response.text();
      console.log("Booking response:", response.status, responseText);
      
      if (response.ok) {
        let bookingResult;
        try {
          bookingResult = JSON.parse(responseText);
        } catch {
          bookingResult = { success: true };
        }
        
        toast.success("Booking created! Redirecting to payment...");
        
        // Clean up stored booking context
        localStorage.removeItem('pendingBooking');
        localStorage.removeItem('selectedRoomId');
        localStorage.removeItem('redirectAfterLogin');
        
        // ✅ NEW: Redirect to payment page with booking ID
        if (bookingResult.id) {
          // Store booking ID for payment page
          localStorage.setItem('pendingPaymentBookingId', bookingResult.id);
          localStorage.setItem('pendingPaymentAmount', bookingResult.totalAmount);
          
          // Navigate to payment page
          navigate(`/payment/${bookingResult.id}`);
        } else {
          // Fallback: Go to bookings page
          navigate("/customerpage/customerBookings");
        }
      } else {
        // Try to parse error message
        let errorMessage = "Booking failed";
        try {
          const errorObj = JSON.parse(responseText);
          errorMessage = errorObj.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(`Booking failed: ${error.message}`);
    }
  };

  const calculateTotalPrice = () => {
    if (!room || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    const pricePerNight = room.roomDiscount > 0 
      ? room.roomPrice * (1 - room.roomDiscount / 100)
      : room.roomPrice;
    return nights * pricePerNight;
  };

  // Add min date for check-in (today)
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Book {room.roomName}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room Info */}
        <div>
          <img src={room.roomImage} alt={room.roomName} className="w-full h-64 object-cover rounded-lg" />
          <h2 className="text-2xl font-bold mt-4">{room.roomName}</h2>
          <p className="text-gray-600">{room.roomCategory}</p>
          <div className="mt-4">
            <p className="text-xl font-bold text-green-600">
              ${calculateTotalPrice().toFixed(2)} total
            </p>
            <p className="text-gray-500">
              {room.roomDiscount > 0 && (
                <span className="line-through text-gray-400 mr-2">
                  ${(room.roomPrice * Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))).toFixed(2)}
                </span>
              )}
              ${room.roomDiscount > 0 ? (room.roomPrice * (1 - room.roomDiscount / 100)).toFixed(2) : room.roomPrice.toFixed(2)} per night
            </p>
          </div>
          
          {/* Payment Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Payment Process</h3>
            <p className="text-sm text-blue-700">
              After confirming your booking, you'll be redirected to a secure payment page to complete your reservation.
            </p>
            <div className="mt-3 flex items-center text-sm">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</span>
              <span>Confirm booking details</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</span>
              <span>Proceed to secure payment</span>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">3</span>
              <span>Receive booking confirmation</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Check-in Date</label>
            <input
              type="date"
              value={bookingData.checkIn}
              min={today}
              onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Check-out Date</label>
            <input
              type="date"
              value={bookingData.checkOut}
              min={bookingData.checkIn || today}
              onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Number of Guests</label>
            <select
              value={bookingData.guests}
              onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            >
              {[1,2,3,4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Special Requests (Optional)</label>
            <textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Any special requests?"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Room price</span>
              <span>${room.roomPrice.toFixed(2)} × {Math.ceil((new Date(bookingData.checkOut || today) - new Date(bookingData.checkIn || today)) / (1000 * 60 * 60 * 24)) || 1} nights</span>
            </div>
            {room.roomDiscount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount ({room.roomDiscount}%)</span>
                <span>-${(room.roomPrice * (room.roomDiscount / 100) * (Math.ceil((new Date(bookingData.checkOut || today) - new Date(bookingData.checkIn || today)) / (1000 * 60 * 60 * 24)) || 1)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total Amount</span>
              <span className="text-green-600">${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          <LiquidButton
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Confirm Booking & Proceed to Payment
          </LiquidButton>
          
          <p className="text-xs text-gray-500 text-center">
            By confirming, you'll be redirected to our secure payment gateway
          </p>
        </form>
      </div>
    </div>
  );
}