

import AddRoom from "@/components/AddRoom";
import { useEffect, useState, useCallback } from "react";
import { getAllRooms, deleteRoom } from "../../services/api.room.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import EditRoom from "@/components/EditRoom";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllRooms(0, 50);
      console.log("Fetched rooms data:", data); // Debug log
      setRooms(data || []); // Ensure it's always an array
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      toast.error("Failed to fetch rooms");
      setRooms([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle delete
  async function handleDelete(roomId, roomName) {
    if (!window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(roomId);
    try {
      await deleteRoom(roomId);
      toast.success("Room deleted successfully");
      
      // Update local state
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete room");
    } finally {
      setDeletingId(null);
    }
  }

  // Handle edit
  function handleEdit(room) {
    setEditingRoom(room);
    setIsEditDialogOpen(true);
  }

  // Handle room update success
  const handleRoomUpdated = (updatedRoom) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
    setIsEditDialogOpen(false);
    setEditingRoom(null);
  };

  // Handle room added
  const handleRoomAdded = (newRoom) => {
    console.log("New room added:", newRoom); // Debug log
    // Check if newRoom has id property
    if (newRoom && newRoom.id) {
      setRooms(prevRooms => [newRoom, ...prevRooms]);
      toast.success("Room added successfully");
    } else {
      // If no ID, refetch the list
      fetchRooms();
      toast.success("Room added successfully");
    }
  };

  // Format price display
  const formatPrice = (price) => {
    if (!price && price !== 0) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Safe access to room properties
  const getRoomProperty = (room, property, defaultValue = "") => {
    if (!room) return defaultValue;
    return room[property] !== undefined ? room[property] : defaultValue;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage your property's rooms and pricing</p>
        </div>
        <AddRoom onRoomAdded={handleRoomAdded} />
      </div>

      {/* Edit Room Dialog */}
      {isEditDialogOpen && editingRoom && (
        <EditRoom
          room={editingRoom}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingRoom(null);
          }}
          onRoomUpdated={handleRoomUpdated}
        />
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading rooms...</span>
          </div>
        ) : rooms.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700">Price</TableHead>
                  <TableHead className="font-semibold text-gray-700">Discount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Qty</TableHead>
                  <TableHead className="font-semibold text-gray-700">Beds</TableHead>
                  <TableHead className="font-semibold text-gray-700">Baths</TableHead>
                  <TableHead className="font-semibold text-gray-700">Image</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  // Safely access room properties
                  const roomId = getRoomProperty(room, 'id', 'N/A');
                  const roomName = getRoomProperty(room, 'roomName', 'Unnamed');
                  const roomCategory = getRoomProperty(room, 'roomCategory', '');
                  const roomPrice = getRoomProperty(room, 'roomPrice', 0);
                  const roomDiscount = getRoomProperty(room, 'roomDiscount', 0);
                  const roomQuantity = getRoomProperty(room, 'roomQuantity', 0);
                  const roomBeds = getRoomProperty(room, 'roomBeds', 0);
                  const roomBaths = getRoomProperty(room, 'roomBaths', 0);
                  const roomImage = getRoomProperty(room, 'roomImage', '');

                  return (
                    <TableRow 
                      key={roomId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900">
                        {roomId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {roomName}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {roomCategory}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(roomPrice)}
                      </TableCell>
                      <TableCell>
                        {roomDiscount > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {roomDiscount}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${roomQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {roomQuantity}
                        </span>
                      </TableCell>
                      <TableCell>{roomBeds}</TableCell>
                      <TableCell>{roomBaths}</TableCell>
                      <TableCell>
                        {roomImage ? (
                          <div className="relative group">
                            <img
                              src={roomImage}
                              alt={roomName}
                              className="h-16 w-24 object-cover rounded-md border border-gray-200"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/96x64?text=No+Image';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3"
                          onClick={() => handleEdit(room)}
                          title="Edit room"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-3"
                          onClick={() => handleDelete(roomId, roomName)}
                          disabled={deletingId === roomId}
                          title="Delete room"
                        >
                          {deletingId === roomId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No rooms found</h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Get started by adding your first room. Rooms will appear here once added.
            </p>
            <div className="mt-6">
              <AddRoom onRoomAdded={handleRoomAdded} />
            </div>
          </div>
        )}
      </div>

      {/* Optional: Add pagination if needed */}
      {rooms.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
          </div>
          {/* Add pagination controls here if your API supports it */}
        </div>
      )}
    </div>
  );
}