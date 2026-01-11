// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   ArrowLeft,
//   Search,
//   Calendar,
//   User,
//   Mail,
//   Phone,
//   CreditCard,
//   DollarSign,
//   CheckCircle,
//   XCircle,
//   Home,
//   Users,
//   MessageSquare,
//   Plus,
//   Minus,
// } from "lucide-react";
// import { LiquidButton } from "@/components/ui/liquid";
// import PaymentDetailsForm from "./component/PaymentDetailsForm";

// import { emergencyFixRoom, emergencyFixAllRooms,  forceFixRoomAvailability } from "../../services/api.Booking";

// export default function WalkInBooking() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

//   // Form states
//   const [customerInfo, setCustomerInfo] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     idType: "PASSPORT",
//     idNumber: "",
//   });

//   const [bookingDetails, setBookingDetails] = useState({
//     checkInDate: "",
//     checkOutDate: "",
//     numberOfGuests: 1,
//     specialRequests: "",
//     paymentMethod: "CASH",
//     paymentStatus: "PAID",
//   });

//   const [partialAmount, setPartialAmount] = useState(0);
//   const [transactionId, setTransactionId] = useState("");
//   const [paymentNotes, setPaymentNotes] = useState("");

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("ALL");

//   useEffect(() => {
//     const canProceed = checkAdminAccess();
//   if (canProceed) {
//     fetchAvailableRooms();
//   }
//   }, []);


//   // ✅ FIXED: Proper admin authentication check
// const checkAdminAccess = () => {
//   try {
//     let admin = JSON.parse(sessionStorage.getItem("admin") || "null");
    
//     // Fallback to localStorage if not in sessionStorage
//     if (!admin || !admin.token) {
//       console.log("Trying localStorage...");
//       admin = JSON.parse(localStorage.getItem("admin") || "null");
      
//       if (admin && admin.token) {
//         sessionStorage.setItem("admin", JSON.stringify(admin));
//         console.log("Admin restored from localStorage");
//       }
//     }

//     const userRole = admin?.role;
//     const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
//     const token = admin?.token;

//     console.log("Admin access check:", {
//       hasAdmin: !!admin,
//       role: userRole,
//       isAdmin: isAdmin,
//       adminId: admin?.id,
//       tokenExists: !!token
//     });

//     if (!isAdmin || !token) {
//       console.warn("Admin access check failed");
//       toast.error("Admin access required. Please login.");
//       navigate("/admin/login");
//       return false;
//     }

//     console.log("✅ Admin access granted");
//     return true;
    
//   } catch (error) {
//     console.error("Error checking admin access:", error);
//     toast.error("Authentication error. Please login again.");
//     navigate("/admin/login");
//     return false;
//   }
// };



// const fetchAvailableRooms = async () => {
//   try {
//     setLoading(true);
//     console.log("🔄 Fetching available rooms...");

//     const url = `http://localhost:8080/api/v1/rooms?page=0&size=100`;
//     console.log("Calling:", url);

//     const response = await fetch(url);
//     console.log("Response status:", response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.log("Error response:", errorText);
//       throw new Error(`Failed to fetch rooms: ${response.status} ${errorText}`);
//     }

//     const data = await response.json();
//     console.log("API response:", data);

//     let roomsData = [];
//     if (data.content && Array.isArray(data.content)) {
//       roomsData = data.content;
//       console.log(`Found ${roomsData.length} rooms in 'content' array`);
//     } else if (Array.isArray(data)) {
//       roomsData = data;
//       console.log(`Found ${roomsData.length} rooms in array`);
//     } else {
//       console.warn("Unexpected response format:", data);
//       roomsData = [];
//     }

    
// const roomsWithCorrectedAvailability = roomsData.map(room => {
//   const hasQuantity = room.roomQuantity > 0;
//   const availableRoomsCount = room.availableRooms || 0;
//   const isAvailableFlag = room.isAvailable !== false;
  
 
//   const isLogicallyWrong = availableRoomsCount > 0 && !isAvailableFlag;
  
//   const isActuallyAvailable = availableRoomsCount > 0;
  
//   return {
//     ...room,
//     _needsFix: isLogicallyWrong,
//     _isLogicallyWrong: isLogicallyWrong,
//     _shouldBeAvailable: hasQuantity,
//     _actualAvailability: isActuallyAvailable,
//     _availableRoomsCount: availableRoomsCount,
//     _status: isActuallyAvailable ? 'AVAILABLE' : 'FULLY_BOOKED'
//   };
// });

//     // Show ALL rooms with quantity > 0, even if availableRooms is 0
//     const roomsToShow = roomsWithCorrectedAvailability.filter(room => 
//       room.roomQuantity > 0
//     );

//     // **FIXED**: Only show warning for logically wrong rooms
//     const logicallyWrongRooms = roomsToShow.filter(room => room._isLogicallyWrong);
    
//     console.log(
//       `✅ Showing ${roomsToShow.length} rooms with inventory ` +
//       `(${logicallyWrongRooms.length} have logical errors, ` +
//       `${roomsToShow.filter(r => r._actualAvailability).length} are available for booking)`
//     );

//     // Log detailed breakdown
//     roomsToShow.forEach(room => {
//       console.log(
//         `Room ${room.id} - ${room.roomName}: ` +
//         `Status: ${room._status}, ` +
//         `Available Rooms: ${room._availableRoomsCount}, ` +
//         `Needs Fix: ${room._needsFix}`
//       );
//     });

//     setRooms(roomsToShow);
//     setFilteredRooms(roomsToShow);

//     if (roomsToShow.length === 0) {
//       toast.info(
//         <div>
//           <p>No rooms in inventory.</p>
//           <p className="text-sm">
//             Please add rooms in room management.
//           </p>
//         </div>
//       );
//     } else {
//       // **FIXED**: Only show warning for logically wrong rooms
//       if (logicallyWrongRooms.length > 0) {
//         toast.warning(
//           <div>
//             <p className="font-bold">⚠️ Some rooms have availability logic errors</p>
//             <p className="text-sm mt-1">
//               Rooms have inventory but isAvailable flag is false.
//             </p>
//             <p className="text-sm">
//               Click <span className="font-bold">🔧 Fix</span> to correct.
//             </p>
//           </div>,
//           { autoClose: 8000 }
//         );
//       } else {
//         // Show summary of available rooms
//         const availableForBooking = roomsToShow.filter(room => room._actualAvailability).length;
//         const fullyBooked = roomsToShow.filter(room => room._status === 'FULLY_BOOKED').length;
//         const totalRooms = roomsToShow.reduce((sum, room) => sum + room.roomQuantity, 0);
//         const totalAvailable = roomsToShow.reduce((sum, room) => sum + room._availableRoomsCount, 0);
        
//         toast.info(
//           <div>
//             <p className="font-medium">📊 Room Availability Summary</p>
//             <p className="text-sm mt-1">
//               {availableForBooking} room categories available for booking
//             </p>
//             <p className="text-sm">
//               {fullyBooked} room categories fully booked
//             </p>
//             <p className="text-sm">
//               Total available rooms: {totalAvailable} of {totalRooms}
//             </p>
//           </div>,
//           { autoClose: 5000 }
//         );
//       }
//     }

