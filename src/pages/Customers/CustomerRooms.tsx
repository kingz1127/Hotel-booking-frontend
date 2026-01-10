// CustomerRooms.jsx
import { useState, useEffect } from "react";
import { TbRulerMeasure } from "react-icons/tb"; 
import { FaBath, FaBed, FaTag, FaUsers, FaCalendarAlt, FaCheck } from "react-icons/fa"; 
import { getAllRooms } from "../../services/api.room.js";
import { Loader2, Calendar, Star, MapPin, Wifi, Coffee, Tv, Wind, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CustomerRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRooms(0, 50); // Same function as RoomsSuites!
      console.log("Fetched rooms for customer booking:", data);
      setRooms(data || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setError("Failed to load rooms. Please try again later.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort rooms
  const filteredRooms = rooms.filter(room => {
    // Category filter
    if (selectedCategory !== "all" && room.roomCategory !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !room.roomName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.roomPrice || 0) - (b.roomPrice || 0);
      case "price-high":
        return (b.roomPrice || 0) - (a.roomPrice || 0);
      case "name-asc":
        return (a.roomName || "").localeCompare(b.roomName || "");
      case "name-desc":
        return (b.roomName || "").localeCompare(a.roomName || "");
      default:
        return 0;
    }
  });

  // Format price with discount
  const formatPrice = (price, discount = 0) => {
    if (!price && price !== 0) return "$0";
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(finalPrice);
  };

  // Get category label (using your existing function)
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      "Standard": "Standard Room",
      "Deluxe": "Deluxe Room",
      "Suite": "Luxury Suite",
      "Presidential": "Presidential Suite",
      "Family": "Family Room",
      "Executive": "Executive Suite",
      "Studio": "Studio Room"
    };
    return categoryLabels[category] || "Room";
  };

  // Safe property access
  const getRoomProperty = (room, property, defaultValue = "") => {
    if (!room) return defaultValue;
    return room[property] !== undefined ? room[property] : defaultValue;
  };

  // Handle room selection
  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    document.body.style.overflow = 'unset';
  };

  // Get unique categories
  const categories = ["all", ...new Set(rooms.map(room => room.roomCategory).filter(Boolean))];

  // Handle booking - UPDATED with sessionStorage
  const handleBooking = (room) => {
    console.log("Attempting to book room:", room.id, room.roomName);
    
    // Check if user is logged in using sessionStorage
    const userSession = sessionStorage.getItem("user");
    let userId = null;
    
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);
        userId = userData.id || userData.userId;
      } catch (error) {
        console.error("Error parsing user session:", error);
      }
    }
    
    if (!userId) {
      // User not logged in - store room info in sessionStorage and redirect to login
      sessionStorage.setItem('selectedRoomId', room.id);
      sessionStorage.setItem('redirectAfterLogin', `/booking/${room.id}`);
      
      toast.info(`Please login to book "${room.roomName}"`);
      navigate('/login');
    } else {
      // User is logged in - go directly to booking page
      console.log("User is logged in, navigating to booking page");
      navigate(`/booking/${room.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Loader2 className="h-16 w-16 animate-spin text-[#c1bd3f] mb-6" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Available Rooms</h3>
        <p className="text-gray-500">Finding the perfect accommodations for your stay...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={fetchRooms}
            className="bg-[#c1bd3f] hover:bg-[#a8a535] text-white px-6"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Find Your Perfect Stay
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Discover {rooms.length} beautifully designed rooms and suites, 
                each offering unique amenities and stunning views.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>4.8 Guest Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>Flexible Cancellation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>Secure Booking</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Search</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search rooms by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c1bd3f]"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#c1bd3f]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#c1bd3f]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Available Rooms
              <span className="text-gray-500 ml-2">({filteredRooms.length})</span>
            </h2>
            <p className="text-gray-600">
              {selectedCategory !== "all" 
                ? `Showing ${getCategoryLabel(selectedCategory)}s only` 
                : "All room categories"}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {rooms.length} total rooms • {filteredRooms.length} filtered
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => {
              const roomId = getRoomProperty(room, 'id');
              const roomName = getRoomProperty(room, 'roomName', 'Unnamed Room');
              const roomCategory = getRoomProperty(room, 'roomCategory', 'Standard');
              const roomPrice = getRoomProperty(room, 'roomPrice', 0);
              const roomDiscount = getRoomProperty(room, 'roomDiscount', 0);
              const roomImage = getRoomProperty(room, 'roomImage', '');
              const roomBeds = getRoomProperty(room, 'roomBeds', 1);
              const roomBaths = getRoomProperty(room, 'roomBaths', 1);
              const roomMeasurements = getRoomProperty(room, 'roomMeasurements', 300);
              const roomQuantity = getRoomProperty(room, 'roomQuantity', 0);

              const isAvailable = roomQuantity > 0;
              const discountPrice = roomDiscount > 0 ? roomPrice * (1 - roomDiscount / 100) : roomPrice;

              return (
                <div key={roomId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    {roomImage ? (
                      <img
                        src={roomImage}
                        alt={roomName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Room Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-[#c1bd3f] text-white px-3 py-1 rounded-lg font-medium text-sm">
                      {getCategoryLabel(roomCategory)}
                    </div>
                    
                    {/* Discount Badge */}
                    {roomDiscount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{roomDiscount}%
                      </div>
                    )}
                    
                    {/* Availability Badge */}
                    <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      isAvailable 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {isAvailable ? 'Available Now' : 'Sold Out'}
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="p-5">
                    {/* Name and Category */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {roomName}
                      </h3>
                      <p className="text-gray-600 text-sm">{roomCategory}</p>
                    </div>

                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#058505]">
                          {formatPrice(roomPrice, roomDiscount)}
                        </span>
                        <span className="text-gray-500">/night</span>
                        {roomDiscount > 0 && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${roomPrice}
                          </span>
                        )}
                      </div>
                      {roomDiscount > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${(roomPrice - discountPrice).toFixed(0)} per night!
                        </p>
                      )}
                    </div>

                    {/* Room Features */}
                    <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-gray-100">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <FaBed className="h-5 w-5 text-[#c1bd3f]" />
                        </div>
                        <p className="text-sm font-medium">{roomBeds} Bed{roomBeds !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <FaBath className="h-5 w-5 text-[#c1bd3f]" />
                        </div>
                        <p className="text-sm font-medium">{roomBaths} Bath{roomBaths !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                          <TbRulerMeasure className="h-5 w-5 text-[#c1bd3f]" />
                        </div>
                        <p className="text-sm font-medium">{roomMeasurements} sqft</p>
                      </div>
                    </div>

                    {/* Quick Amenities */}
                    <div className="flex gap-3 mb-5">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Wifi className="h-4 w-4" />
                        <span className="text-xs">WiFi</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Coffee className="h-4 w-4" />
                        <span className="text-xs">Coffee</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Tv className="h-4 w-4" />
                        <span className="text-xs">TV</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Wind className="h-4 w-4" />
                        <span className="text-xs">AC</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleViewDetails(room)}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleBooking(room)}
                        disabled={!isAvailable}
                        className={`flex-1 ${
                          isAvailable 
                            ? 'bg-[#c1bd3f] hover:bg-[#a8a535] text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Book Now' : 'Sold Out'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">
              No rooms found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No rooms match "${searchTerm}" in the ${selectedCategory !== "all" ? selectedCategory : "selected"} category.`
                : `No rooms available in the ${selectedCategory !== "all" ? selectedCategory : "selected"} category.`
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
              <Button onClick={fetchRooms} variant="outline">
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Booking Tips Section */}
        <div className="mt-12 bg-gradient-to-r from-[#c1bd3f]/10 to-[#a8a535]/10 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Booking Made Easy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c1bd3f] flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Flexible Dates</h4>
                <p className="text-gray-600 text-sm">
                  Choose your check-in and check-out dates with easy modification options
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c1bd3f] flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Secure Payment</h4>
                <p className="text-gray-600 text-sm">
                  Your payment information is encrypted and protected with industry-standard security
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c1bd3f] flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Instant Confirmation</h4>
                <p className="text-gray-600 text-sm">
                  Receive booking confirmation immediately with all details emailed to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal (Similar to your existing modal) */}
      {isModalOpen && selectedRoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Room Details */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {getRoomProperty(selectedRoom, 'roomName', 'Room')}
                </h2>
                
                {/* Price */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Price per night</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#058505]">
                          {formatPrice(
                            getRoomProperty(selectedRoom, 'roomPrice', 0),
                            getRoomProperty(selectedRoom, 'roomDiscount', 0)
                          )}
                        </span>
                        <span className="text-gray-500">/night</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBooking(selectedRoom)}
                      disabled={getRoomProperty(selectedRoom, 'roomQuantity', 0) <= 0}
                      className={`px-8 ${
                        getRoomProperty(selectedRoom, 'roomQuantity', 0) > 0
                          ? 'bg-[#c1bd3f] hover:bg-[#a8a535] text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {getRoomProperty(selectedRoom, 'roomQuantity', 0) > 0
                        ? 'Proceed to Book'
                        : 'Sold Out'}
                    </Button>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">
                    {getRoomProperty(selectedRoom, 'roomDescription', 'No description available.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const Search = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);