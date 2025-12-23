// pages/Customers/CustomerBookings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUserId, cancelBooking } from "../../services/api.Booking.js";
import { toast } from "react-toastify";

export default function CustomerBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  // const fetchBookings = async () => {
  //   // Get userId from sessionStorage
  //   const userSession = sessionStorage.getItem("user");
  //   let userId = null;
    
  //   if (userSession) {
  //     try {
  //       const userData = JSON.parse(userSession);
  //       userId = userData.id || userData.userId;
  //     } catch (error) {
  //       console.error("Error parsing user session:", error);
  //     }
  //   }
    
  //   // Alternative: check if userId is stored separately
  //   if (!userId) {
  //     userId = sessionStorage.getItem("userId");
  //   }
    
  //   if (!userId) {
  //     toast.error("Please login to view bookings");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const data = await getBookingsByUserId(parseInt(userId));
  //     setBookings(data || []);
  //   } catch (error) {
  //     toast.error("Failed to load bookings");
  //     console.error("Error fetching bookings:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookings = async () => {
  // UNIVERSAL user ID extraction
  let userId = null;
  
  // Check ALL possible locations
  const customerSession = sessionStorage.getItem("customer");
  if (customerSession) {
    try {
      const customerData = JSON.parse(customerSession);
      userId = customerData.id || customerData.userId || customerData.customerId;
    } catch (error) {
      console.error("Error parsing customer session:", error);
    }
  }
  
  // Check individual keys
  if (!userId) {
    userId = sessionStorage.getItem("customerId") || 
             sessionStorage.getItem("userId");
  }
  
  console.log("CustomerBookings: Found userId:", userId);
  
  if (!userId) {
    console.error("No user ID found in sessionStorage");
    toast.error("Please login to view bookings");
    navigate("/login");
    return;
  }

  try {
    setLoading(true);
    const data = await getBookingsByUserId(parseInt(userId));
    setBookings(data || []);
  } catch (error) {
    toast.error("Failed to load bookings");
    console.error("Error fetching bookings:", error);
  } finally {
    setLoading(false);
  }
};

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error("Failed to cancel booking: " + error.message);
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (activeTab) {
      case "upcoming":
        return (booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT') && 
               booking.checkInDate >= today;
      case "past":
        return booking.checkOutDate < today || booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
      case "pending":
        return booking.status === 'PENDING_PAYMENT';
      default:
        return true;
    }
  });

  const renderStatusBadge = (status) => {
    const statusConfig = {
      'PENDING_PAYMENT': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Payment' },
      'CONFIRMED': { color: 'bg-green-100 text-green-800', text: 'Confirmed' },
      'CANCELLED': { color: 'bg-red-100 text-red-800', text: 'Cancelled' },
      'COMPLETED': { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
      'CHECKED_IN': { color: 'bg-purple-100 text-purple-800', text: 'Checked In' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">Manage your hotel reservations</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Payment
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "past"
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past
            </button>
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {activeTab === "all" ? "No bookings found" : 
             activeTab === "upcoming" ? "No upcoming bookings" :
             activeTab === "pending" ? "No pending payments" : "No past bookings"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {activeTab === "all" ? "You haven't made any bookings yet." :
             activeTab === "upcoming" ? "You don't have any upcoming stays." :
             activeTab === "pending" ? "All your bookings are confirmed." : "No past stays found."}
          </p>
          {activeTab !== "all" && (
            <button
              onClick={() => setActiveTab("all")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all bookings
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => {
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            
            const isUpcoming = checkInDate > new Date();
            const isPast = checkOutDate < new Date();
            const isPendingPayment = booking.status === 'PENDING_PAYMENT';
            
            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  {/* Room Image */}
                  <div className="md:w-1/4">
                    <div className="h-48 md:h-full bg-gray-200 relative">
                      {booking.roomImage ? (
                        <img
                          src={booking.roomImage}
                          alt={booking.roomName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                          <span className="text-4xl text-gray-400">🏨</span>
                        </div>
                      )}
                      {isPendingPayment && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          PAYMENT REQUIRED
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{booking.roomName}</h3>
                        <p className="text-gray-600">{booking.roomCategory}</p>
                      </div>
                      <div className="text-right">
                        {renderStatusBadge(booking.status)}
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          ${booking.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">{checkInDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">{checkOutDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-medium">#{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-medium">{booking.numberOfGuests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking Date</p>
                        <p className="font-medium">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Special Requests:</p>
                        <p className="text-gray-800">{booking.specialRequests}</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {isPendingPayment && (
                        <button
                          onClick={() => navigate(`/payment/${booking.id}`)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Complete Payment
                        </button>
                      )}
                      
                      {(booking.status === 'PENDING_PAYMENT' || 
                        (booking.status === 'CONFIRMED' && isUpcoming)) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Cancel Booking
                        </button>
                      )}
                      
                      {booking.status === 'CONFIRMED' && isUpcoming && (
                        <button
                          onClick={() => window.open(`mailto:${booking.contactEmail}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Contact Hotel
                        </button>
                      )}
                      
                      {booking.roomId && (
                        <button
                          onClick={() => navigate(`/booking/${booking.roomId}`)}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                        >
                          Book Again
                        </button>
                      )}
                      
                      <button
                        onClick={() => navigate(`/booking/details/${booking.id}`)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}