//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//     toast.error(
//       <div>
//         <p>Failed to load rooms</p>
//         <p className="text-sm">{error.message}</p>
//       </div>
//     );
//   } finally {
//     setLoading(false);
//   }
// };



//   const handleSearch = () => {
//     let filtered = [...rooms];

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (room) =>
//           room.roomName?.toLowerCase().includes(term) ||
//           room.roomCategory?.toLowerCase().includes(term) ||
//           room.description?.toLowerCase().includes(term)
//       );
//     }

//     if (selectedCategory !== "ALL") {
//       filtered = filtered.filter(
//         (room) => room.roomCategory === selectedCategory
//       );
//     }

//     // Filter by discount
//     if (showDiscountedOnly) {
//       filtered = filtered.filter((room) => room.roomDiscount > 0);
//     }

//     setFilteredRooms(filtered);
//   };

//   const handleSelectRoom = (room) => {
//     setSelectedRoom(room);
//     setStep(2);
//   };

  
//   const handleCustomerInfoChange = (e) => {
//   const { name, value } = e.target;
  
//   // Phone number validation - only allow numbers and basic formatting
//   if (name === "phone") {
//     // Remove all non-numeric characters except +, -, (, ), and space
//     let cleanedValue = value.replace(/[^\d+\-()\s]/g, '');
    
//     // Limit to 15 characters max
//     if (cleanedValue.length > 15) {
//       cleanedValue = cleanedValue.substring(0, 15);
//     }
    
//     setCustomerInfo((prev) => ({ ...prev, [name]: cleanedValue }));
//   } else {
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));
//   }
// };

//   const handleBookingDetailsChange = (e) => {
//     const { name, value } = e.target;
//     setBookingDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   const calculateTotalAmount = () => {
//     if (
//       !selectedRoom ||
//       !bookingDetails.checkInDate ||
//       !bookingDetails.checkOutDate
//     )
//       return 0;

//     const checkIn = new Date(bookingDetails.checkInDate);
//     const checkOut = new Date(bookingDetails.checkOutDate);
//     const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

//     // Calculate discounted price
//     const originalPrice = selectedRoom.roomPrice || 0;
//     const discount = selectedRoom.roomDiscount || 0;

//     let pricePerNight = originalPrice;
//     if (discount > 0) {
//       pricePerNight = originalPrice * (1 - discount / 100);
//     }

//     return nights * pricePerNight;
//   };

//   // Add a helper function to get discounted price
//   const getDiscountedPrice = (room) => {
//     if (!room) return 0;

//     const originalPrice = room.roomPrice || 0;
//     const discount = room.roomDiscount || 0;

//     if (discount > 0) {
//       return originalPrice * (1 - discount / 100);
//     }

//     return originalPrice;
//   };

//   // Add a helper function to format price with discount
//   const formatPriceWithDiscount = (room) => {
//     const originalPrice = room.roomPrice || 0;
//     const discount = room.roomDiscount || 0;

//     if (discount > 0) {
//       const discountedPrice = originalPrice * (1 - discount / 100);
//       return (
//         <div className="flex flex-col items-end">
//           <span className="text-sm font-bold text-green-600">
//             {formatCurrency(discountedPrice)}/night
//           </span>
//           <div className="flex items-center gap-1">
//             <span className="text-xs text-gray-500 line-through">
//               {formatCurrency(originalPrice)}
//             </span>
//             <span className="text-xs font-bold text-red-600">-{discount}%</span>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <span className="text-sm font-bold text-green-600">
//         {formatCurrency(originalPrice)}/night
//       </span>
//     );
//   };

// // Add this to your WalkInBooking component
// const diagnoseRoomAvailability = async (roomId = 1) => {
//   try {
//     console.log(`🔍 Diagnosing room #${roomId} availability...`);
    
//     // First, get room details
//     const roomResponse = await fetch(`${API_URL}/rooms/${roomId}`);
//     if (!roomResponse.ok) throw new Error("Failed to fetch room");
//     const room = await roomResponse.json();
    
//     // Get active bookings for this room
//     let activeBookings = [];
//     try {
//       const activeResponse = await fetch(`${API_URL}/bookings/room/${roomId}/active`);
//       if (activeResponse.ok) {
//         const data = await activeResponse.json();
//         activeBookings = data.activeBookings || [];
//       }
//     } catch (error) {
//       console.warn("Could not fetch active bookings:", error);
//     }
    
//     // Get ALL bookings for this room
//     const bookingsResponse = await fetch(`${API_URL}/bookings`);
//     if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
//     const allBookings = await bookingsResponse.json();
    
//     const roomBookings = Array.isArray(allBookings) 
//       ? allBookings.filter(b => b.roomId === roomId)
//       : [];
    
//     const today = new Date().toISOString().split('T')[0];
    
//     console.log("=== ROOM DIAGNOSIS ===");
//     console.log(`Room: ${room.roomName} (ID: ${room.id})`);
//     console.log(`Total Quantity: ${room.roomQuantity}`);
//     console.log(`Current Available: ${room.availableRooms}`);
//     console.log(`Is Available: ${room.isAvailable}`);
    
//     console.log("\n=== ACTIVE BOOKINGS ===");
//     activeBookings.forEach((booking, index) => {
//       console.log(
//         `Active Booking ${index + 1}: ` +
//         `ID: ${booking.id}, ` +
//         `Status: ${booking.status}, ` +
//         `Dates: ${booking.checkInDate} to ${booking.checkOutDate}, ` +
//         `Customer: ${booking.customerName}`
//       );
//     });
    
//     console.log("\n=== ALL BOOKINGS FOR THIS ROOM ===");
//     roomBookings.forEach((booking, index) => {
//       const isPast = new Date(booking.checkOutDate) < new Date(today);
//       console.log(
//         `Booking ${index + 1}: ` +
//         `ID: ${booking.id}, ` +
//         `Status: ${booking.status}, ` +
//         `Dates: ${booking.checkInDate} to ${booking.checkOutDate}, ` +
//         `Past: ${isPast}`
//       );
//     });
    
//     // Calculate what availability SHOULD be
//     const calculatedAvailable = Math.max(0, room.roomQuantity - activeBookings.length);
//     const needsFix = room.availableRooms !== calculatedAvailable;
    
//     console.log("\n=== CALCULATION ===");
//     console.log(`Total Rooms: ${room.roomQuantity}`);
//     console.log(`Active Bookings: ${activeBookings.length}`);
//     console.log(`Should be available: ${room.roomQuantity} - ${activeBookings.length} = ${calculatedAvailable}`);
//     console.log(`Currently available: ${room.availableRooms}`);
//     console.log(`Needs fix: ${needsFix}`);
    
//     toast.info(
//       <div>
//         <p className="font-bold">🔍 Room Diagnosis</p>
//         <p className="text-sm mt-1">
//           Room: {room.roomName}
//         </p>
//         <p className="text-sm">
//           Total: {room.roomQuantity} | Current: {room.availableRooms}
//         </p>
//         <p className="text-sm">
//           Active bookings: {activeBookings.length}
//         </p>
//         <p className="text-sm font-bold">
//           Should be: {room.roomQuantity} - {activeBookings.length} = {calculatedAvailable}
//         </p>
//         <p className="text-sm font-bold mt-1">
//           {needsFix ? "⚠️ NEEDS FIX" : "✅ CORRECT"}
//         </p>
//       </div>,
//       { autoClose: 10000 }
//     );
    
