import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Bed,
  LogOut,
  UserCheck,
  UserX,
  DollarSign,
  Plus,
} from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid.js";

export default function AdminBookings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]); // Store all bookings for continuity check
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      fetchBookings();
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [bookingTypeFilter, setBookingTypeFilter] = useState("ALL"); // ALL, USER, WALKIN

  // Status options - added NO_SHOW
  const statusOptions = [
    { value: "ALL", label: "All Status", color: "gray" },
    { value: "PENDING_PAYMENT", label: "Pending Payment", color: "yellow" },
    { value: "CONFIRMED", label: "Confirmed", color: "green" },
    { value: "CHECKED_IN", label: "Checked In", color: "blue" },
    { value: "CHECKED_OUT", label: "Checked Out", color: "purple" },
    { value: "NO_SHOW", label: "No Show", color: "orange" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
    { value: "COMPLETED", label: "Completed", color: "gray" },
  ];

  // Check if check-out date has passed
  const isCheckoutDatePassed = (checkOutDate) => {
    const now = new Date();
    const checkout = new Date(checkOutDate);

    // Set checkout time to 11:00 AM (typical hotel checkout time)
    checkout.setHours(11, 0, 0, 0);

    return now > checkout;
  };

  // More accurate check-out time check
  const isCheckoutTimePassed = (checkOutDate) => {
    const now = new Date();
    const checkout = new Date(checkOutDate);

    // Set checkout time to 12:00 PM (noon) - typical hotel checkout time
    checkout.setHours(12, 0, 0, 0);

    return now > checkout;
  };

  const getOverdueBookings = useCallback(() => {
    return bookings.filter(
      (booking) =>
        booking.status === "CHECKED_IN" &&
        isCheckoutDatePassed(booking.checkOutDate)
    );
  }, [bookings, isCheckoutDatePassed]);

  // Check for booking continuity (same customer, same room, consecutive dates)
  const checkBookingContinuity = useCallback((booking, allBookingsArray) => {
    const roomId = booking.roomId || (booking.room && booking.room.id);
    const customerEmail = booking.userEmail;

    if (!roomId || !customerEmail) return false;

    // Find future bookings for same customer in same room
    const futureBookings = allBookingsArray.filter((b) => {
      const bRoomId = b.roomId || (b.room && b.room.id);
      const bEmail = b.userEmail;
      const bCheckIn = new Date(b.checkInDate);
      const bookingCheckOut = new Date(booking.checkOutDate);

      // Check if same room and customer
      const sameRoomAndCustomer =
        bRoomId === roomId && bEmail === customerEmail;

      // Check if booking starts on or before current booking's checkout date
      // (allowing for same-day checkout/checkin)
      const isConsecutive = bCheckIn <= bookingCheckOut;

      // Exclude current booking and cancelled/no-show bookings
      const isValidBooking =
        b.id !== booking.id &&
        b.status !== "CANCELLED" &&
        b.status !== "NO_SHOW";

      return sameRoomAndCustomer && isConsecutive && isValidBooking;
    });

    return futureBookings.length > 0;
  }, []);

  // Replace the entire autoUpdateStatus function with this:
  const autoUpdateStatus = useCallback(
    (booking, allBookingsArray) => {
      if (!booking || !booking.status) return null;

      const now = new Date();
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);

      // Use the same checkout time as isCheckoutDatePassed (11:00 AM)
      const checkoutTime = new Date(checkOutDate);
      checkoutTime.setHours(11, 0, 0, 0);

      // Set check-in time to 3:00 PM (typical check-in time)
      const checkInTime = new Date(checkInDate);
      checkInTime.setHours(15, 0, 0, 0);

      const checkoutPassed = now > checkoutTime;
      const checkInTimePassed = now > checkInTime;

      const hasContinuity = checkBookingContinuity(booking, allBookingsArray);

      let newStatus = booking.status;

      switch (booking.status) {
        case "PENDING_PAYMENT":
          // If check-in time has passed, mark as CANCELLED
          if (checkInTimePassed) {
            newStatus = "CANCELLED";
          }
          break;

        case "CONFIRMED":
          // If check-in time has passed
          if (checkInTimePassed) {
            if (hasContinuity) {
              // Customer might be in a previous booking that hasn't checked out yet
              // Check if they have a CHECKED_IN booking in the same room
              const checkedInBooking = allBookingsArray.find(
                (b) =>
                  (b.roomId || (b.room && b.room.id)) ===
                    (booking.roomId || (booking.room && booking.room.id)) &&
                  b.userEmail === booking.userEmail &&
                  b.status === "CHECKED_IN" &&
                  new Date(b.checkOutDate) >= checkInDate
              );

              if (checkedInBooking) {
                newStatus = "CHECKED_IN";
              } else {
                newStatus = "NO_SHOW";
              }
            } else {
              newStatus = "NO_SHOW";
            }
          }
          // If it's check-in day but before 3 PM, don't change status yet
          else if (
            now.toDateString() === checkInDate.toDateString() &&
            now < checkInTime
          ) {
            // Still within check-in window
            // Do nothing
          }
          break;

        case "CHECKED_IN":
          // If checkout time has passed and no continuity booking
          if (checkoutPassed && !hasContinuity) {
            newStatus = "CHECKED_OUT";
          }
          break;

        case "CHECKED_OUT":
          // If checked out more than 24 hours ago, mark as COMPLETED
          if (checkoutPassed) {
            const hoursSinceCheckout = Math.floor(
              (now - checkoutTime) / (1000 * 60 * 60)
            );
            if (hoursSinceCheckout > 24) {
              newStatus = "COMPLETED";
            }
          }
          break;

        case "NO_SHOW":
          // If customer shows up later, they can be checked in
          if (checkoutPassed) {
            // Too late, mark as CANCELLED
            newStatus = "CANCELLED";
          }
          break;

        default:
          break;
      }

      return newStatus !== booking.status ? newStatus : null;
    },
    [checkBookingContinuity]
  );

  useEffect(() => {
    checkAdminAccess();
    fetchBookings();
  }, [pagination.page]);

  // Auto-refresh status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (allBookings.length > 0) {
        updateAutoStatuses();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [allBookings]);

  const updateAutoStatuses = async () => {
    try {
      const updatePromises = [];
      const updatedBookings = [...bookings];
      const updatedAllBookings = [...allBookings];
      let hasChanges = false;
      let roomsReleased = 0;

      for (let i = 0; i < updatedBookings.length; i++) {
        const booking = updatedBookings[i];
        const oldStatus = booking.status;
        const newStatus = autoUpdateStatus(booking, updatedAllBookings);

        if (newStatus) {
          console.log(
            `Auto-updating booking #${booking.id}: ${oldStatus} → ${newStatus}`
          );

          // Update in local state
          updatedBookings[i].status = newStatus;

          // Update in allBookings array
          const allBookingIndex = updatedAllBookings.findIndex(
            (b) => b.id === booking.id
          );
          if (allBookingIndex !== -1) {
            updatedAllBookings[allBookingIndex].status = newStatus;
          }

          hasChanges = true;

          // ✅ Track if room is being released
          const isReleasing =
            (oldStatus === "CONFIRMED" || oldStatus === "CHECKED_IN") &&
            (newStatus === "CHECKED_OUT" ||
              newStatus === "COMPLETED" ||
              newStatus === "CANCELLED");

          if (isReleasing) {
            roomsReleased++;
          }

          // Add to update promises
          updatePromises.push(
            updateBookingStatusInBackend(booking.id, newStatus, true).catch(
              (error) => {
                console.error(`Failed to update booking ${booking.id}:`, error);
                return false;
              }
            )
          );
        }
      }

      if (hasChanges) {
        // Update state
        setBookings(updatedBookings);
        setAllBookings(updatedAllBookings);
        setFilteredBookings(updatedBookings);

        // Show toast if any updates were made
        const successfulUpdates = (await Promise.all(updatePromises)).filter(
          (result) => result === true
        ).length;

        if (successfulUpdates > 0) {
          toast.info(
            <div>
              <p className="font-bold">
                Auto-updated {successfulUpdates} booking(s)
              </p>
              {roomsReleased > 0 && (
                <p className="text-sm">{roomsReleased} room(s) now available</p>
              )}
            </div>,
            { autoClose: 3000 }
          );

          // ✅ Refresh bookings if rooms were released
          if (roomsReleased > 0) {
            console.log("✅ Rooms released during auto-update, refreshing...");
            setTimeout(() => {
              fetchBookings();
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.error("Error auto-updating statuses:", error);
    }
  };

  const triggerManualAutoUpdate = async () => {
    try {
      toast.info("Running auto-status updates...", { autoClose: 2000 });
      await updateAutoStatuses();
    } catch (error) {
      console.error("Manual auto-update failed:", error);
      toast.error("Auto-update failed");
    }
  };

  const checkAdminAccess = () => {
    const admin = JSON.parse(sessionStorage.getItem("admin") || "null");
    const userRole = admin?.role;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    const hasAdminToken = !!admin?.token;

    if (!isAdmin || !hasAdminToken) {
      toast.error("Admin access required");
      navigate("/admin/login");
      return false;
    }
    return true;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const admin = JSON.parse(sessionStorage.getItem("admin") || "null");

      const response = await fetch(
        `http://localhost:8080/api/v1/bookings?page=${
          pagination.page - 1
        }&size=${pagination.limit}`,
        {
          headers: {
            Authorization: admin?.token, // ✅ ADD THIS
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const bookingsData = data.content || data.bookings || data.data || data;
      const totalElements =
        data.totalElements || data.total || bookingsData.length;
      const totalPages =
        data.totalPages || Math.ceil(totalElements / pagination.limit);

      if (Array.isArray(bookingsData)) {
        // Also fetch all bookings for continuity check
        const allBookingsResponse = await fetch(
          `http://localhost:8080/api/v1/bookings?page=0&size=1000`
        );
        const allBookingsData = await allBookingsResponse.json();
        const allBookingsArray =
          allBookingsData.content ||
          allBookingsData.bookings ||
          allBookingsData.data ||
          allBookingsData;

        setAllBookings(Array.isArray(allBookingsArray) ? allBookingsArray : []);

        // Apply auto status updates
        const updatedBookings = bookingsData.map((booking) => {
          const newStatus = autoUpdateStatus(
            booking,
            Array.isArray(allBookingsArray) ? allBookingsArray : []
          );
          return newStatus ? { ...booking, status: newStatus } : booking;
        });

        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
        setPagination((prev) => ({
          ...prev,
          total: totalElements,
          totalPages: totalPages,
        }));
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);

      try {
        const { getAllBookings } = await import(
          "../../services/api.Booking.js"
        );
        const result = await getAllBookings();

        let bookingsArray = [];
        if (Array.isArray(result)) {
          bookingsArray = result;
        } else if (result.data && Array.isArray(result.data)) {
          bookingsArray = result.data;
        } else if (result.bookings && Array.isArray(result.bookings)) {
          bookingsArray = result.bookings;
        }

        setAllBookings(bookingsArray);

        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedBookings = bookingsArray.slice(startIndex, endIndex);

        // Apply auto status updates
        const updatedBookings = paginatedBookings.map((booking) => {
          const newStatus = autoUpdateStatus(booking, bookingsArray);
          return newStatus ? { ...booking, status: newStatus } : booking;
        });

        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
        setPagination((prev) => ({
          ...prev,
          total: bookingsArray.length,
          totalPages: Math.ceil(bookingsArray.length / prev.limit),
        }));

        toast.info("Using fallback data fetching method");
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        toast.error("Failed to load bookings data");
        setBookings([]);
        setFilteredBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatusInBackend = async (
    bookingId,
    newStatus,
    silent = false
  ) => {
    try {
      const admin = JSON.parse(sessionStorage.getItem("admin") || "null");

      console.log("=== API REQUEST DETAILS ===");
      console.log("Booking ID:", bookingId);
      console.log("New Status:", newStatus);
      console.log("Admin Token:", admin?.token ? "Present" : "Missing");
      console.log(
        "Endpoint:",
        `http://localhost:8080/api/v1/bookings/${bookingId}/status`
      );
      console.log("Request Body:", { status: newStatus });

      const response = await fetch(
        `http://localhost:8080/api/v1/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: admin?.token,
            // Authorization: `Bearer ${admin?.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Response Data:", responseData);

        // ✅ Check if room availability was updated
        if (responseData.room) {
          console.log("Room availability updated:", {
            roomId: responseData.room.id,
            availableRooms: responseData.room.availableRooms,
            totalRooms: responseData.room.roomQuantity,
          });
        }

        if (!silent) {
          toast.success("Booking status updated successfully");
        }
        return true;
      } else {
        // Try to get error message from response
        let errorMessage = "Failed to update status";
        try {
          const errorData = await response.json();
          console.log("❌ Error Response:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.log("❌ Error Text:", errorText);
          errorMessage = errorText || errorMessage;
        }

        throw new Error(`${response.status}: ${errorMessage}`);
      }
    } catch (error) {
      console.error("❌ Error updating booking status:", error);
      if (!silent) {
        toast.error(`Failed to update booking status: ${error.message}`);
      }
      return false;
    }
  };

  // ✅ FIXED: Update booking status with room availability refresh
  const updateBookingStatus = async (bookingId, newStatus) => {
    const oldBooking = bookings.find((b) => b.id === bookingId);
    const oldStatus = oldBooking?.status;

    if (
      !window.confirm(
        `Change booking status to ${newStatus.replace("_", " ")}?`
      )
    ) {
      return;
    }

    console.log("=== STATUS UPDATE ===");
    console.log(`Booking #${bookingId}: ${oldStatus} → ${newStatus}`);

    const success = await updateBookingStatusInBackend(bookingId, newStatus);

    if (success) {
      // Update local state
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );

      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);

      // Also update in allBookings for continuity checks
      const updatedAllBookings = allBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );

      setAllBookings(updatedAllBookings);

      // ✅ CRITICAL FIX: Check if room should be released
      const shouldReleaseRoom =
        (oldStatus === "CONFIRMED" || oldStatus === "CHECKED_IN") &&
        (newStatus === "CHECKED_OUT" ||
          newStatus === "COMPLETED" ||
          newStatus === "CANCELLED");

      if (shouldReleaseRoom) {
        console.log(
          "✅ Room should be released - refetching bookings and rooms"
        );

        // Show success message
        toast.success(
          <div>
            <p className="font-bold">Status Updated!</p>
            <p className="text-sm">Room is now available for new bookings</p>
          </div>,
          { autoClose: 3000 }
        );

        // ✅ Refresh the bookings list after a short delay
        // This allows the backend to update room availability
        setTimeout(() => {
          fetchBookings();
        }, 500);
      } else {
        // Check for auto-updates after manual status change
        const updatedBooking = updatedBookings.find((b) => b.id === bookingId);
        if (updatedBooking) {
          const autoStatus = autoUpdateStatus(
            updatedBooking,
            updatedAllBookings
          );
          if (autoStatus && autoStatus !== newStatus) {
            setTimeout(() => {
              toast.info(
                `Status will auto-update to ${autoStatus.replace(
                  "_",
                  " "
                )} based on dates`
              );
            }, 500);
          }
        }
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          (booking.userName && booking.userName.toLowerCase().includes(term)) ||
          (booking.userEmail &&
            booking.userEmail.toLowerCase().includes(term)) ||
          (booking.id && booking.id.toString().includes(term)) ||
          (booking.roomName && booking.roomName.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const bookingDate = booking.checkInDate || booking.bookingDate;
        return bookingDate === dateFilter;
      });
    }

    // NEW: Apply booking type filter
    if (bookingTypeFilter === "USER") {
      filtered = filtered.filter((booking) => booking.userId);
    } else if (bookingTypeFilter === "WALKIN") {
      filtered = filtered.filter((booking) => !booking.userId);
    }

    // Existing overdue filter
    if (overdueFilter) {
      filtered = filtered.filter(
        (booking) =>
          booking.status === "CHECKED_IN" &&
          isCheckoutDatePassed(booking.checkOutDate)
      );
    }

    setFilteredBookings(filtered);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.limit),
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setDateFilter("");
    setOverdueFilter(false);
    setFilteredBookings(bookings);
    setPagination((prev) => ({
      ...prev,
      page: 1,
      total: bookings.length,
      totalPages: Math.ceil(bookings.length / prev.limit),
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING_PAYMENT":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      case "CHECKED_IN":
        return <UserCheck className="h-4 w-4" />;
      case "CHECKED_OUT":
        return <LogOut className="h-4 w-4" />;
      case "NO_SHOW":
        return <UserX className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CHECKED_IN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CHECKED_OUT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "NO_SHOW":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get available status options for a booking
  const getAvailableStatusOptions = (booking) => {
    const baseOptions = [
      { value: "PENDING_PAYMENT", label: "Pending Payment" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "CHECKED_IN", label: "Checked In" },
      { value: "CHECKED_OUT", label: "Checked Out" },
      { value: "NO_SHOW", label: "No Show" },
      { value: "CANCELLED", label: "Cancelled" },
    ];

    // Remove current status
    return baseOptions.filter((option) => option.value !== booking.status);
  };

  // Check if booking should show continuity info
  const getContinuityInfo = (booking) => {
    const hasContinuity = checkBookingContinuity(booking, allBookings);
    const checkoutPassed = isCheckoutDatePassed(booking.checkOutDate);

    if (booking.status === "CHECKED_IN" && checkoutPassed && !hasContinuity) {
      return {
        type: "auto_checkout",
        message: "Will auto-checkout at end of day",
      };
    }

    if (booking.status === "CHECKED_IN" && hasContinuity) {
      return {
        type: "continuity",
        message: "Customer has consecutive booking",
      };
    }

    if (
      booking.status === "CONFIRMED" &&
      new Date() > new Date(booking.checkInDate) &&
      !hasContinuity
    ) {
      return { type: "no_show_risk", message: "Risk of No Show" };
    }

    return null;
  };

  // Render the rest of the component (same as before with status select)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as before */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Bookings Management
              </h1>
              <p className="text-gray-600">
                Manage all hotel reservations with auto-status updates
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Add this button */}
              <LiquidButton
                onClick={() => navigate("/admin/walk-in-booking")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Book a Room
              </LiquidButton>

              <button
                onClick={() =>
                  navigate("/admin/dashboard", {
                    replace: true,
                    state: { refresh: true },
                  })
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section - Same as before */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, booking ID, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  {showFilters && <X className="h-4 w-4" />}
                </button>

                <button
                  onClick={applyFilters}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>

                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </button>

                <button
                  onClick={triggerManualAutoUpdate}
                  className="flex items-center gap-2 px-4 py-2.5 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50"
                  title="Run auto-status updates now"
                >
                  <RefreshCw className="h-5 w-5" />
                  Auto-Update Now
                </button>

                <button
                  onClick={() => setOverdueFilter(!overdueFilter)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
                    overdueFilter
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "border border-red-300 text-red-700 hover:bg-red-50"
                  }`}
                  title="Show overdue checkouts"
                >
                  <Clock className="h-5 w-5" />
                  {overdueFilter ? "Hide Overdue" : "Show Overdue"}
                  {overdueFilter && (
                    <span className="bg-white text-red-600 text-xs px-2 py-0.5 rounded-full">
                      {getOverdueBookings().length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchBookings}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">All Bookings</h2>
                <p className="text-sm text-gray-500">
                  Showing {filteredBookings.length} of {pagination.total}{" "}
                  bookings
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Auto-status updates enabled
                  </span>
                </p>
              </div>

              {/* ... (same pagination controls) ... */}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="text-gray-500 mt-2">
                  {bookings.length === 0
                    ? "No bookings available"
                    : "No bookings match your filters"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Room & Dates
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const continuityInfo = getContinuityInfo(booking);
                    const isCheckoutDue =
                      booking.status === "CHECKED_IN" &&
                      isCheckoutDatePassed(booking.checkOutDate);

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900">
                            #{booking.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(
                              booking.createdAt || booking.bookingDate
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userName}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Mail className="h-3 w-3" />
                                {booking.userEmail}
                              </div>
                              {booking.phoneNumber && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Phone className="h-3 w-3" />
                                  {booking.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.roomName}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            {booking.roomCategory}
                          </div>

                          {booking.assignedRoomNumber && (
                            <div className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">
                              Room #{booking.assignedRoomNumber}
                            </div>
                          )}
                          <div className="text-xs text-gray-700">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(booking.checkInDate)} →{" "}
                            {formatDate(booking.checkOutDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.ceil(
                              (new Date(booking.checkOutDate) -
                                new Date(booking.checkInDate)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </div>
                          {isCheckoutDue && (
                            <div className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Check-out was {formatDate(booking.checkOutDate)}
                              <span className="ml-1 px-1 bg-red-100 text-red-700 rounded text-xs">
                                Will auto-checkout
                              </span>
                            </div>
                          )}

                          {booking.status === "CHECKED_IN" &&
                            !isCheckoutDue && (
                              <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Currently checked in
                              </div>
                            )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Paid via {booking.paymentMethod || "Credit Card"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status?.replace("_", " ") || "Unknown"}
                            </span>

                            {/* Status select dropdown */}
                            {/* Update the select dropdown */}
                            <select
                              key={`status-select-${booking.id}-${booking.status}`} // Add key to force re-render
                              value={booking.status}
                              onChange={(e) =>
                                updateBookingStatus(booking.id, e.target.value)
                              }
                              disabled={booking.status === "CANCELLED"}
                              className={`text-xs px-2 py-1 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                booking.status === "CANCELLED"
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {statusOptions
                                .filter((option) => option.value !== "ALL")
                                .map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                            </select>

                            {/* Continuity info */}
                            {continuityInfo && (
                              <div
                                className={`text-xs px-2 py-1 rounded ${
                                  continuityInfo.type === "continuity"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : continuityInfo.type === "auto_checkout"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-orange-50 text-orange-700 border border-orange-200"
                                }`}
                              >
                                {continuityInfo.message}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewBookingDetails(booking)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>

                            {booking.specialRequest && (
                              <button
                                onClick={() => {
                                  alert(
                                    `Special Request: ${booking.specialRequest}`
                                  );
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 text-sm"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Request
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}

          {filteredBookings.length > 0 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} entries
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    value={pagination.limit}
                    onChange={(e) =>
                      setPagination((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value),
                        page: 1,
                      }))
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>

                  <div className="flex gap-1 ml-4">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded text-sm ${
                              pagination.page === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    {pagination.totalPages > 5 && (
                      <>
                        <span className="px-2 py-1">...</span>
                        <button
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          className={`px-3 py-1 rounded text-sm ${
                            pagination.page === pagination.totalPages
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal - Enhanced with auto-status info */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Booking Details</h2>
                <p className="text-sm text-gray-500">
                  ID: #{selectedBooking.id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Auto-Status Info Banner */}
                {(() => {
                  const continuityInfo = getContinuityInfo(selectedBooking);
                  if (continuityInfo) {
                    return (
                      <div
                        className={`p-3 rounded-lg ${
                          continuityInfo.type === "continuity"
                            ? "bg-green-50 border border-green-200"
                            : continuityInfo.type === "auto_checkout"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-orange-50 border border-orange-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {continuityInfo.type === "continuity" ? (
                            <Bed className="h-5 w-5 text-green-600" />
                          ) : continuityInfo.type === "auto_checkout" ? (
                            <LogOut className="h-5 w-5 text-blue-600" />
                          ) : (
                            <UserX className="h-5 w-5 text-orange-600" />
                          )}
                          <span className="font-medium">
                            {continuityInfo.message}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Status Management Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status Management
                  </h3>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Status</p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {getStatusIcon(selectedBooking.status)}
                      <span className="font-medium">
                        {selectedBooking.status?.replace("_", " ") || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* In the modal status management section */}
                  {selectedBooking.status !== "CANCELLED" && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Update Status
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getAvailableStatusOptions(selectedBooking).map(
                          (option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateBookingStatus(
                                  selectedBooking.id,
                                  option.value
                                );
                                setShowDetailsModal(false);
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                option.value === "CHECKED_IN"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  : option.value === "CHECKED_OUT"
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                  : option.value === "NO_SHOW"
                                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                  : option.value === "CANCELLED"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedBooking.status === "CANCELLED" && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 font-medium">
                        ⚠️ This booking has been cancelled and cannot be
                        modified.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      <strong>Note:</strong> Status will auto-update based on
                      dates. "Checked In" will auto-change to "Checked Out"
                      after checkout date, unless customer has rebooked the same
                      room.
                    </p>
                  </div>
                </div>

                {/* Customer Information - Same as before */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedBooking.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedBooking.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {formatDate(
                          selectedBooking.createdAt ||
                            selectedBooking.bookingDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Information - Same as before */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Room Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Room Name</p>
                      <p className="font-medium">{selectedBooking.roomName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">
                        {selectedBooking.roomCategory}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-in Date</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.checkInDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out Date</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.checkOutDate)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">
                        {Math.ceil(
                          (new Date(selectedBooking.checkOutDate) -
                            new Date(selectedBooking.checkInDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        nights
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information - Same as before */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(selectedBooking.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">
                        {selectedBooking.paymentMethod || "Credit Card"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedBooking.status
                        )}`}
                      >
                        {selectedBooking.status?.replace("_", " ") || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Request - Same as before */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Special Request
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-gray-700">
                      {selectedBooking.specialRequest ||
                        "No special requests were made for this booking."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
