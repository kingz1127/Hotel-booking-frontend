
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCw } from "lucide-react";
import { logoutAdmin } from "../../services/api.admin.js";
import { toast } from "react-toastify";
import RoomStatus from "./RoomStatus";
import { 
  Home,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    totalBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = () => {
    const admin = JSON.parse(sessionStorage.getItem("admin") || "null");
    const userRole = admin?.role;
    
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    const hasAdminToken = !!admin?.token;
    
    if (!isAdmin || !hasAdminToken) {
      console.log("❌ Invalid or missing admin session, redirecting to login");
      toast.error("Admin access required");
      navigate("/admin/login");
      return false;
    }
    
    return true;
  };


  const fetchDashboardData = async () => {
  try {
    setRefreshing(true);
    
    // Fetch all data from APIs with pagination parameters
    const [roomsRes, bookingsRes] = await Promise.all([
      fetch("http://localhost:8080/api/v1/rooms?page=0&size=100"),
      fetch("http://localhost:8080/api/v1/bookings?page=0&size=1000")
    ]);

    if (!roomsRes.ok || !bookingsRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const roomsData = await roomsRes.json();
    const bookingsData = await bookingsRes.json();

    // Handle paginated response
    const rooms = roomsData.content || roomsData;
    const bookings = bookingsData.content || bookingsData;

    setRooms(rooms);

    // Get today's date string in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    

    const paidBookings = bookings.filter(b => 
      b.status === "CONFIRMED" || 
      b.status === "CHECKED_IN" ||
      b.status === "CHECKED_OUT" ||
      b.status === "COMPLETED"
    );
    
    
    
    // Calculate today's check-ins (INCLUDE WALK-INS)
    const todayCheckIns = bookings.filter(b => {
      const checkInDate = new Date(b.checkInDate).toISOString().split('T')[0];
      const isActive = b.status === "CONFIRMED" || b.status === "CHECKED_IN";
      return checkInDate === today && isActive;
    }).length;

    // Calculate today's check-outs (INCLUDE WALK-INS)
    const todayCheckOuts = bookings.filter(b => {
      const checkOutDate = new Date(b.checkOutDate).toISOString().split('T')[0];
      const isActive = b.status === "CONFIRMED" || b.status === "CHECKED_IN";
      return checkOutDate === today && isActive;
    }).length;

    // Calculate pending payments (INCLUDE WALK-INS)
    const pendingPayments = bookings.filter(b => 
      b.status === "PENDING_PAYMENT"
    ).length;

    // ✅ FIXED: Calculate total revenue ONLY from paid/confirmed bookings
    const totalRevenue = paidBookings.reduce((sum, booking) => {
      const amount = booking.totalAmount || 0;
      console.log(`Adding ${booking.status} booking #${booking.id}: $${amount}`);
      return sum + amount;
    }, 0);
    
    console.log("💰 Total Revenue:", totalRevenue);

    const totalRooms = rooms.reduce((sum, room) => sum + (room.roomQuantity || 0), 0);
    
    // 2. Calculate total available rooms (sum of availableRooms)
    const totalAvailableRooms = rooms.reduce((sum, room) => sum + (room.availableRooms || 0), 0);
    
    // 3. Calculate occupied rooms (total - available)
    const occupiedRooms = Math.max(0, totalRooms - totalAvailableRooms);
    
    console.log("📊 Room Stats:", {
      totalRooms,
      totalAvailableRooms,
      occupiedRooms,
      roomTypes: rooms.length,
      roomsData: rooms.map(r => ({
        name: r.roomName,
        quantity: r.roomQuantity,
        available: r.availableRooms,
        booked: (r.roomQuantity || 0) - (r.availableRooms || 0)
      }))
    });

    // Get recent bookings (last 5) - INCLUDE WALK-INS
    const recentBookingsData = bookings
      .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
      .slice(0, 5);

    console.log("📊 Final Stats:", {
      totalRoomTypes: rooms.length,
      totalRooms,
      totalAvailableRooms,
      occupiedRooms,
      totalBookings: bookings.length,
      paidBookings: paidBookings.length,
      todayCheckIns,
      todayCheckOuts,
      pendingPayments,
      totalRevenue,
      walkInBookings: bookings.filter(b => b.isWalkIn || !b.userId).length
    });

    setStats({
      totalRooms: rooms.length, // This is room types count
      availableRooms: totalAvailableRooms,
      occupiedRooms: occupiedRooms,
      totalBookings: bookings.length,
      todayCheckIns,
      todayCheckOuts,
      pendingPayments,
      totalRevenue
    });

    setRecentBookings(recentBookingsData);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    toast.error("Failed to load dashboard data");
    setLoading(false);
  } finally {
    setRefreshing(false);
  }
};


  const handleLogout = () => {
    if (window.confirm("Log out from admin dashboard?")) {
      logoutAdmin();
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("adminToken");
      toast.success("Logged out successfully");
      navigate("/admin/login");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING_PAYMENT': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'CHECKED_IN': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#c1bd3f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600"> Hotel management </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Rooms</p>
                <p className="text-2xl font-bold mt-1">{stats.totalRooms}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.availableRooms} available • {stats.occupiedRooms} occupied
                  <br />
                  <span className="text-gray-400">
                    ({rooms.length} room types)
                  </span>
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Check-ins</p>
                <p className="text-2xl font-bold mt-1">{stats.todayCheckIns}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.todayCheckOuts} check-outs today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold mt-1">{stats.pendingPayments}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Awaiting payment confirmation
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  From all bookings
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Section */}
        <div className="mb-8">
          <RoomStatus />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <button
                onClick={() => navigate("/admin/bookings")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all bookings
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.createdAt || booking.bookingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.userName || booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.userEmail || booking.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.isWalkIn || !booking.userId ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            👤 Walk-in
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            💻 Online
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.roomName}</div>
                        <div className="text-xs text-gray-500">{booking.roomCategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">
                          {formatCurrency(booking.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/rooms")}
            className="bg-white p-6 rounded-xl shadow-sm border hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Rooms</h3>
                <p className="text-sm text-gray-500 mt-1">Add, edit, or remove rooms</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/bookings")}
            className="bg-white p-6 rounded-xl shadow-sm border hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">View Bookings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage all reservations</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/customers")}
            className="bg-white p-6 rounded-xl shadow-sm border hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Customers</h3>
                <p className="text-sm text-gray-500 mt-1">View customer information</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
            className="bg-white p-6 rounded-xl shadow-sm border hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Reports</h3>
                <p className="text-sm text-gray-500 mt-1">View analytics & reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}