//     return {
//       room,
//       activeBookings,
//       roomBookings,
//       calculatedAvailable,
//       needsFix
//     };
    
//   } catch (error) {
//     console.error("Diagnosis failed:", error);
//     toast.error("Diagnosis failed: " + error.message);
//     return null;
//   }
// };


// const handleSubmitBooking = async () => {
//   if (!validateForm()) return;

//   try {
//     setLoading(true);
    
//     // Get admin from sessionStorage
//     const adminData = JSON.parse(sessionStorage.getItem("admin") || "null");
    
//     console.log("=== WALK-IN BOOKING SUBMISSION ===");
//     console.log("Admin from session:", {
//       id: adminData?.id,
//       email: adminData?.email,
//       role: adminData?.role,
//       tokenPresent: !!adminData?.token
//     });
    
//     if (!adminData?.token) {
//       toast.error("Admin authentication required. Please login again.");
//       navigate("/admin/login");
//       return;
//     }

//     // Extract admin ID from token
//     let adminId = adminData.id;
    
//     if (!adminId && adminData.token) {
//       const tokenParts = adminData.token.split('_');
//       if (tokenParts.length >= 2 && tokenParts[0] === 'admin') {
//         adminId = parseInt(tokenParts[1]);
//         console.log(`Extracted admin ID from token: ${adminId}`);
//       }
//     }

//     if (!adminId) {
//       console.error("Cannot determine admin ID");
//       toast.error("Invalid admin session. Please logout and login again.");
//       return;
//     }

//     console.log(`Using admin ID: ${adminId}`);

//     // Calculate pricing with discount
//     const nights = Math.ceil(
//       (new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / 
//       (1000 * 60 * 60 * 24)
//     );
    
//     const originalPricePerNight = selectedRoom.roomPrice || 0;
//     const discount = selectedRoom.roomDiscount || 0;
//     const discountedPricePerNight = discount > 0 
//       ? originalPricePerNight * (1 - discount / 100)
//       : originalPricePerNight;
    
//     const totalAmount = nights * discountedPricePerNight;

//     // Prepare booking data
//     const bookingData = {
//       roomId: selectedRoom.id,
//       checkInDate: bookingDetails.checkInDate,
//       checkOutDate: bookingDetails.checkOutDate,
//       numberOfGuests: parseInt(bookingDetails.numberOfGuests),
//       totalAmount: totalAmount,
//       amountPaid: bookingDetails.paymentStatus === "PARTIAL" 
//         ? parseFloat(partialAmount) 
//         : totalAmount,
//       specialRequests: bookingDetails.specialRequests || null,
//       customerName: `${customerInfo.firstName.trim()} ${customerInfo.lastName.trim()}`,
//       customerEmail: customerInfo.email?.trim() || null,
//       customerPhone: customerInfo.phone?.trim(),
//       paymentMethod: bookingDetails.paymentMethod,
//       status: bookingDetails.paymentStatus,
//       transactionId: transactionId?.trim() || null,
//       paymentNotes: paymentNotes?.trim() || null,
//       isWalkIn: true,
//       bookedByAdmin: adminId,
//       roomDiscount: discount,
//       originalPrice: originalPricePerNight,
//       discountedPrice: discountedPricePerNight,
//     };

//     console.log("Booking data:", bookingData);
//     console.log("Authorization:", adminData.token);

//     // Submit booking
//     const response = await fetch(
//       "http://localhost:8080/api/v1/bookings/walk-in",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": adminData.token,
//         },
//         body: JSON.stringify(bookingData),
//       }
//     );

//     console.log("Response status:", response.status);

//     if (!response.ok) {
//       let errorMessage = "Failed to create booking";
      
//       try {
//         const errorData = await response.json();
//         console.error("Error response:", errorData);
//         errorMessage = errorData.error || errorData.message || errorMessage;
//       } catch (e) {
//         const errorText = await response.text();
//         console.error("Error text:", errorText);
//         errorMessage = errorText || errorMessage;
//       }

//       // Check for specific error types
//       if (errorMessage.includes("Admin not found")) {
//         toast.error(
//           <div>
//             <p className="font-bold">Admin ID Mismatch!</p>
//             <p className="text-sm mt-1">
//               Your session admin ID ({adminId}) doesn't exist in the database.
//             </p>
//           </div>,
//           { autoClose: 6000 }
//         );
//       } else if (errorMessage.includes("not available") || errorMessage.includes("Sold out")) {
//         toast.error(
//           <div>
//             <p className="font-bold">Room Not Available</p>
//             <p className="text-sm mt-1">{errorMessage}</p>
//             <p className="text-sm mt-1">
//               Please select a different room.
//             </p>
//           </div>,
//           { autoClose: 5000 }
//         );
//       } else {
//         toast.error(errorMessage, { autoClose: 5000 });
//       }

//       throw new Error(errorMessage);
//     }

//     // Success!
//     const result = await response.json();
//     console.log("✅ Booking created successfully:", result);

//     toast.success(
//       <div>
//         <p className="font-bold">Walk-in Booking Created!</p>
//         <p className="text-sm mt-1">
//           Booking #{result.id} for {customerInfo.firstName} {customerInfo.lastName}
//         </p>
//         <p className="text-sm">
//           Room: {selectedRoom.roomName}
//         </p>
//       </div>,
//       { autoClose: 4000 }
//     );

//     // Navigate to bookings page
//     setTimeout(() => {
//       navigate("/admin/bookings", { 
//         replace: true, 
//         state: { refresh: true } 
//       });
//     }, 1500);
    
//   } catch (error) {
//     console.error("❌ Error creating walk-in booking:", error);
    
//     if (!error.message.includes("Admin") && !error.message.includes("available")) {
//       toast.error(
//         <div>
//           <p className="font-bold">Booking Failed</p>
//           <p className="text-sm mt-1">{error.message || "Unknown error occurred"}</p>
//         </div>,
//         { autoClose: 5000 }
//       );
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const validateForm = () => {
//     if (!customerInfo.firstName || !customerInfo.lastName) {
//       toast.error("Please enter customer name");
//       return false;
//     }

//     if (!customerInfo.phone) {
//       toast.error("Please enter customer phone number");
//       return false;
//     }

//     if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
//       toast.error("Please select check-in and check-out dates");
//       return false;
//     }

//     const checkIn = new Date(bookingDetails.checkInDate);
//     const checkOut = new Date(bookingDetails.checkOutDate);

//     if (checkIn >= checkOut) {
//       toast.error("Check-out date must be after check-in date");
//       return false;
//     }

//     return true;
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     }).format(amount || 0);
//   };

