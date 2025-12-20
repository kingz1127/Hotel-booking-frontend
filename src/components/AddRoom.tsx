// import { useState } from "react";
// import { LiquidButton } from "./ui/liquid";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { createRoom } from "../services/api.Room.js";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
// import { Input } from "./ui/input.js";




// export default function AddRoom() {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null); // ✅ preview
//   const navigate = useNavigate();

//   const roomSchema = z.object({
//     roomName: z.string().min(4, { message: "Room name must be at least 4 characters." }),
//     roomDescription: z.string().min(4, { message: "Room description must be at least 4 characters." }),
//     roomDiscount: z.number().min(0, { message: "Discount cannot be negative." }).max(100, { message: "Discount cannot exceed 100%." }),
//     roomPrice: z.number().min(1, { message: "Price must be at least 1." }).max(1_000_000_000, { message: "Price is too large." }),
//     roomQuantity: z.number().int().min(1, { message: "Quantity must be at least 1." }),
//     roomCategory: z.string().min(3, { message: "Room category must be at least 3 characters." }),
//     roomMeasurements: z.number().int().min(1, { message: "Measurements must be at least 1." }),
//     roomBeds: z.number().int().min(1, { message: "At least 1 bed is required." }),
//     roomBaths: z.number().int().min(0, { message: "Bathrooms cannot be negative." }),
//     roomImage: z.string().min(1, { message: "Room image is required." }),
//   });

//   const form = useForm({
//     resolver: zodResolver(roomSchema),
//     defaultValues: {
//       roomName: "",
//       roomDescription: "",
//       roomDiscount: 0,
//       roomPrice: 0,
//       roomQuantity: 1,
//       roomCategory: "",
//       roomMeasurements: 0,
//       roomBeds: 1,
//       roomBaths: 0,
//       roomImage: "",
//     },
//   });

//   async function onSubmit(data) {
//     setIsLoading(true);

//     try {
//       const result = await createRoom(data);

//       if (result?.id) {
//         toast.success("Room created successfully");
//         form.reset();
//         setImagePreview(null); // clear preview
//         setOpen(false);
//         navigate("/rooms");
//       } else {
//         toast.error("Room creation incomplete");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Please try again later");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <>
//       <div>
//         <LiquidButton onClick={() => setOpen(true)}>Add Rooms</LiquidButton>
//       </div>

//       {open && (
//          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//     <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] p-6 shadow-xl overflow-y-auto"> {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">Add Rooms</h2>
//               <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black text-xl">×</button>
//             </div>

// <div className="mt-12 mb-12">
//             {/* Form */}
//             <Form {...form} >
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 {/* ROOM NAME */}
//                 <FormField
//                   control={form.control}
//                   name="roomName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Room Name</FormLabel>
//                       <FormControl>
                        
//                         <Input placeholder="Room Name" {...field} disabled={isLoading} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM DESCRIPTION */}
//                 <FormField
//                   control={form.control}
//                   name="roomDescription"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Room description" {...field} disabled={isLoading} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM PRICE */}
//                 <FormField
//                   control={form.control}
//                   name="roomPrice"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Price</FormLabel>
//                       <FormControl>
//                         <Input type="number" placeholder="Price" {...field} onChange={(e) => field.onChange(+e.target.value)} disabled={isLoading} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM DISCOUNT */}
//                 <FormField
//                   control={form.control}
//                   name="roomDiscount"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Discount (%)</FormLabel>
//                       <FormControl>
//                         <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} disabled={isLoading} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM QUANTITY */}
//                 <FormField
//                   control={form.control}
//                   name="roomQuantity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Quantity</FormLabel>
//                       <FormControl>
//                         <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} disabled={isLoading} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM CATEGORY */}
//                 <FormField
//                   control={form.control}
//                   name="roomCategory"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Category</FormLabel>
//                       <FormControl>
//                         <select
//           {...field}
//           id="roomCategory"
//           name="roomCategory"
//           disabled={isLoading}
//           className="w-full rounded-md border border-gray-300 p-2"
//         >
//           <option value="">Select a room category</option>
//           <option value="Deluxe">Deluxe</option>
//           <option value="Suite">Suite</option>
//           <option value="Standard">Standard</option>
//           <option value="Presidential">Presidential</option>
//           <option value="Family">Family</option>
//         </select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* ROOM IMAGE */}
//                 <FormField
//                   control={form.control}
//                   name="roomImage"
//                   render={() => (
//                     <FormItem>
//                       <FormLabel>Room Image</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           disabled={isLoading}
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;

