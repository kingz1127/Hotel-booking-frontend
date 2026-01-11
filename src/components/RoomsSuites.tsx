


import { useState, useEffect } from "react";
import { TbRulerMeasure } from "react-icons/tb";
import {
  FaBath,
  FaBed,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { Card } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { getAllRooms } from "../services/api.room.js";
import { Loader2, ChevronRight, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RoomsSuites() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  // FIXED: Match WalkInBooking's availability calculation
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRooms(0, 20);
      console.log("Fetched rooms for display:", data);

      // FIXED: Use the SAME availability logic as WalkInBooking
      const processedRooms = (data || []).map(room => {
        const roomQuantity = room.roomQuantity || 0;
        const availableRooms = room.availableRooms || 0;
        const isAvailableFlag = room.isAvailable !== false;
        
        // Match WalkInBooking logic:
        // 1. Room has quantity > 0
        // 2. availableRooms > 0
        // 3. isAvailable flag is true
        const isActuallyAvailable = availableRooms > 0 && roomQuantity > 0 && isAvailableFlag;
        
        // Determine availability status exactly like WalkInBooking
        let availabilityStatus = 'available';
        let statusText = '';
        let badgeClass = '';
        
        if (roomQuantity <= 0) {
          availabilityStatus = 'no_inventory';
          statusText = 'No Inventory';
          badgeClass = 'bg-gray-100 text-gray-800';
        } else if (!isActuallyAvailable) {
          availabilityStatus = 'fully_booked';
          statusText = 'Fully Booked';
          badgeClass = 'bg-red-100 text-red-800 border border-red-200';
        } else if (availableRooms > 0) {
          availabilityStatus = 'available';
          statusText = `${availableRooms} available`;
          badgeClass = 'bg-green-100 text-green-800 border border-green-200';
          
          // Add "limited" status if low availability (like WalkInBooking might show)
          if (availableRooms <= 2) {
            statusText = `${availableRooms} left (Limited)`;
            badgeClass = 'bg-orange-100 text-orange-800 border border-orange-200';
          }
        } else {
          availabilityStatus = 'fully_booked';
          statusText = 'Fully Booked';
          badgeClass = 'bg-red-100 text-red-800 border border-red-200';
        }
        
        return {
          ...room,
          availableRooms: availableRooms,
          _roomQuantity: roomQuantity,
          _isAvailable: isActuallyAvailable,
          _availabilityStatus: availabilityStatus,
          _statusText: statusText,
          _badgeClass: badgeClass,
          // Add these fields to match WalkInBooking exactly
          _needsFix: availableRooms > 0 && !isAvailableFlag,
          _shouldBeAvailable: roomQuantity > 0,
          _actualAvailability: isActuallyAvailable
        };
      });

      // Filter out rooms with no inventory (like WalkInBooking does)
      const roomsWithInventory = processedRooms.filter(room => room._roomQuantity > 0);
      
      const limitedRooms = roomsWithInventory.slice(0, 6);
      setRooms(limitedRooms);
      
      // Log to compare with WalkInBooking
      console.log("=== ROOMS SUITES AVAILABILITY ===");
      console.log("Total rooms with inventory:", roomsWithInventory.length);
      console.log("Available rooms:", roomsWithInventory.filter(r => r._actualAvailability).length);
      console.log("Fully booked:", roomsWithInventory.filter(r => !r._actualAvailability).length);
      
      roomsWithInventory.forEach(room => {
        console.log(
          `Room ${room.id} - ${room.roomName}: ` +
          `Quantity: ${room.roomQuantity}, ` +
          `Available: ${room.availableRooms}, ` +
          `Status: ${room._statusText}, ` +
          `Actually Available: ${room._actualAvailability}`
        );
      });
      
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setError("Failed to load rooms. Please try again later.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Format price with discount calculation
  const formatPrice = (price, discount = 0) => {
    if (!price && price !== 0) return "$0";
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(finalPrice);
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      Standard: "Luxury Room",
      Deluxe: "Luxury Room",
      Suite: "Luxury Suite",
      Presidential: "Luxury Suite",
      Family: "Luxury Room",
      Executive: "Luxury Suite",
      Studio: "Luxury Room",
    };
    return categoryLabels[category] || "Room";
  };

  // Safe property access
  const getRoomProperty = (room, property, defaultValue = "") => {
    if (!room) return defaultValue;
    return room[property] !== undefined ? room[property] : defaultValue;
  };

  // Get availability status text
  const getAvailabilityText = (room) => {
    if (room._statusText) {
      return room._statusText;
    }
    
    const availableRooms = getRoomProperty(room, "availableRooms", 0);
    const roomQuantity = getRoomProperty(room, "roomQuantity", 0);
    
    if (roomQuantity <= 0) {
      return 'No Inventory';
    } else if (availableRooms <= 0) {
      return 'Fully Booked';
    } else if (availableRooms <= 2) {
      return `${availableRooms} left (Limited)`;
    } else {
      return `${availableRooms} available`;
    }
  };

  // Get availability badge color
  const getAvailabilityBadgeClass = (room) => {
    if (room._badgeClass) {
      return room._badgeClass;
    }
    
    const availableRooms = getRoomProperty(room, "availableRooms", 0);
    const roomQuantity = getRoomProperty(room, "roomQuantity", 0);
    
    if (roomQuantity <= 0) {
      return 'bg-gray-100 text-gray-800';
    } else if (availableRooms <= 0) {
      return 'bg-red-100 text-red-800 border border-red-200';
    } else if (availableRooms <= 2) {
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    } else {
      return 'bg-green-100 text-green-800 border border-green-200';
    }
  };

  // Handle room click
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    document.body.style.overflow = "unset";
  };

  // Check if room is available for booking (same as WalkInBooking)
  const isRoomAvailable = (room) => {
    if (!room) return false;
    
    // Use the same logic as WalkInBooking
    const roomQuantity = getRoomProperty(room, "roomQuantity", 0);
    const availableRooms = getRoomProperty(room, "availableRooms", 0);
    const isAvailableFlag = getRoomProperty(room, "isAvailable", true);
    
    // Exactly the same logic as WalkInBooking's _actualAvailability
    return roomQuantity > 0 && availableRooms > 0 && isAvailableFlag !== false;
  };

  // Enhanced Book Now handler
  const handleBookNow = (room) => {
    console.log("=== BOOK NOW CLICKED ===");
    console.log("Room:", room.roomName, "ID:", room.id);
    
    // Check availability using same logic as WalkInBooking
    if (!isRoomAvailable(room)) {
      console.log("❌ Room not available for booking");
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>This room is no longer available. Please select another room.</span>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          icon: false,
        }
      );
      closeModal();
      return;
    }

    // Check for limited availability
    const availableRooms = getRoomProperty(room, "availableRooms", 0);
    if (availableRooms <= 2) {
      toast.warning(
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">Limited Availability!</span>
          </div>
          <p className="text-sm mt-1">Only {availableRooms} room(s) left</p>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          icon: false,
        }
      );
    }

    // Store comprehensive room details for after login
    const roomDetails = {
      id: room.id,
      name: room.roomName,
      category: room.roomCategory,
      price: room.roomPrice,
      discount: room.roomDiscount,
      availableRooms: availableRooms,
      roomQuantity: room.roomQuantity,
      isAvailable: room.isAvailable,
      image: room.roomImage,
      beds: room.roomBeds,
      baths: room.roomBaths,
      size: room.roomMeasurements
    };

    sessionStorage.setItem("selectedRoomDetails", JSON.stringify(roomDetails));
    sessionStorage.setItem("redirectAfterLogin", `/booking/${room.id}`);
    sessionStorage.setItem("requiresLoginForBooking", "true");
    
    console.log("Room details stored in sessionStorage:", roomDetails);

    // Show login prompt with room details
    toast.info(
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">Login Required</span>
        </div>
        <p className="text-sm mt-1">
          Please login to book "<strong>{room.roomName}</strong>"
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Price: {formatPrice(room.roomPrice, room.roomDiscount)}/night
        </p>
      </div>,
      {
        position: "top-center",
        autoClose: 4000,
        icon: false,
      }
    );

    closeModal();
    
    // Navigate to login page
    setTimeout(() => {
      navigate("/login", { 
        state: { 
          fromBooking: true,
          roomName: room.roomName,
          roomPrice: formatPrice(room.roomPrice, room.roomDiscount)
        }
      });
    }, 100);
  };

  // Prevent modal close when clicking inside modal content
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 mb-10 min-h-[400px] px-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#c1bd3f]" />
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Loading available rooms...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 mb-10 min-h-[400px] px-4">
        <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
        <button
          onClick={fetchRooms}
          className="mt-4 px-4 py-2 bg-[#c1bd3f] text-white rounded hover:bg-[#a8a535] text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 mb-10 min-h-[400px] px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-[#c1bd3f]">
          Rooms & Suites
        </p>
        <p className="text-3xl sm:text-4xl md:text-5xl mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 md:mb-8 font-serif text-center">
          Luxury Rooms & Suites
        </p>
        <p className="text-gray-600 text-sm sm:text-base">
          No rooms available at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10 px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-[#c1bd3f]">
          Rooms & Suites
        </p>
        <p className="text-3xl sm:text-4xl md:text-5xl mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 md:mb-8 font-serif text-center">
          Luxury Rooms & Suites
        </p>

        {/* Availability Legend */}
        <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Fully Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>No Inventory</span>
          </div>
        </div>

        <div className="w-full max-w-7xl">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 sm:-ml-4 gap-3 sm:gap-5">
              {rooms.map((room) => {
                const roomId = getRoomProperty(room, "id");
                const roomName = getRoomProperty(
                  room,
                  "roomName",
                  "Unnamed Room"
                );
                const roomCategory = getRoomProperty(
                  room,
                  "roomCategory",
                  "Standard"
                );
                const roomPrice = getRoomProperty(room, "roomPrice", 0);
                const roomDiscount = getRoomProperty(room, "roomDiscount", 0);
                const roomImage = getRoomProperty(room, "roomImage", "");
                const roomBeds = getRoomProperty(room, "roomBeds", 1);
                const roomBaths = getRoomProperty(room, "roomBaths", 1);
                const roomMeasurements = getRoomProperty(
                  room,
                  "roomMeasurements",
                  300
                );

                const categoryLabel = getCategoryLabel(roomCategory);
                const displayPrice = formatPrice(roomPrice, roomDiscount);
                const isAvailable = isRoomAvailable(room);
                const availabilityText = getAvailabilityText(room);
                const availabilityBadgeClass = getAvailabilityBadgeClass(room);

                return (
                  <CarouselItem
                    key={roomId}
                    className="
                      pl-2 sm:pl-4 
                      basis-full 
                      sm:basis-1/2 
                      md:basis-1/3 
                      lg:basis-1/4 
                      xl:basis-1/5
                    "
                  >
                    <Card
                      className={`
                        p-2 
                        w-full 
                        max-w-[16rem] 
                        mx-auto
                        h-auto
                        sm:h-96 
                        hover:shadow-xl 
                        transition-all 
                        duration-300 
                        cursor-pointer 
                        hover:scale-[1.02]
                        ${!isAvailable ? 'opacity-80' : ''}
                      `}
                      onClick={() => handleRoomClick(room)}
                    >
                      {/* Room Image */}
                      <div className="relative">
                        {roomImage ? (
                          <img
                            src={roomImage}
                            alt={roomName}
                            className="w-full h-40 sm:h-48 rounded-tl-xl rounded-tr-xl object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/240x192?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-40 sm:h-48 rounded-tl-xl rounded-tr-xl bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs sm:text-sm">
                              No Image
                            </span>
                          </div>
                        )}

                        {/* Category Badge */}
                        <div
                          className="
                          bg-my-Bg 
                          h-7 sm:h-8 
                          w-24 sm:w-28 
                          flex 
                          items-center 
                          absolute 
                          p-1.5 sm:p-2 
                          mt-8 sm:mt-10 
                          bottom-0 
                          left-0 
                          text-white 
                          text-xs sm:text-sm
                          rounded-tl-[5px] 
                          rounded-tr-[5px] 
                          rounded-br-[5px] 
                          rounded-bl-0
                        "
                        >
                          {categoryLabel}
                        </div>

                        {/* Discount Badge if applicable */}
                        {roomDiscount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{roomDiscount}%
                          </div>
                        )}

                        {/* Overlay for fully booked rooms */}
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-tl-xl rounded-tr-xl">
                            <span className="text-white font-bold text-lg px-4 py-2 bg-red-600/80 rounded-lg">
                              Fully Booked
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Room Details */}
                      <div className="-mt-5 sm:-mt-6 p-1.5 rounded-bl-xl rounded-br-xl">
                        {/* Price */}
                        <div className="flex items-center gap-1 mt-2 sm:mt-3">
                          <p className="text-[#058505] text-xl sm:text-2xl font-serif">
                            {displayPrice}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            /night
                          </p>
                          {roomDiscount > 0 && (
                            <span className="text-xs sm:text-sm text-gray-400 line-through ml-2">
                              ${roomPrice}
                            </span>
                          )}
                        </div>

                        {/* Room Name */}
                        <p className="font-serif h-auto sm:h-9 mt-2 sm:mt-3.5 text-base sm:text-lg font-medium line-clamp-2">
                          {roomName}
                        </p>

                        {/* Room Category */}
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                          {roomCategory}
                        </p>

                        {/* Availability Badge */}
                        <div className={`inline-block px-2 py-1 rounded text-xs mb-2 ${availabilityBadgeClass}`}>
                          {availabilityText}
                        </div>

                        <hr className="my-2" />

                        {/* Room Features */}
                        <div className="flex justify-around items-center mt-2 sm:mt-3.5 text-xs sm:text-sm">
                          <p className="flex gap-0.5 items-center justify-center">
                            <FaBed className="text-[#c1bd3f] text-sm sm:text-base" />
                            <span className="hidden sm:inline">
                              {roomBeds} Bed{roomBeds !== 1 ? "s" : ""}
                            </span>
                            <span className="sm:hidden">{roomBeds}</span>
                          </p>
                          <p className="flex gap-0.5 items-center justify-center">
                            <FaBath className="text-[#c1bd3f] text-sm sm:text-base" />
                            <span className="hidden sm:inline">
                              {roomBaths} Bath{roomBaths !== 1 ? "s" : ""}
                            </span>
                            <span className="sm:hidden">{roomBaths}</span>
                          </p>
                          <p className="flex gap-0.5 items-center justify-center">
                            <TbRulerMeasure className="text-[#c1bd3f] text-sm sm:text-base" />
                            <span className="hidden sm:inline">
                              {roomMeasurements} sqft
                            </span>
                            <span className="sm:hidden">
                              {roomMeasurements}
                            </span>
                          </p>
                        </div>

                        {/* View Details Button */}
                        <div className="mt-3 sm:mt-4 text-center">
                          <button className="text-[#c1bd3f] text-xs sm:text-sm font-medium hover:text-[#a8a535] flex items-center justify-center gap-1 mx-auto">
                            View Details{" "}
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        {/* Show count with availability summary */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm md:text-base">
          <p className="text-gray-500">
            Showing {rooms.length} room{rooms.length !== 1 ? "s" : ""}
          </p>
          <p className="text-gray-600 mt-1">
            <span className="text-green-600">
              {rooms.filter(r => r._availabilityStatus === 'available').length} available
            </span> • 
            <span className="text-orange-600 mx-2">
              {rooms.filter(r => r._statusText && r._statusText.includes('Limited')).length} limited
            </span> • 
            <span className="text-red-600">
              {rooms.filter(r => r._availabilityStatus === 'fully_booked').length} fully booked
            </span>
          </p>
        </div>
      </div>

      {/* Room Details Modal */}
      {isModalOpen && selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="
              bg-white 
              rounded-xl sm:rounded-2xl 
              w-full 
              max-w-4xl 
              max-h-[95vh] sm:max-h-[90vh] 
              overflow-hidden
            "
            onClick={handleModalClick}
          >
            {/* Modal Header */}
            <div className="relative">
              {/* Room Image */}
              {getRoomProperty(selectedRoom, "roomImage") ? (
                <img
                  src={getRoomProperty(selectedRoom, "roomImage")}
                  alt={getRoomProperty(selectedRoom, "roomName", "Room")}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x256?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-base sm:text-lg">
                    No Image Available
                  </span>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full transition-colors"
              >
                <FaTimes className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800" />
              </button>

              {/* Category Badge */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-my-Bg px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-lg font-medium text-xs sm:text-sm">
                {getCategoryLabel(
                  getRoomProperty(selectedRoom, "roomCategory", "Standard")
                )}
              </div>

              {/* Discount Badge */}
              {getRoomProperty(selectedRoom, "roomDiscount", 0) > 0 && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                  -{getRoomProperty(selectedRoom, "roomDiscount")}% OFF
                </div>
              )}

              {/* Availability Badge */}
              <div className={`absolute top-2 sm:top-4 right-12 sm:right-16 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm ${getAvailabilityBadgeClass(selectedRoom)}`}>
                {getAvailabilityText(selectedRoom)}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-192px)] sm:max-h-[calc(90vh-256px)]">
              {/* Room Name and Price */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900">
                    {getRoomProperty(selectedRoom, "roomName", "Unnamed Room")}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {getRoomProperty(selectedRoom, "roomCategory", "Standard")}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[#058505] text-2xl sm:text-3xl font-bold">
                      {formatPrice(
                        getRoomProperty(selectedRoom, "roomPrice", 0),
                        getRoomProperty(selectedRoom, "roomDiscount", 0)
                      )}
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base">
                      /night
                    </span>
                  </div>
                  {getRoomProperty(selectedRoom, "roomDiscount", 0) > 0 && (
                    <span className="text-gray-400 line-through text-sm sm:text-base">
                      ${getRoomProperty(selectedRoom, "roomPrice", 0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Availability Details */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Availability Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600">Total Rooms:</p>
                    <p className="font-semibold">{getRoomProperty(selectedRoom, "roomQuantity", 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Now:</p>
                    <p className="font-semibold">{getRoomProperty(selectedRoom, "availableRooms", 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className={`font-semibold ${getAvailabilityBadgeClass(selectedRoom)} px-2 py-1 rounded inline-block`}>
                      {getAvailabilityText(selectedRoom)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Can Book:</p>
                    <p className={`font-semibold ${isRoomAvailable(selectedRoom) ? 'text-green-600' : 'text-red-600'}`}>
                      {isRoomAvailable(selectedRoom) ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Limited Availability Warning */}
              {selectedRoom._statusText && selectedRoom._statusText.includes('Limited') && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-orange-700 text-sm">
                        Limited Availability
                      </p>
                      <p className="text-orange-600 text-xs mt-1">
                        Only {getRoomProperty(selectedRoom, "availableRooms", 0)} room(s) left. Book now to secure your stay!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fully Booked Warning */}
              {!isRoomAvailable(selectedRoom) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-700 text-sm">
                        Not Available for Booking
                      </p>
                      <p className="text-red-600 text-xs mt-1">
                        This room is currently fully booked. Please select another room.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Room Description */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {getRoomProperty(
                    selectedRoom,
                    "roomDescription",
                    "No description available."
                  )}
                </p>
              </div>

              {/* Room Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                  <FaBed className="h-5 w-5 sm:h-6 sm:w-6 text-[#c1bd3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm sm:text-base">
                    {getRoomProperty(selectedRoom, "roomBeds", 1)} Bed
                    {getRoomProperty(selectedRoom, "roomBeds", 1) !== 1
                      ? "s"
                      : ""}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Sleeps {getRoomProperty(selectedRoom, "roomBeds", 1) * 2}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                  <FaBath className="h-5 w-5 sm:h-6 sm:w-6 text-[#c1bd3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm sm:text-base">
                    {getRoomProperty(selectedRoom, "roomBaths", 1)} Bath
                    {getRoomProperty(selectedRoom, "roomBaths", 1) !== 1
                      ? "s"
                      : ""}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Private bathroom
                  </p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                  <TbRulerMeasure className="h-5 w-5 sm:h-6 sm:w-6 text-[#c1bd3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm sm:text-base">
                    {getRoomProperty(selectedRoom, "roomMeasurements", 300)}{" "}
                    sqft
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Room size</p>
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-center">
                  <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-[#c1bd3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm sm:text-base">
                    {getRoomProperty(selectedRoom, "availableRooms", 0)} Available
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Units left</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => handleBookNow(selectedRoom)}
                  disabled={!isRoomAvailable(selectedRoom)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    isRoomAvailable(selectedRoom)
                      ? "bg-[#c1bd3f] hover:bg-[#a8a535] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isRoomAvailable(selectedRoom)
                    ? "Login to Book Now"
                    : "Fully Booked"}
                </button>
              </div>

              {/* Login Notice */}
              {isRoomAvailable(selectedRoom) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-xs sm:text-sm text-center">
                    <strong>Note:</strong> You must be logged in as a customer to book this room.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}