//   const getRoomCategories = () => {
//     const categories = rooms.map((room) => room.roomCategory).filter(Boolean);
//     return ["ALL", ...new Set(categories)];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <button
//                 onClick={() => navigate("/admin/bookings")}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Bookings
//               </button>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 Walk-in Booking
//               </h1>
//               <p className="text-gray-600">Book a room for walk-in customers</p>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="text-sm text-gray-600">Step {step} of 3</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="flex justify-center mb-8">
//           <div className="flex items-center">
//             <div
//               className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                 step >= 1
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-600"
//               }`}
//             >
//               1
//             </div>
//             <div
//               className={`w-32 h-1 ${
//                 step >= 2 ? "bg-blue-600" : "bg-gray-200"
//               }`}
//             ></div>
//             <div
//               className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                 step >= 2
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-600"
//               }`}
//             >
//               2
//             </div>
//             <div
//               className={`w-32 h-1 ${
//                 step >= 3 ? "bg-blue-600" : "bg-gray-200"
//               }`}
//             ></div>
//             <div
//               className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                 step >= 3
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 text-gray-600"
//               }`}
//             >
//               3
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center mb-8">
//           <div className="text-center space-y-1">
//             <div className="text-sm font-medium">
//               {step === 1 && "Select Room"}
//               {step === 2 && "Customer Information"}
//               {step === 3 && "Confirm Booking"}
//             </div>
//             <div className="text-xs text-gray-500">
//               {step === 1 && "Choose an available room"}
//               {step === 2 && "Enter customer details"}
//               {step === 3 && "Review and complete booking"}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 pb-8">
//         {/* Step 1: Select Room */}
//         {step === 1 && (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="p-6 border-b">
//               <h2 className="text-lg font-semibold">Select Room</h2>
//               <p className="text-sm text-gray-500">
//                 Choose an available room for the customer
//               </p>
//             </div>

//             {/* Search and Filter */}
//             <div className="p-6 border-b bg-gray-50">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     placeholder="Search rooms..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyUp={handleSearch}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => {
//                       setSelectedCategory(e.target.value);
//                       handleSearch();
//                     }}
//                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {getRoomCategories().map((category) => (
//                       <option key={category} value={category}>
//                         {category === "ALL" ? "All Categories" : category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleSearch}
//                     className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
//                   >
//                     Search
//                   </button>
//                   <button
//                     onClick={fetchAvailableRooms}
//                     className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Reset
//                   </button>

//                    {/* ADD THIS NEW BUTTON HERE */}
 
//   <button
//     onClick={async (e) => {
//       e.stopPropagation(); // Prevent selecting the room
//       try {
//         toast.info(`Fixing ${room.roomName} availability...`);
//         const result = await emergencyFixRoom(room.id);
//         toast.success(`✅ ${result.roomName} Fixed!`);
//         await fetchAvailableRooms();
//       } catch (error) {
//         toast.error("Fix failed: " + error.message);
//       }
//     }}
//     className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
//   >
//     🔧 Fix
//   </button>


//                   <button
//                     onClick={() => {
//                       setShowDiscountedOnly(!showDiscountedOnly);
//                       handleSearch();
//                     }}
//                     className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
//                       showDiscountedOnly
//                         ? "bg-red-600 text-white hover:bg-red-700"
//                         : "border border-red-300 text-red-700 hover:bg-red-50"
//                     }`}
//                   >
//                     {showDiscountedOnly ? "⭐ Showing Deals" : "⭐ Show Deals"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Rooms Grid */}
//             <div className="p-6">
//               {loading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-600">
//                     Loading available rooms...
//                   </p>
//                 </div>
//               ) : filteredRooms.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900">
//                     No rooms available
//                   </h3>
//                   <p className="text-gray-500 mt-2">
//                     No rooms match your search criteria
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredRooms.map((room) => (
//                     <div
//                       key={room.id}
//                       className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
//                       onClick={() => handleSelectRoom(room)}
//                     >
//                       {room.roomImage ? (
//                         <img
//                           src={room.roomImage}
//                           alt={room.roomName}
//                           className="w-full h-48 object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
//                           <Home className="h-12 w-12 text-gray-400" />
//                         </div>
//                       )}

//                       {/* In your room card, replace the price section */}
//                       <div className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-gray-900">
//                               {room.roomName}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               {room.roomCategory}
//                             </p>
//                           </div>

//                           {/* Updated price display with discount */}
//                           {formatPriceWithDiscount(room)}
//                         </div>

//                       <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//   <span className="flex items-center gap-1">
//     <Users className="h-4 w-4" />
//     {room.maxOccupancy || 2} guests
//   </span>
//   <span className="flex items-center gap-1">
//     <Home className="h-4 w-4" />
//     {/* **FIXED**: Better status display */}
//     {room._status === 'AVAILABLE' ? (
//       <>
//         <span className="font-medium text-green-600">
//           ✅ {room.availableRooms} available
//         </span>
//         <span className="text-gray-500">
//           / {room.roomQuantity} total
//         </span>
//       </>
//     ) : room._status === 'FULLY_BOOKED' ? (
//       // **CORRECT**: Room is fully booked but correctly marked as available
//       <span className="font-medium text-orange-600">
//         ⏳ Fully booked ({room.roomQuantity} in inventory)
//       </span>
//     ) : room._status === 'LOGIC_ERROR' ? (
//       // **WRONG**: Room has inventory but isAvailable is false
//       <span className="font-medium text-yellow-600">
//         ⚠️ Inventory issue ({room.roomQuantity} rooms, needs fix)
//       </span>
//     ) : (
//       // Default fallback
//       <span className="font-medium text-gray-600">
//         {room.availableRooms || 0} available / {room.roomQuantity} total
//       </span>
//     )}
//   </span>
// </div>

//                         {/* Show discount badge if applicable */}
//                         {room.roomDiscount > 0 && (
//                           <div className="mb-2">
//                             <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
//                               🎉 {room.roomDiscount}% OFF
//                             </span>
//                           </div>
//                         )}

//                         <LiquidButton className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                           Select Room
//                         </LiquidButton>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Step 2: Customer Information */}
//         {step === 2 && (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg font-semibold">
//                     Customer Information
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Enter walk-in customer details
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setStep(1)}
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   ← Back to Room Selection
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Customer Personal Info */}
//                 <div className="space-y-4">
//                   <h3 className="font-medium text-gray-900 flex items-center gap-2">
//                     <User className="h-5 w-5" />
//                     Personal Information
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={customerInfo.firstName}
//                         onChange={handleCustomerInfoChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={customerInfo.lastName}
//                         onChange={handleCustomerInfoChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                       <input
//                         type="email"
//                         name="email"
//                         value={customerInfo.email}
//                         onChange={handleCustomerInfoChange}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>

                 
//                   <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">
//     Phone Number *
//   </label>
//   <div className="relative">
//     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//     <input
//       type="tel"
//       name="phone"
//       value={customerInfo.phone}
//       onChange={handleCustomerInfoChange}
//       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//       placeholder="e.g., 1234567890 or +1 (123) 456-7890"
//       required
//       pattern="[\d+\-()\s]{10,15}"
//       title="Please enter a valid phone number (10-15 digits, may include +, -, parentheses)"
//     />
//   </div>
//   <p className="text-xs text-gray-500 mt-1">
//     Enter 10-15 digits, may include +, -, parentheses, or spaces
//   </p>
// </div>
//                 </div>