//                             // Validate size (5MB max)
//                             if (file.size > 5 * 1024 * 1024) {
//                               toast.error("Image size must be less than 5MB");
//                               return;
//                             }

//                             const reader = new FileReader();
//                             reader.onloadend = () => {
//                               form.setValue("roomImage", reader.result);
//                               setImagePreview(reader.result);
//                             };
//                             reader.readAsDataURL(file);
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                       {imagePreview && (
//                         <img
//                           src={imagePreview}
//                           alt="Room Preview"
//                           className="mt-2 h-32 w-32 object-cover rounded-md"
//                         />
//                       )}
//                     </FormItem>
//                   )}
//                 />

//                 <LiquidButton type="submit" disabled={isLoading} className="rounded-full bg-blue-500 w-40 h-10 text-white mx-auto block">
//                   {isLoading ? "Creating..." : "Create Room"}
//                 </LiquidButton>
//               </form>
//             </Form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


// import { useState } from "react";
// import { LiquidButton } from "./ui/liquid";
// import z from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { useNavigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { createRoom } from "../services/api.Room.js";
// import { Input } from "./ui/input.js";
// import { useForm } from "react-hook-form";

// export default function AddRoom({ onRoomAdded }) {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const navigate = useNavigate();

//   const roomSchema = z.object({
//     roomName: z.string().min(4, { message: "Room name must be at least 4 characters." }),
//     roomDescription: z.string().min(4, { message: "Room description must be at least 4 characters." }),
//     roomDiscount: z.number().min(0).max(100),
//     roomPrice: z.number().min(1).max(1_000_000_000),
//     roomQuantity: z.number().int().min(1),
//     roomCategory: z.string().min(3),
//     roomMeasurements: z.number().int().min(1),
//     roomBeds: z.number().int().min(1),
//     roomBaths: z.number().int().min(0),
//     roomImage: z.string().min(1),
//   });

//   const form = useForm({
//     resolver: zodResolver(roomSchema),
//     defaultValues: {
//       roomName: "",
//       roomDescription: "",
//       roomDiscount: 0,
//       roomPrice: 0,
//       roomQuantity: 1,
//       roomCategory: "",
//       roomMeasurements: 0,
//       roomBeds: 1,
//       roomBaths: 0,
//       roomImage: "",
//     },
//   });

//   async function onSubmit(data) {
//     setIsLoading(true);

//     const backendData = {
//       roomName: data.roomName,
//       roomDescription: data.roomDescription,
//       roomDiscount: data.roomDiscount,
//       roomPrice: data.roomPrice,
//       roomQuantity: data.roomQuantity,
//       roomCategory: data.roomCategory,
//       roomMeasurements: data.roomMeasurements,
//       roomBeds: data.roomBeds,
//       roomBaths: data.roomBaths,
//       roomImage: data.roomImage,
//     };

//     try {
//       const result = await createRoom(backendData);

//       if (result && result.id) {
//         toast.success("Room created successfully");
//         form.reset();
//         setImagePreview(null);
//         setOpen(false);

//         // Notify parent to refresh table
//         if (onRoomAdded) onRoomAdded();
//       } else {
//         toast.error("Room creation incomplete");
//       }
//     } catch (error) {
//       toast.error(`Creating failed: ${error?.message || "Please try again later"}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <>
//       <div>
//         <LiquidButton onClick={() => setOpen(true)}>Add Rooms</LiquidButton>
//       </div>

//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
//           <div className="bg-white rounded-2xl w-[90%] max-w-lg p-6 shadow-xl my-8">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold">Add Rooms</h2>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-gray-500 hover:text-black text-xl"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Form */}
//             <div className="mt-4 mb-4">
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   {/* ROOM NAME */}
//                   <FormField
//                     control={form.control}
//                     name="roomName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Room Name</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Room Name" {...field} disabled={isLoading} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* ROOM DESCRIPTION */}
//                   <FormField
//                     control={form.control}
//                     name="roomDescription"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Room description" {...field} disabled={isLoading} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* ROOM PRICE */}
//                   <FormField
//                     control={form.control}
//                     name="roomPrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="Price"
//                             {...field}
//                             onChange={(e) => field.onChange(+e.target.value)}
//                             disabled={isLoading}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* ROOM DISCOUNT */}
//                   <FormField
//                     control={form.control}
//                     name="roomDiscount"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Discount (%)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             {...field}
//                             onChange={(e) => field.onChange(+e.target.value)}
//                             disabled={isLoading}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* ROOM CATEGORY */}
//                   <FormField
//                     control={form.control}
//                     name="roomCategory"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Category</FormLabel>
//                         <FormControl>
//                           <select
//                             {...field}
//                             id="roomCategory"
//                             name="roomCategory"
//                             disabled={isLoading}
//                             className="w-full rounded-md border border-gray-300 p-2"
//                           >
//                             <option value="">Select a room category</option>
//                             <option value="Deluxe">Deluxe</option>
//                             <option value="Suite">Suite</option>
//                             <option value="Standard">Standard</option>
//                             <option value="Presidential">Presidential</option>
//                             <option value="Family">Family</option>
//                           </select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {/* ROOM IMAGE */}
//                   <FormField
//                     control={form.control}
//                     name="roomImage"
//                     render={() => (
//                       <FormItem>
//                         <FormLabel>Room Image</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="file"
//                             accept="image/*"
//                             disabled={isLoading}
//                             onChange={(e) => {
//                               const file = e.target.files?.[0];
//                               if (!file) return;

//                               if (file.size > 5 * 1024 * 1024) {
//                                 toast.error("Image size must be less than 5MB");
//                                 return;
//                               }

//                               const reader = new FileReader();
//                               reader.onloadend = () => {
//                                 form.setValue("roomImage", reader.result);
//                                 setImagePreview(reader.result);
//                               };
//                               reader.readAsDataURL(file);
//                             }}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                         {imagePreview && (
//                           <img
//                             src={imagePreview}
//                             alt="Room Preview"
//                             className="mt-2 h-20 w-32 object-cover rounded-md"
//                           />
//                         )}
//                       </FormItem>
//                     )}
//                   />

//                   <LiquidButton
//                     type="submit"
//                     disabled={isLoading}
//                     className="rounded-full bg-blue-500 w-40 h-10 text-white mx-auto block"
//                   >
//                     {isLoading ? "Creating..." : "Create Room"}
//                   </LiquidButton>
//                 </form>
//               </Form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





import { useState } from "react";
import { LiquidButton } from "./ui/liquid";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { createRoom } from "../services/api.Room.js";
import { Input } from "./ui/input.js";
import { Textarea } from "./ui/textarea"; // Assuming you have this component
import { Loader2, X, Upload } from "lucide-react";

const roomSchema = z.object({
  roomName: z.string()
    .min(4, { message: "Room name must be at least 4 characters." })
    .max(100, { message: "Room name must not exceed 100 characters." }),
  roomDescription: z.string()
    .min(4, { message: "Room description must be at least 4 characters." })
    .max(500, { message: "Description must not exceed 500 characters." }),
  roomDiscount: z.number()
    .min(0, { message: "Discount cannot be negative." })
    .max(100, { message: "Discount cannot exceed 100%." })
    .default(0),
  roomPrice: z.number()
    .min(1, { message: "Price must be at least 1." })
    .max(1_000_000_000, { message: "Price is too large." }),
  roomQuantity: z.number()
    .int()
    .min(1, { message: "Quantity must be at least 1." })
    .max(1000, { message: "Quantity is too large." }),
  roomCategory: z.string()
    .min(1, { message: "Please select a category." }),
  roomMeasurements: z.number()
    .int()
    .min(1, { message: "Measurements must be at least 1 sq. ft." })
    .max(10000, { message: "Measurements are too large." }),
  roomBeds: z.number()
    .int()
    .min(1, { message: "At least 1 bed is required." })
    .max(20, { message: "Maximum 20 beds allowed." }),
  roomBaths: z.number()
    .int()
    .min(0, { message: "Bathrooms cannot be negative." })
    .max(10, { message: "Maximum 10 bathrooms allowed." }),
  roomImage: z.string()
    .min(1, { message: "Room image is required." })
    .refine(val => val.startsWith('data:image/'), { 
      message: "Please upload a valid image file." 
    }),
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

export default function AddRoom({ onRoomAdded }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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
      roomImage: "",
    },
  });

  const handleImageUpload = (file) => {
    if (!file) return false;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return false;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("roomImage", reader.result);
      form.clearErrors("roomImage");
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    return true;
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

  console.log("Room data:", roomData);

  try {
    let imageFile = null;
    
    // Convert base64 to File if image is provided
    if (data.roomImage && data.roomImage.startsWith('data:image/')) {
      // Convert base64 to blob
      const base64Response = await fetch(data.roomImage);
      const blob = await base64Response.blob();
      imageFile = new File([blob], 'room-image.jpg', { type: 'image/jpeg' });
    } else if (data.roomImage instanceof File) {
      imageFile = data.roomImage;
    }
    
    console.log("Image file:", imageFile);
    
    const result = await createRoom(roomData, imageFile);

    if (result?.id) {
      toast.success("Room created successfully");
      form.reset();
      setImagePreview(null);
      setOpen(false);

      // Notify parent to refresh table
      if (onRoomAdded) onRoomAdded(result);
    } else {
      toast.error("Room creation incomplete");
    }
  } catch (error) {
    toast.error(`Creating failed: ${error?.message || "Please try again later"}`);
    console.error("Create room error:", error);
  } finally {
    setIsLoading(false);
  }
}

  // Optional image compression function
  const compressImageIfNeeded = async (base64Image, maxWidth = 1200) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressed);
      };
      img.onerror = () => resolve(base64Image);
    });
  };

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
      handleImageUpload(file);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      form.reset();
      setImagePreview(null);
    }
  };

  return (
    <>
      <LiquidButton
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 text-sm font-medium"
      >
        Add New Room
      </LiquidButton>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all">
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Room</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Fill in the details to add a new room to your property
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Room Name */}
                      <FormField
                        control={form.control}
                        name="roomName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Room Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Deluxe Ocean View Suite" 
                                {...field} 
                                disabled={isLoading}
                                className="h-11"
                              />
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
                            <FormLabel className="font-medium">Category *</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                disabled={isLoading}
                                className="w-full h-11 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <FormLabel className="font-medium">Price ($) *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(+e.target.value)}
                                  disabled={isLoading}
                                  className="h-11 pl-8"
                                  min="1"
                                  step="0.01"
                                />
                              </div>
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
                            <FormLabel className="font-medium">Discount (%)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(+e.target.value)}
                                  disabled={isLoading}
                                  className="h-11"
                                  min="0"
                                  max="100"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  %
                                </span>
                              </div>
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
                            <FormLabel className="font-medium">Quantity *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                                disabled={isLoading}
                                className="h-11"
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
                            <FormLabel className="font-medium">Size (sq. ft.) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="200"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                                disabled={isLoading}
                                className="h-11"
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
                            <FormLabel className="font-medium">Beds *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                                disabled={isLoading}
                                className="h-11"
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
                            <FormLabel className="font-medium">Bathrooms *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(+e.target.value)}
                                disabled={isLoading}
                                className="h-11"
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
                          <FormLabel className="font-medium">Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the room features, amenities, and unique selling points..."
                              {...field}
                              disabled={isLoading}
                              className="min-h-[100px] resize-none"
                              maxLength={500}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            <FormMessage />
                            <span className="text-xs text-gray-500">
                              {field.value.length}/500
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Image Upload */}
                    <FormField
                      control={form.control}
                      name="roomImage"
                      render={() => (
                        <FormItem>
                          <FormLabel className="font-medium">Room Image *</FormLabel>
                          <div
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                              dragOver 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            } ${form.formState.errors.roomImage ? 'border-red-300' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            {imagePreview ? (
                              <div className="space-y-4">
                                <div className="relative inline-block">
                                  <img
                                    src={imagePreview}
                                    alt="Room preview"
                                    className="h-48 w-full object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview(null);
                                      form.setValue("roomImage", "");
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Click or drag to replace image
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 mb-2">
                                  <span className="text-blue-600 font-medium">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 5MB
                                </p>
                              </>
                            )}
                            <Input
                              type="file"
                              accept="image/*"
                              disabled={isLoading}
                              className="hidden"
                              id="roomImageInput"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                              }}
                            />
                            <label
                              htmlFor="roomImageInput"
                              className="cursor-pointer inline-block mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              {imagePreview ? 'Replace Image' : 'Browse Files'}
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-2xl">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <LiquidButton
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="px-6 py-2.5 text-sm font-medium min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Room"
                    )}
                  </LiquidButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}