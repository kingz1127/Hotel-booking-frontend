import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
  Home,
} from "lucide-react";
import { getAllRooms } from "../../services/api.room.js";
import { getAllBookings } from "../../services/api.Booking.js";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoomStatus() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalCapacity: 0,
  });


  const location = useLocation(); // Add this
  
  // ... existing state ...

  // Add this effect
  useEffect(() => {
    if (location.state?.refresh) {
      fetchRoomStatus();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomStatus();
  }, []);

  const fetchRoomStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both rooms and bookings using your API functions
      const [roomsResult, bookingsResult] = await Promise.all([
        getAllRooms(0, 100),
        getAllBookings(),
      ]);

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
      } else if (
        bookingsResult.bookings &&
        Array.isArray(bookingsResult.bookings)
      ) {
        bookingsArray = bookingsResult.bookings;
      }

      // Calculate today's date for booking filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate room status
      const roomsWithStatus = roomsArray.map((room) => {
        const roomId = room.id || room.roomId || "unknown";
        const totalQuantity =
          room.roomQuantity || room.quantity || room.totalQuantity || 1;

        // Find bookings for this room
        const roomBookings = bookingsArray.filter((booking) => {
          const bookingRoomId =
            booking.roomId ||
            booking.roomID ||
            (booking.room && (booking.room.id || booking.room.roomId));
          return bookingRoomId == roomId;
        });

        // Count active bookings for today
       const activeBookings = roomBookings.filter((booking) => {
  const status = booking.status || booking.bookingStatus;
  const isActive =
    status === "CONFIRMED" ||
    status === "CHECKED_IN" ||
    status === "ACTIVE" ||
    status === "PENDING_PAYMENT";

  if (!isActive) return false;

  // Check if booking is active for today
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
        const occupancyRate =
          totalQuantity > 0 ? (bookedCount / totalQuantity) * 100 : 0;

        let status = "AVAILABLE";
        if (bookedCount === 0) {
          status = "VACANT";
        } else if (availableNow === 0) {
          status = "FULLY BOOKED";
        } else if (availableNow <= totalQuantity * 0.2) {
          status = "LIMITED";
        } else {
          status = "AVAILABLE";
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
          activeBookingsCount: activeBookings.length,
        };
      });

      // Sort by occupancy rate (most occupied first) and take only 3 rooms
      const sortedRooms = roomsWithStatus
        .sort((a, b) => b.occupancyRate - a.occupancyRate)
        .slice(0, 3);

      // Calculate overall statistics
      const totalRooms = roomsWithStatus.length;
      const totalCapacity = roomsWithStatus.reduce(
        (sum, room) => sum + room.totalQuantity,
        0
      );
      const availableRooms = roomsWithStatus.reduce(
        (sum, room) => sum + room.availableNow,
        0
      );
      const occupiedRooms = totalCapacity - availableRooms;

      setStats({
        totalRooms,
        totalCapacity,
        availableRooms,
        occupiedRooms,
      });

      setRooms(sortedRooms);
    } catch (error) {
      console.error("Error fetching room status:", error);
      setError(error.message);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "VACANT":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Vacant
          </span>
        );
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Available
          </span>
        );
      case "LIMITED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="mr-1 h-3 w-3" />
            Limited
          </span>
        );
      case "FULLY BOOKED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Fully Booked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-[#c1bd3f] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading room status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error Loading Data
            </h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Room Status</h2>
            <p className="text-sm text-gray-500">
              Showing 3 most occupied rooms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/rooms")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View All Rooms
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={fetchRoomStatus}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
            >
              <RefreshCw
                className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 border-b">
        <div className="bg-white p-3 rounded-lg border text-center">
          <p className="text-xs text-gray-500">Total Rooms</p>
          <p className="text-lg font-bold mt-1">{stats.totalRooms}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border text-center">
          <p className="text-xs text-gray-500">Total Capacity</p>
          <p className="text-lg font-bold mt-1">{stats.totalCapacity}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border text-center">
          <p className="text-xs text-gray-500">Occupied</p>
          <p className="text-lg font-bold mt-1 text-red-600">
            {stats.occupiedRooms}
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg border text-center">
          <p className="text-xs text-gray-500">Available</p>
          <p className="text-lg font-bold mt-1 text-green-600">
            {stats.availableRooms}
          </p>
        </div>
      </div>

      {/* 3 Room Cards */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.category}</p>
                </div>
                {getStatusBadge(room.status)}
              </div>

              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-32 w-full rounded-lg object-cover mb-3"
                />
              ) : (
                <div className="h-32 w-full rounded-lg bg-gray-200 flex items-center justify-center mb-3">
                  <Home className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">
                    {formatCurrency(room.price)}/night
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">
                    {room.bookedCount}/{room.totalQuantity} booked
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Now:</span>
                  <span
                    className={`font-medium ${
                      room.availableNow === 0
                        ? "text-red-600"
                        : room.availableNow <= room.totalQuantity * 0.2
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {room.availableNow} available
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Occupancy Rate</span>
                    <span>{room.occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        room.occupancyRate >= 80
                          ? "bg-red-500"
                          : room.occupancyRate >= 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(room.occupancyRate, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/admin/rooms/${room.id}`)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No rooms message */}
        {rooms.length === 0 && (
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No Rooms Found
            </h3>
            <p className="text-gray-500 mt-1">Add rooms to get started</p>
            <button
              onClick={() => navigate("/admin/rooms")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add Rooms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