//                 {/* Booking Details */}
//                 <div className="space-y-4">
//                   <h3 className="font-medium text-gray-900 flex items-center gap-2">
//                     <Calendar className="h-5 w-5" />
//                     Booking Details
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Check-in Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="checkInDate"
//                         value={bookingDetails.checkInDate}
//                         onChange={handleBookingDetailsChange}
//                         min={new Date().toISOString().split("T")[0]}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Check-out Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="checkOutDate"
//                         value={bookingDetails.checkOutDate}
//                         onChange={handleBookingDetailsChange}
//                         min={
//                           bookingDetails.checkInDate ||
//                           new Date().toISOString().split("T")[0]
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Number of Guests
//                     </label>
//                     <div className="flex items-center gap-4">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setBookingDetails((prev) => ({
//                             ...prev,
//                             numberOfGuests: Math.max(
//                               1,
//                               prev.numberOfGuests - 1
//                             ),
//                           }))
//                         }
//                         className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                       >
//                         <Minus className="h-4 w-4" />
//                       </button>

//                       <span className="text-lg font-medium">
//                         {bookingDetails.numberOfGuests}
//                       </span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           setBookingDetails((prev) => ({
//                             ...prev,
//                             numberOfGuests: Math.min(
//                               selectedRoom?.maxOccupancy || 4,
//                               prev.numberOfGuests + 1
//                             ),
//                           }))
//                         }
//                         className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                       >
//                         <Plus className="h-4 w-4" />
//                       </button>

//                       <span className="text-sm text-gray-500 ml-4">
//                         Max: {selectedRoom?.maxOccupancy || 4} guests
//                       </span>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Special Requests
//                     </label>
//                     <textarea
//                       name="specialRequests"
//                       value={bookingDetails.specialRequests}
//                       onChange={handleBookingDetailsChange}
//                       rows="3"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Any special requests from the customer..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* In Step 2, update the Selected Room Summary */}
//               {selectedRoom && (
//                 <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
//                   <h4 className="font-medium text-gray-900 mb-2">
//       Selected Room Category
//     </h4>
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="font-semibold">{selectedRoom.roomName}</p>
//         <p className="text-sm text-gray-500">
//           {selectedRoom.roomCategory}
//         </p>
//         <p className="text-sm text-blue-600 mt-1">
//           📊 Available: {selectedRoom.availableRooms || 0} of {selectedRoom.roomQuantity} rooms
//         </p>
//         {selectedRoom.roomDiscount > 0 && (
//           <p className="text-xs text-red-600 font-medium">
//             🎉 {selectedRoom.roomDiscount}% discount applied
//           </p>
//         )}
//                     </div>
//                     <div className="text-right">
//                       {selectedRoom.roomDiscount > 0 ? (
//                         <div>
//                           <p className="text-sm text-gray-500 line-through">
//                             {formatCurrency(selectedRoom.roomPrice)}/night
//                           </p>
//                           <p className="font-bold text-green-600">
//                             {formatCurrency(getDiscountedPrice(selectedRoom))}
//                             /night
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="font-bold text-green-600">
//                           {formatCurrency(selectedRoom.roomPrice)}/night
//                         </p>
//                       )}
//                       {bookingDetails.checkInDate &&
//                         bookingDetails.checkOutDate && (
//                           <p className="text-sm text-gray-500">
//                             Total: {formatCurrency(calculateTotalAmount())}
//                           </p>
//                         )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-8 flex justify-end">
//                 <button
//                   onClick={() => setStep(3)}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Continue to Payment
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Confirm Booking */}
//         {step === 3 && (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="p-6 border-b">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-lg font-semibold">Confirm Booking</h2>
//                   <p className="text-sm text-gray-500">
//                     Review and complete the walk-in booking
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setStep(2)}
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   ← Back to Customer Info
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Booking Summary */}
//                 <div className="lg:col-span-2 space-y-6">
//                   {/* Customer Info Summary */}
//                   <div className="bg-gray-50 p-4 rounded-lg border">
//                     <h3 className="font-medium text-gray-900 mb-3">
//                       Customer Information
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm text-gray-500">Full Name</p>
//                         <p className="font-medium">
//                           {customerInfo.firstName} {customerInfo.lastName}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Email</p>
//                         <p className="font-medium">
//                           {customerInfo.email || "Not provided"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Phone</p>
//                         <p className="font-medium">{customerInfo.phone}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Booking Type</p>
//                         <p className="font-medium text-blue-600">Walk-in</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* In Step 3, update the Room & Dates Summary */}
//                   <div className="bg-gray-50 p-4 rounded-lg border">
//                     <h3 className="font-medium text-gray-900 mb-3">
//     Room & Dates
//   </h3>
//   <div className="flex items-start justify-between">
//     <div>
//       <p className="font-semibold">{selectedRoom?.roomName}</p>
//       <p className="text-sm text-gray-500">
//         {selectedRoom?.roomCategory}
//       </p>
//       {/* Add availability info */}
//       <p className="text-sm text-blue-600 mt-1">
//         📊 Availability: {selectedRoom?.availableRooms || 0} of {selectedRoom?.roomQuantity} rooms left
//       </p>
//                         {selectedRoom?.roomDiscount > 0 && (
//                           <p className="text-xs text-red-600 font-medium mt-1">
//                             🎉 {selectedRoom.roomDiscount}% discount applied
//                           </p>
//                         )}
//                         <div className="mt-2 text-sm">
//                           <p className="text-gray-600">
//                             <Calendar className="inline h-4 w-4 mr-1" />
//                             {new Date(
//                               bookingDetails.checkInDate
//                             ).toLocaleDateString()}{" "}
//                             →{" "}
//                             {new Date(
//                               bookingDetails.checkOutDate
//                             ).toLocaleDateString()}
//                           </p>
//                           <p className="text-gray-500">
//                             {Math.ceil(
//                               (new Date(bookingDetails.checkOutDate) -
//                                 new Date(bookingDetails.checkInDate)) /
//                                 (1000 * 60 * 60 * 24)
//                             )}{" "}
//                             nights
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-lg font-bold text-green-600">
//                           {formatCurrency(calculateTotalAmount())}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {selectedRoom?.roomDiscount > 0 ? (
//                             <span>
//                               <span className="line-through">
//                                 {formatCurrency(selectedRoom.roomPrice)}
//                               </span>
//                               {" → "}
//                               {formatCurrency(getDiscountedPrice(selectedRoom))}
//                               {" × "}
//                               {Math.ceil(
//                                 (new Date(bookingDetails.checkOutDate) -
//                                   new Date(bookingDetails.checkInDate)) /
//                                   (1000 * 60 * 60 * 24)
//                               )}{" "}
//                               nights
//                             </span>
//                           ) : (
//                             <span>
//                               {formatCurrency(selectedRoom?.roomPrice)} ×{" "}
//                               {Math.ceil(
//                                 (new Date(bookingDetails.checkOutDate) -
//                                   new Date(bookingDetails.checkInDate)) /
//                                   (1000 * 60 * 60 * 24)
//                               )}{" "}
//                               nights
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Special Requests */}
//                   {bookingDetails.specialRequests && (
//                     <div className="bg-gray-50 p-4 rounded-lg border">
//                       <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
//                         <MessageSquare className="h-5 w-5" />
//                         Special Requests
//                       </h3>
//                       <p className="text-gray-700 whitespace-pre-wrap">
//                         {bookingDetails.specialRequests}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-6">
//                   {/* Payment Details Card */}
//                   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                     <div className="bg-gray-50 px-4 py-3 border-b">
//                       <h3 className="font-medium text-gray-900 flex items-center gap-2">
//                         <CreditCard className="h-5 w-5" />
//                         Payment Details
//                       </h3>
//                     </div>
//                     <div className="p-4">
//                       {/* This is where we use the nested component */}
//                       <PaymentDetailsForm
//                         bookingDetails={bookingDetails}
//                         setBookingDetails={setBookingDetails}
//                         calculateTotalAmount={calculateTotalAmount}
//                         formatCurrency={formatCurrency}
//                         partialAmount={partialAmount}
//                         setPartialAmount={setPartialAmount}
//                         transactionId={transactionId}
//                         setTransactionId={setTransactionId}
//                         paymentNotes={paymentNotes}
//                         setPaymentNotes={setPaymentNotes}
//                       />
//                     </div>
//                   </div>
//                   {/* Action buttons, notes, etc. */}
//                 </div>
//               </div>

