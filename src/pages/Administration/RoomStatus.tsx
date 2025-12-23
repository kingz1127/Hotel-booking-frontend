
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { getAllRooms } from "../../services/api.room.js";
import { getAllBookings } from "../../services/api.Booking.js";

export default function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalCapacity: 0
  });

  useEffect(() => {
    fetchRoomStatus();
  }, []);

  const fetchRoomStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("=== FETCHING ROOM STATUS ===");
      
      // Get admin token for debugging
      let adminToken = null;
      try {
        const adminData = sessionStorage.getItem("admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          adminToken = admin.token;
          console.log("Admin token available:", adminToken ? "Yes" : "No");
        }
      } catch (error) {
        console.error("Error getting admin token:", error);
      }
      
      // Fetch both rooms and bookings using your API functions
      const [roomsResult, bookingsResult] = await Promise.all([
        getAllRooms(0, 100), // Get first 100 rooms
        getAllBookings()     // Get all bookings
      ]);
      
      console.log("Rooms API result:", roomsResult);
      console.log("Bookings API result:", bookingsResult);
      
      // Process rooms data
      let roomsArray = [];
      if (Array.isArray(roomsResult)) {
        roomsArray = roomsResult;
      } else if (roomsResult.data && Array.isArray(roomsResult.data)) {
        roomsArray = roomsResult.data;
      } else if (roomsResult.rooms && Array.isArray(roomsResult.rooms)) {
        roomsArray = roomsResult.rooms;
      } else if (roomsResult.content && Array.isArray(roomsResult.content)) {
        roomsArray = roomsResult.content;
      }
      
      // Process bookings data
      let bookingsArray = [];
      if (Array.isArray(bookingsResult)) {
        bookingsArray = bookingsResult;
      } else if (bookingsResult.data && Array.isArray(bookingsResult.data)) {
        bookingsArray = bookingsResult.data;
      } else if (bookingsResult.bookings && Array.isArray(bookingsResult.bookings)) {
        bookingsArray = bookingsResult.bookings;
      }
      
      console.log(`Processing ${roomsArray.length} rooms and ${bookingsArray.length} bookings`);
      
      // Calculate today's date for booking filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Calculate room status
      const roomsWithStatus = roomsArray.map(room => {
        const roomId = room.id || room.roomId || 'unknown';
        const totalQuantity = room.roomQuantity || room.quantity || room.totalQuantity || 1;
        
        // Find bookings for this room
        const roomBookings = bookingsArray.filter(booking => {
          const bookingRoomId = booking.roomId || booking.roomID || 
                               (booking.room && (booking.room.id || booking.room.roomId));
          return bookingRoomId == roomId; // Use loose equality for string/number mismatch
        });
        
        // Count active bookings for today
        const activeBookings = roomBookings.filter(booking => {
          const status = booking.status || booking.bookingStatus;
          const isActive = status === "CONFIRMED" || status === "CHECKED_IN" || 
                          status === "ACTIVE" || status === "PENDING_PAYMENT";
          
          if (!isActive) return false;
          
          const checkInDate = booking.checkInDate || booking.checkinDate || booking.startDate;
          const checkOutDate = booking.checkOutDate || booking.checkoutDate || booking.endDate;
          
          if (!checkInDate || !checkOutDate) return false;
          
          const checkIn = new Date(checkInDate);
          const checkOut = new Date(checkOutDate);
          
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);
          
          return checkIn <= today && checkOut >= today;
        });
        
        const bookedCount = activeBookings.length;
        const availableNow = Math.max(0, totalQuantity - bookedCount);
        const occupancyRate = totalQuantity > 0 ? (bookedCount / totalQuantity) * 100 : 0;
        
        // Determine status
        let status = "AVAILABLE";
        if (availableNow === 0) {
          status = "FULLY BOOKED";
        } else if (availableNow <= totalQuantity * 0.2) {
          status = "LIMITED";
        } else if (bookedCount === 0) {
          status = "VACANT";
        }
        
        return {
          id: roomId,
          name: room.roomName || room.name || `Room ${roomId}`,
          category: room.roomCategory || room.category || "Standard",
          price: room.roomPrice || room.price || 0,
          image: room.roomImage || room.image || null,
          totalQuantity,
          bookedCount,
          availableNow,
          occupancyRate: Math.round(occupancyRate),
          status,
          bookingsCount: roomBookings.length,
          activeBookingsCount: activeBookings.length
        };
      });
      
      // Calculate overall statistics
      const totalRooms = roomsWithStatus.length;
      const totalCapacity = roomsWithStatus.reduce((sum, room) => sum + room.totalQuantity, 0);
      const availableRooms = roomsWithStatus.reduce((sum, room) => sum + room.availableNow, 0);
      const occupiedRooms = totalCapacity - availableRooms;
      
      console.log("Final statistics:", {
        totalRooms,
        totalCapacity,
        availableRooms,
        occupiedRooms
      });

      setStats({
        totalRooms,
        totalCapacity,
        availableRooms,
        occupiedRooms
      });

      setRooms(roomsWithStatus);
      
      toast.success(`Loaded ${totalRooms} rooms with ${bookingsArray.length} bookings`);
      
    } catch (error) {
      console.error("Error fetching room status:", error);
      setError(error.message);
      
      // User-friendly error messages
      if (error.message.includes("401") || error.message.includes("403")) {
        toast.error("Authentication failed. Please log in again as admin.");
      } else if (error.message.includes("400")) {
        toast.error("Bad request. The server rejected the request.");
      } else if (error.message.includes("500")) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(`Failed to load room status: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component (getStatusBadge and JSX) remains the same...
  // [Keep all your existing JSX rendering code]}

}