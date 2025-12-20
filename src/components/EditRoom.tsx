import { useState, useEffect } from "react";
import { LiquidButton } from "@/components/ui/liquid";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { updateRoom, getRoomById } from "@/services/api.room.js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Upload } from "lucide-react";

const roomSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  roomDescription: z.string().min(1, "Description is required"),
  roomDiscount: z.number().min(0).max(100),
  roomPrice: z.number().min(1, "Price must be at least 1"),
  roomQuantity: z.number().min(1, "Quantity must be at least 1"),
  roomCategory: z.string().min(1, "Category is required"),
  roomMeasurements: z.number().min(1, "Measurements are required"),
  roomBeds: z.number().min(1, "At least 1 bed is required"),
  roomBaths: z.number().min(0, "Bathrooms cannot be negative"),
});

const ROOM_CATEGORIES = [
  { value: "Deluxe", label: "Deluxe" },
  { value: "Suite", label: "Suite" },
  { value: "Standard", label: "Standard" },
  { value: "Presidential", label: "Presidential" },
  { value: "Family", label: "Family" },
  { value: "Executive", label: "Executive" },
  { value: "Studio", label: "Studio" },
];

export default function EditRoom({ room, isOpen, onClose, onRoomUpdated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Track the file separately
  const [originalImage, setOriginalImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomName: "",
      roomDescription: "",
      roomDiscount: 0,
      roomPrice: 100,
      roomQuantity: 1,
      roomCategory: "",
      roomMeasurements: 200,
      roomBeds: 1,
      roomBaths: 1,
    },
  });

  useEffect(() => {
    if (room && isOpen) {
      populateForm(room);
    }
  }, [room, isOpen]);

  const populateForm = (roomData) => {
    form.reset({
      roomName: roomData.roomName || "",
      roomDescription: roomData.roomDescription || "",
      roomDiscount: roomData.roomDiscount || 0,
      roomPrice: roomData.roomPrice || 100,
      roomQuantity: roomData.roomQuantity || 1,
      roomCategory: roomData.roomCategory || "",
      roomMeasurements: roomData.roomMeasurements || 200,
      roomBeds: roomData.roomBeds || 1,
      roomBaths: roomData.roomBaths || 1,
    });
    
    // Store original image
    if (roomData.roomImage) {
      setImagePreview(roomData.roomImage);
      setOriginalImage(roomData.roomImage);
    } else {
      setImagePreview(null);
      setOriginalImage(null);
    }
    
    // Clear any existing file
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file); // Store the file
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(originalImage); // Reset to original image
  };

  async function onSubmit(data) {
    setIsLoading(true);
    
    // Prepare room data (excluding image)
    const roomData = {
      roomName: data.roomName,
      roomDescription: data.roomDescription,
      roomDiscount: data.roomDiscount,
      roomPrice: data.roomPrice,
      roomQuantity: data.roomQuantity,
      roomCategory: data.roomCategory,
      roomMeasurements: data.roomMeasurements,
      roomBeds: data.roomBeds,
      roomBaths: data.roomBaths,
    };

    console.log("Updating room with data:", roomData);
    console.log("Image file:", imageFile);

    try {
      const result = await updateRoom(room.id, roomData, imageFile);

      if (result?.id) {
        toast.success("Room updated successfully");
        if (onRoomUpdated) onRoomUpdated(result);
        onClose();
      } else {
        throw new Error("Room update returned no ID");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update room");
      console.error("Update room error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate the file
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Room</h2>
            <button onClick={handleClose} disabled={isLoading}>
              <X className="h-5 w-5" />
            </button>
          </div>
          {room?.roomName && (
            <p className="text-sm text-gray-600 mt-1">Editing: {room.roomName}</p>
          )}
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Room Name */}
                <FormField
                  control={form.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name *</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Category */}
                <FormField
                  control={form.control}
                  name="roomCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={isLoading}
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="">Select category</option>
                          {ROOM_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="roomPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <FormField
                  control={form.control}
                  name="roomDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                          min="0"
                          max="100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name="roomQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                          min="1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Measurements */}
                <FormField
                  control={form.control}
                  name="roomMeasurements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (sq. ft.) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                          min="1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Beds */}
                <FormField
                  control={form.control}
                  name="roomBeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                          min="1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Baths */}
                <FormField
                  control={form.control}
                  name="roomBaths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                          disabled={isLoading}
                          min="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="roomDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isLoading}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <FormLabel>Room Image</FormLabel>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-40 mx-auto rounded object-cover"
                      />
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-sm text-red-600 hover:text-red-800"
                          disabled={isLoading}
                        >
                          Remove New Image
                        </button>
                        {originalImage && imagePreview === originalImage && (
                          <span className="text-sm text-gray-500">
                            (Using existing image)
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className="inline-block mt-4 px-4 py-2 bg-gray-100 rounded text-sm cursor-pointer hover:bg-gray-200"
                  >
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Upload a new image or leave as is to keep the current image
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <LiquidButton
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Room"
                  )}
                </LiquidButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}