//               <div className="mt-8 pt-6 border-t">
//                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                   <div className="text-sm text-gray-600">
//                     <p className="font-medium mb-1">Booking Summary:</p>
//                     <ul className="list-disc list-inside space-y-1">
//                       <li>Room: {selectedRoom?.roomName}</li>
//                       <li>
//                         Dates:{" "}
//                         {new Date(
//                           bookingDetails.checkInDate
//                         ).toLocaleDateString()}{" "}
//                         -{" "}
//                         {new Date(
//                           bookingDetails.checkOutDate
//                         ).toLocaleDateString()}
//                       </li>
//                       <li>
//                         Guest: {customerInfo.firstName} {customerInfo.lastName}
//                       </li>
//                       <li className="font-bold text-green-600">
//                         Total: {formatCurrency(calculateTotalAmount())}
//                       </li>
//                     </ul>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setStep(2)}
//                       className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//                     >
//                       Back
//                     </button>

//                     <button
//                       onClick={handleSubmitBooking}
//                       disabled={loading}
//                       className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle className="h-5 w-5" />
//                           Confirm & Book Now
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Optional: Terms and Conditions */}
//                 <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <div className="flex items-start gap-2">
//                     <div className="text-yellow-800">
//                       <svg
//                         className="w-5 h-5"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <div className="text-sm text-yellow-700">
//                       <p className="font-medium">Important:</p>
//                       <p>
//                         By confirming this booking, you agree to our terms and
//                         conditions. This booking will be immediately recorded in
//                         the system.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Search,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Home,
  Users,
  MessageSquare,
  Plus,
  Minus,
} from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid";
import PaymentDetailsForm from "./component/PaymentDetailsForm";

export default function WalkInBooking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    idType: "PASSPORT",
    idNumber: "",
  });

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
  });

  const [partialAmount, setPartialAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    const canProceed = checkAdminAccess();
    if (canProceed) {
      fetchAvailableRooms();
    }
  }, []);

  const checkAdminAccess = () => {
    try {
      let admin = JSON.parse(sessionStorage.getItem("admin") || "null");
      
      // Fallback to localStorage if not in sessionStorage
      if (!admin || !admin.token) {
        admin = JSON.parse(localStorage.getItem("admin") || "null");
        
        if (admin && admin.token) {
          sessionStorage.setItem("admin", JSON.stringify(admin));
        }
      }

      const userRole = admin?.role;
      const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
      const token = admin?.token;

      if (!isAdmin || !token) {
        toast.error("Admin access required. Please login.");
        navigate("/admin/login");
        return false;
      }

      return true;
      
    } catch (error) {
      toast.error("Authentication error. Please login again.");
      navigate("/admin/login");
      return false;
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/v1/rooms?page=0&size=100`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch rooms: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      let roomsData = [];
      
      if (data.content && Array.isArray(data.content)) {
        roomsData = data.content;
      } else if (Array.isArray(data)) {
        roomsData = data;
      } else {
        roomsData = [];
      }

      const roomsWithCorrectedAvailability = roomsData.map(room => {
        const hasQuantity = room.roomQuantity > 0;
        const availableRoomsCount = room.availableRooms || 0;
        const isAvailableFlag = room.isAvailable !== false;
        
        const isLogicallyWrong = availableRoomsCount > 0 && !isAvailableFlag;
        const isActuallyAvailable = availableRoomsCount > 0;
        
        return {
          ...room,
          _needsFix: isLogicallyWrong,
          _isLogicallyWrong: isLogicallyWrong,
          _shouldBeAvailable: hasQuantity,
          _actualAvailability: isActuallyAvailable,
          _availableRoomsCount: availableRoomsCount,
          _status: isActuallyAvailable ? 'AVAILABLE' : 'FULLY_BOOKED'
        };
      });

      const roomsToShow = roomsWithCorrectedAvailability.filter(room => 
        room.roomQuantity > 0
      );

      const logicallyWrongRooms = roomsToShow.filter(room => room._isLogicallyWrong);

      setRooms(roomsToShow);
      setFilteredRooms(roomsToShow);

      if (roomsToShow.length === 0) {
        toast.info(
          <div>
            <p>No rooms in inventory.</p>
            <p className="text-sm">
              Please add rooms in room management.
            </p>
          </div>
        );
      } else {
        if (logicallyWrongRooms.length > 0) {
          toast.warning(
            <div>
              <p className="font-bold">⚠️ Some rooms have availability logic errors</p>
              <p className="text-sm mt-1">
                Rooms have inventory but isAvailable flag is false.
              </p>
              <p className="text-sm">
                Click <span className="font-bold">🔧 Fix</span> to correct.
              </p>
            </div>,
            { autoClose: 8000 }
          );
        } else {
          const availableForBooking = roomsToShow.filter(room => room._actualAvailability).length;
          const fullyBooked = roomsToShow.filter(room => room._status === 'FULLY_BOOKED').length;
          const totalRooms = roomsToShow.reduce((sum, room) => sum + room.roomQuantity, 0);
          const totalAvailable = roomsToShow.reduce((sum, room) => sum + room._availableRoomsCount, 0);
          
          toast.info(
            <div>
              <p className="font-medium">📊 Room Availability Summary</p>
              <p className="text-sm mt-1">
                {availableForBooking} room categories available for booking
              </p>
              <p className="text-sm">
                {fullyBooked} room categories fully booked
              </p>
              <p className="text-sm">
                Total available rooms: {totalAvailable} of {totalRooms}
              </p>
            </div>,
            { autoClose: 5000 }
          );
        }
      }

    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error(
        <div>
          <p>Failed to load rooms</p>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...rooms];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.roomName?.toLowerCase().includes(term) ||
          room.roomCategory?.toLowerCase().includes(term) ||
          room.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(
        (room) => room.roomCategory === selectedCategory
      );
    }

    // Filter by discount
    if (showDiscountedOnly) {
      filtered = filtered.filter((room) => room.roomDiscount > 0);
    }

    setFilteredRooms(filtered);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setStep(2);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      let cleanedValue = value.replace(/[^\d+\-()\s]/g, '');
      
      if (cleanedValue.length > 15) {
        cleanedValue = cleanedValue.substring(0, 15);
      }
      
      setCustomerInfo((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBookingDetailsChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalAmount = () => {
    if (
      !selectedRoom ||
      !bookingDetails.checkInDate ||
      !bookingDetails.checkOutDate
    )
      return 0;

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const originalPrice = selectedRoom.roomPrice || 0;
    const discount = selectedRoom.roomDiscount || 0;

    let pricePerNight = originalPrice;
    if (discount > 0) {
      pricePerNight = originalPrice * (1 - discount / 100);
    }

    return nights * pricePerNight;
  };

  const getDiscountedPrice = (room) => {
    if (!room) return 0;

    const originalPrice = room.roomPrice || 0;
    const discount = room.roomDiscount || 0;

    if (discount > 0) {
      return originalPrice * (1 - discount / 100);
    }

    return originalPrice;
  };

  const formatPriceWithDiscount = (room) => {
    const originalPrice = room.roomPrice || 0;
    const discount = room.roomDiscount || 0;

    if (discount > 0) {
      const discountedPrice = originalPrice * (1 - discount / 100);
      return (
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-green-600">
            {formatCurrency(discountedPrice)}/night
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 line-through">
              {formatCurrency(originalPrice)}
            </span>
            <span className="text-xs font-bold text-red-600">-{discount}%</span>
          </div>
        </div>
      );
    }

    return (
      <span className="text-sm font-bold text-green-600">
        {formatCurrency(originalPrice)}/night
      </span>
    );
  };

  const handleSubmitBooking = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const adminData = JSON.parse(sessionStorage.getItem("admin") || "null");
      
      if (!adminData?.token) {
        toast.error("Admin authentication required. Please login again.");
        navigate("/admin/login");
        return;
      }

      let adminId = adminData.id;
      
      if (!adminId && adminData.token) {
        const tokenParts = adminData.token.split('_');
        if (tokenParts.length >= 2 && tokenParts[0] === 'admin') {
          adminId = parseInt(tokenParts[1]);
        }
      }

      if (!adminId) {
        toast.error("Invalid admin session. Please logout and login again.");
        return;
      }

      const nights = Math.ceil(
        (new Date(bookingDetails.checkOutDate) - new Date(bookingDetails.checkInDate)) / 
        (1000 * 60 * 60 * 24)
      );
      
      const originalPricePerNight = selectedRoom.roomPrice || 0;
      const discount = selectedRoom.roomDiscount || 0;
      const discountedPricePerNight = discount > 0 
        ? originalPricePerNight * (1 - discount / 100)
        : originalPricePerNight;
      
      const totalAmount = nights * discountedPricePerNight;

      const bookingData = {
        roomId: selectedRoom.id,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        numberOfGuests: parseInt(bookingDetails.numberOfGuests),
        totalAmount: totalAmount,
        amountPaid: bookingDetails.paymentStatus === "PARTIAL" 
          ? parseFloat(partialAmount) 
          : totalAmount,
        specialRequests: bookingDetails.specialRequests || null,
        customerName: `${customerInfo.firstName.trim()} ${customerInfo.lastName.trim()}`,
        customerEmail: customerInfo.email?.trim() || null,
        customerPhone: customerInfo.phone?.trim(),
        paymentMethod: bookingDetails.paymentMethod,
        status: bookingDetails.paymentStatus,
        transactionId: transactionId?.trim() || null,
        paymentNotes: paymentNotes?.trim() || null,
        isWalkIn: true,
        bookedByAdmin: adminId,
        roomDiscount: discount,
        originalPrice: originalPricePerNight,
        discountedPrice: discountedPricePerNight,
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/bookings/walk-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": adminData.token,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create booking";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }

        if (errorMessage.includes("Admin not found")) {
          toast.error(
            <div>
              <p className="font-bold">Admin ID Mismatch!</p>
              <p className="text-sm mt-1">
                Your session admin ID ({adminId}) doesn't exist in the database.
              </p>
            </div>,
            { autoClose: 6000 }
          );
        } else if (errorMessage.includes("not available") || errorMessage.includes("Sold out")) {
          toast.error(
            <div>
              <p className="font-bold">Room Not Available</p>
              <p className="text-sm mt-1">{errorMessage}</p>
              <p className="text-sm mt-1">
                Please select a different room.
              </p>
            </div>,
            { autoClose: 5000 }
          );
        } else {
          toast.error(errorMessage, { autoClose: 5000 });
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      toast.success(
        <div>
          <p className="font-bold">Walk-in Booking Created!</p>
          <p className="text-sm mt-1">
            Booking #{result.id} for {customerInfo.firstName} {customerInfo.lastName}
          </p>
          <p className="text-sm">
            Room: {selectedRoom.roomName}
          </p>
        </div>,
        { autoClose: 4000 }
      );

      setTimeout(() => {
        navigate("/admin/bookings", { 
          replace: true, 
          state: { refresh: true } 
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error creating walk-in booking:", error);
      
      if (!error.message.includes("Admin") && !error.message.includes("available")) {
        toast.error(
          <div>
            <p className="font-bold">Booking Failed</p>
            <p className="text-sm mt-1">{error.message || "Unknown error occurred"}</p>
          </div>,
          { autoClose: 5000 }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!customerInfo.firstName || !customerInfo.lastName) {
      toast.error("Please enter customer name");
      return false;
    }

    if (!customerInfo.phone) {
      toast.error("Please enter customer phone number");
      return false;
    }

    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return false;
    }

    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);

    if (checkIn >= checkOut) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getRoomCategories = () => {
    const categories = rooms.map((room) => room.roomCategory).filter(Boolean);
    return ["ALL", ...new Set(categories)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <button
                onClick={() => navigate("/admin/bookings")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Walk-in Booking
              </h1>
              <p className="text-gray-600">Book a room for walk-in customers</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Step {step} of 3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-32 h-1 ${
                step >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`w-32 h-1 ${
                step >= 3 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="text-center space-y-1">
            <div className="text-sm font-medium">
              {step === 1 && "Select Room"}
              {step === 2 && "Customer Information"}
              {step === 3 && "Confirm Booking"}
            </div>
            <div className="text-xs text-gray-500">
              {step === 1 && "Choose an available room"}
              {step === 2 && "Enter customer details"}
              {step === 3 && "Review and complete booking"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Step 1: Select Room */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Select Room</h2>
              <p className="text-sm text-gray-500">
                Choose an available room for the customer
              </p>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={handleSearch}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleSearch();
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getRoomCategories().map((category) => (
                      <option key={category} value={category}>
                        {category === "ALL" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
                  >
                    Search
                  </button>
                  <button
                    onClick={fetchAvailableRooms}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => {
                      setShowDiscountedOnly(!showDiscountedOnly);
                      handleSearch();
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${
                      showDiscountedOnly
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "border border-red-300 text-red-700 hover:bg-red-50"
                    }`}
                  >
                    {showDiscountedOnly ? "⭐ Showing Deals" : "⭐ Show Deals"}
                  </button>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading available rooms...
                  </p>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No rooms available
                  </h3>
                  <p className="text-gray-500 mt-2">
                    No rooms match your search criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelectRoom(room)}
                    >
                      {room.roomImage ? (
                        <img
                          src={room.roomImage}
                          alt={room.roomName}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <Home className="h-12 w-12 text-gray-400" />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {room.roomName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {room.roomCategory}
                            </p>
                          </div>
                          {formatPriceWithDiscount(room)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {room.maxOccupancy || 2} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            {room._status === 'AVAILABLE' ? (
                              <>
                                <span className="font-medium text-green-600">
                                  ✅ {room.availableRooms} available
                                </span>
                                <span className="text-gray-500">
                                  / {room.roomQuantity} total
                                </span>
                              </>
                            ) : room._status === 'FULLY_BOOKED' ? (
                              <span className="font-medium text-orange-600">
                                ⏳ Fully booked ({room.roomQuantity} in inventory)
                              </span>
                            ) : room._status === 'LOGIC_ERROR' ? (
                              <span className="font-medium text-yellow-600">
                                ⚠️ Inventory issue ({room.roomQuantity} rooms, needs fix)
                              </span>
                            ) : (
                              <span className="font-medium text-gray-600">
                                {room.availableRooms || 0} available / {room.roomQuantity} total
                              </span>
                            )}
                          </span>
                        </div>

                        {room.roomDiscount > 0 && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                              🎉 {room.roomDiscount}% OFF
                            </span>
                          </div>
                        )}

                        <LiquidButton className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Select Room
                        </LiquidButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Customer Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter walk-in customer details
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Back to Room Selection
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={customerInfo.firstName}
                        onChange={handleCustomerInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={customerInfo.lastName}
                        onChange={handleCustomerInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1234567890 or +1 (123) 456-7890"
                        required
                        pattern="[\d+\-()\s]{10,15}"
                        title="Please enter a valid phone number (10-15 digits, may include +, -, parentheses)"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter 10-15 digits, may include +, -, parentheses, or spaces
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={bookingDetails.checkInDate}
                        onChange={handleBookingDetailsChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={bookingDetails.checkOutDate}
                        onChange={handleBookingDetailsChange}
                        min={
                          bookingDetails.checkInDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setBookingDetails((prev) => ({
                            ...prev,
                            numberOfGuests: Math.max(
                              1,
                              prev.numberOfGuests - 1
                            ),
                          }))
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="text-lg font-medium">
                        {bookingDetails.numberOfGuests}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setBookingDetails((prev) => ({
                            ...prev,
                            numberOfGuests: Math.min(
                              selectedRoom?.maxOccupancy || 4,
                              prev.numberOfGuests + 1
                            ),
                          }))
                        }
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <span className="text-sm text-gray-500 ml-4">
                        Max: {selectedRoom?.maxOccupancy || 4} guests
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={bookingDetails.specialRequests}
                      onChange={handleBookingDetailsChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests from the customer..."
                    />
                  </div>
                </div>
              </div>

              {selectedRoom && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Selected Room Category
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{selectedRoom.roomName}</p>
                      <p className="text-sm text-gray-500">
                        {selectedRoom.roomCategory}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        📊 Available: {selectedRoom.availableRooms || 0} of {selectedRoom.roomQuantity} rooms
                      </p>
                      {selectedRoom.roomDiscount > 0 && (
                        <p className="text-xs text-red-600 font-medium">
                          🎉 {selectedRoom.roomDiscount}% discount applied
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedRoom.roomDiscount > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(selectedRoom.roomPrice)}/night
                          </p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(getDiscountedPrice(selectedRoom))}
                            /night
                          </p>
                        </div>
                      ) : (
                        <p className="font-bold text-green-600">
                          {formatCurrency(selectedRoom.roomPrice)}/night
                        </p>
                      )}
                      {bookingDetails.checkInDate &&
                        bookingDetails.checkOutDate && (
                          <p className="text-sm text-gray-500">
                            Total: {formatCurrency(calculateTotalAmount())}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Booking */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Confirm Booking</h2>
                  <p className="text-sm text-gray-500">
                    Review and complete the walk-in booking
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Back to Customer Info
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Summary */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Info Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">
                          {customerInfo.firstName} {customerInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {customerInfo.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{customerInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Booking Type</p>
                        <p className="font-medium text-blue-600">Walk-in</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Room & Dates
                    </h3>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{selectedRoom?.roomName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedRoom?.roomCategory}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          📊 Availability: {selectedRoom?.availableRooms || 0} of {selectedRoom?.roomQuantity} rooms left
                        </p>
                        {selectedRoom?.roomDiscount > 0 && (
                          <p className="text-xs text-red-600 font-medium mt-1">
                            🎉 {selectedRoom.roomDiscount}% discount applied
                          </p>
                        )}
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {new Date(
                              bookingDetails.checkInDate
                            ).toLocaleDateString()}{" "}
                            →{" "}
                            {new Date(
                              bookingDetails.checkOutDate
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            {Math.ceil(
                              (new Date(bookingDetails.checkOutDate) -
                                new Date(bookingDetails.checkInDate)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(calculateTotalAmount())}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedRoom?.roomDiscount > 0 ? (
                            <span>
                              <span className="line-through">
                                {formatCurrency(selectedRoom.roomPrice)}
                              </span>
                              {" → "}
                              {formatCurrency(getDiscountedPrice(selectedRoom))}
                              {" × "}
                              {Math.ceil(
                                (new Date(bookingDetails.checkOutDate) -
                                  new Date(bookingDetails.checkInDate)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              nights
                            </span>
                          ) : (
                            <span>
                              {formatCurrency(selectedRoom?.roomPrice)} ×{" "}
                              {Math.ceil(
                                (new Date(bookingDetails.checkOutDate) -
                                  new Date(bookingDetails.checkInDate)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              nights
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {bookingDetails.specialRequests && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Special Requests
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {bookingDetails.specialRequests}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Payment Details Card */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Details
                      </h3>
                    </div>
                    <div className="p-4">
                      <PaymentDetailsForm
                        bookingDetails={bookingDetails}
                        setBookingDetails={setBookingDetails}
                        calculateTotalAmount={calculateTotalAmount}
                        formatCurrency={formatCurrency}
                        partialAmount={partialAmount}
                        setPartialAmount={setPartialAmount}
                        transactionId={transactionId}
                        setTransactionId={setTransactionId}
                        paymentNotes={paymentNotes}
                        setPaymentNotes={setPaymentNotes}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Booking Summary:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Room: {selectedRoom?.roomName}</li>
                      <li>
                        Dates:{" "}
                        {new Date(
                          bookingDetails.checkInDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          bookingDetails.checkOutDate
                        ).toLocaleDateString()}
                      </li>
                      <li>
                        Guest: {customerInfo.firstName} {customerInfo.lastName}
                      </li>
                      <li className="font-bold text-green-600">
                        Total: {formatCurrency(calculateTotalAmount())}
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmitBooking}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Confirm & Book Now
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-800">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">Important:</p>
                      <p>
                        By confirming this booking, you agree to our terms and
                        conditions. This booking will be immediately recorded in
                        the system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}