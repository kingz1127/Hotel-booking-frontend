// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Link, useNavigate } from "react-router-dom";

// import { userRegister } from "../services/api.Register.js";
// import { loginUser } from "../services/api.Login.js";
// import { toast } from "react-toastify";
// import ForgotPassword from "@/pages/LandingPage/ForgotPassword.js";

// const registerSchema = z
//   .object({
//     fullName: z.string().min(6, {
//       message: "Full name must be at least 6 characters.",
//     }),
//     email: z.string().email({
//       message: "Please enter a valid email address.",
//     }),
//     phoneNumber: z
//       .string()
//       .min(10, {
//         message: "Phone number must be at least 10 digits.",
//       })
//       .max(15, {
//         message: "Phone number cannot exceed 15 digits.",
//       })
//       .regex(/^[0-9+\-\s()]*$/, {
//         message: "Please enter a valid phone number.",
//       }),
//     address: z.string().min(5, {
//       message: "Address must be at least 5 characters.",
//     }),
//     password: z.string().min(8, {
//       message: "Password must be at least 8 characters.",
//     }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// const loginSchema = z.object({
//   Email: z.string().email("Enter a valid email"),
//   Password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export function RegisterForm() {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   async function onSubmit(data) {
//     console.log("Submitting:", data);
//     setIsLoading(true);

//     const backendData = {
//       fullName: data.fullName,
//       email: data.email,
//       phoneNumber: data.phoneNumber,
//       address: data.address,
//       password: data.password,
//     };

//     try {
//       const result = await userRegister(backendData);

//       toast.success("Registration Successful");

//       if (result && (result.id || result.email)) {
//         toast.success("Registration Successful");
//         form.reset();
//         navigate("/login");
//       } else {
//         toast.error("Registration incomplete");
//       }
//     } catch (error) {
//       toast.error(
//         `Registration failed: ${error.message || "Please try again later"}`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* FULL NAME */}
//         <FormField
//           control={form.control}
//           name="fullName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Full Name</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="Full Name"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* EMAIL */}
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* PHONE NUMBER */}
//         <FormField
//           control={form.control}
//           name="phoneNumber"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone Number</FormLabel>
//               <FormControl>
//                 <Input
//                   type="tel"
//                   placeholder="Phone Number"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* ADDRESS */}
//         <FormField
//           control={form.control}
//           name="address"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Address</FormLabel>
//               <FormControl>
//                 <Input placeholder="Address" {...field} disabled={isLoading} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* PASSWORD */}
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* CONFIRM PASSWORD */}
//         <FormField
//           control={form.control}
//           name="confirmPassword"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Confirm Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type="password"
//                   placeholder="Confirm Password"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button
//           className="rounded-full bg-blue-500 w-3xs h-8 text-white hover:bg-green-400 mx-auto block"
//           type="submit"
//           disabled={isLoading}
//         >
//           {isLoading ? "Registering..." : "Register"}
//         </Button>
//       </form>
//       <p className="mt-4 text-center">
//         Already have an Account?{" "}
//         <Link to="/login" className="text-blue-500 hover:underline">
//           Login
//         </Link>
//       </p>
//     </Form>
//   );
// }

// {
//   /* Login */
// }
// {
//   /* Login */
// }

// export function LoginForm() {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       Email: "",
//       Password: "",
//     },
//   });

//   // async function onSubmit(values) {
//   //   setIsLoading(true);

//   //   try {
//   //     const loginData = {
//   //       email: values.Email,
//   //       password: values.Password,
//   //     };

//   //     console.log("=== DEBUG: Attempting login ===");
//   //     console.log("Login data:", loginData);
      
//   //     const result = await loginUser(loginData);
      
//   //     console.log("=== DEBUG: Login response ===");
//   //     console.log("Full response:", result);
//   //     console.log("Has id?", result?.id);
//   //     console.log("Has email?", result?.email);
//   //     console.log("Has phoneNumber?", result?.phoneNumber);
//   //     console.log("Has fullName?", result?.fullName);
//   //     console.log("Has token?", result?.token);
//   //     console.log("All keys:", Object.keys(result || {}));

//   //     if (result) {
//   //       // Extract user data and token
//   //       let userData, token;
        
//   //       // Handle different response formats
//   //       if (result.user && result.token) {
//   //         userData = result.user;
//   //         token = result.token;
//   //       } else if (result.data && result.token) {
//   //         userData = result.data;
//   //         token = result.token;
//   //       } else if (result.token) {
//   //         userData = result;
//   //         token = result.token;
//   //       } else {
//   //         userData = result;
//   //         // Generate session token if not provided by backend
//   //         token = `customer_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   //       }
        
//   //       console.log("Extracted userData:", userData);
//   //       console.log("Using token:", token);

//   //       // CRITICAL: Store customer data in SESSIONSTORAGE (tab-specific)
//   //       sessionStorage.setItem("customerToken", token);
        
//   //       if (userData.id) {
//   //         sessionStorage.setItem("customerId", userData.id.toString());
//   //       }
        
//   //       // Save complete customer object
//   //       const customerToStore = {
//   //         ...userData,
//   //         token: token,
//   //         role: "CUSTOMER"
//   //       };
//   //       sessionStorage.setItem("customer", JSON.stringify(customerToStore));
        
//   //       // Also save individual fields for compatibility
//   //       if (userData.email) {
//   //         sessionStorage.setItem("customerEmail", userData.email);
//   //       } else {
//   //         // If email not in response, use the email from login form
//   //         sessionStorage.setItem("customerEmail", values.Email);
//   //       }
        
//   //       if (userData.fullName) {
//   //         sessionStorage.setItem("customerName", userData.fullName);
//   //       }
        
//   //       if (userData.phoneNumber) {
//   //         sessionStorage.setItem("customerPhone", userData.phoneNumber);
//   //       }
        
//   //       // Clear any admin data from sessionStorage to prevent conflicts
//   //       sessionStorage.removeItem("admin");
//   //       sessionStorage.removeItem("adminToken");
//   //       sessionStorage.removeItem("userId"); // Clear generic userId too

//   //       // Debug: Check sessionStorage
//   //       console.log("=== DEBUG: sessionStorage after customer login ===");
//   //       console.log("customerToken:", sessionStorage.getItem("customerToken"));
//   //       console.log("customerId:", sessionStorage.getItem("customerId"));
//   //       console.log("customer:", sessionStorage.getItem("customer"));
//   //       console.log("customerEmail:", sessionStorage.getItem("customerEmail"));

//   //       // Check if there's a pending room booking (check sessionStorage)
//   //       const selectedRoomId = sessionStorage.getItem('selectedRoomId');
//   //       const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');

//   //       form.reset();
//   //       toast.success("Login Successful");

//   //       // Redirect based on booking context
//   //       if (selectedRoomId) {
//   //         console.log("Redirecting to booking page:", `/booking/${selectedRoomId}`);
//   //         navigate(`/booking/${selectedRoomId}`);
          
//   //         // Clean up the stored room ID from sessionStorage
//   //         sessionStorage.removeItem('selectedRoomId');
//   //         sessionStorage.removeItem('redirectAfterLogin');
//   //       } else if (redirectAfterLogin) {
//   //         console.log("Redirecting to:", redirectAfterLogin);
//   //         navigate(redirectAfterLogin);
//   //         sessionStorage.removeItem('redirectAfterLogin');
//   //       } else {
//   //         console.log("Redirecting to default customer home");
//   //         navigate("/customerpage/customerHome");
//   //       }
//   //     } else {
//   //       toast.error("Login failed: No response from server");
//   //     }
//   //   } catch (error) {
//   //     console.error("Login failed:", error);
//   //     toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }


//   async function onSubmit(values) {
//   setIsLoading(true);

//   try {
//     const loginData = {
//       email: values.Email,
//       password: values.Password,
//     };

//     console.log("=== STARTING LOGIN ===");
    
//     const result = await loginUser(loginData);
    
//     console.log("=== LOGIN RESPONSE ===");
//     console.log("Raw result:", result);
    
//     if (!result) {
//       throw new Error("No response from server");
//     }
    
//     // UNIVERSAL DATA EXTRACTION - handles ANY response format
//     let userData = {};
//     let token = "";
    
//     // Check different possible response structures
//     if (result.user && result.token) {
//       // Format 1: { user: {...}, token: "..." }
//       userData = result.user;
//       token = result.token;
//     } else if (result.data && result.token) {
//       // Format 2: { data: {...}, token: "..." }
//       userData = result.data;
//       token = result.token;
//     } else if (result.token) {
//       // Format 3: { id: 1, email: "...", token: "..." }
//       userData = result;
//       token = result.token;
//     } else {
//       // Format 4: Just plain user object { id: 1, email: "...", ... }
//       userData = result;
//       token = `customer_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     }
    
//     console.log("Extracted userData:", userData);
//     console.log("Extracted token:", token);
    
//     // Find the user ID - check ALL possible property names
//     const userId = userData.id || userData.userId || userData.customerId || 
//                    result.id || result.userId || result.customerId;
    
//     console.log("Found userId:", userId);
    
//     if (!userId) {
//       console.warn("No user ID found in response. Using email as identifier.");
//     }
    
//     // CRITICAL: Save to sessionStorage in multiple formats for compatibility
//     const customerToStore = {
//       id: userId || values.Email, // Use email if no ID
//       email: values.Email,
//       fullName: userData.fullName || userData.name || "",
//       phoneNumber: userData.phoneNumber || userData.phone || "",
//       address: userData.address || "",
//       token: token,
//       role: "CUSTOMER",
//       // Include all original data just in case
//       _raw: result
//     };
    
//     // Save the complete customer object
//     sessionStorage.setItem("customer", JSON.stringify(customerToStore));
    
//     // Save individual fields (for CustomerBookings.jsx compatibility)
//     if (userId) {
//       sessionStorage.setItem("customerId", userId.toString());
//     }
//     sessionStorage.setItem("customerEmail", values.Email);
//     sessionStorage.setItem("customerToken", token);
    
//     if (customerToStore.fullName) {
//       sessionStorage.setItem("customerName", customerToStore.fullName);
//     }
//     if (customerToStore.phoneNumber) {
//       sessionStorage.setItem("customerPhone", customerToStore.phoneNumber);
//     }
    
//     // Clean up any conflicting data
//     sessionStorage.removeItem("admin");
//     sessionStorage.removeItem("adminToken");
//     sessionStorage.removeItem("user"); // Remove generic user key
    
//     console.log("=== sessionStorage AFTER SAVE ===");
//     console.log("customer:", sessionStorage.getItem("customer"));
//     console.log("customerId:", sessionStorage.getItem("customerId"));
//     console.log("customerEmail:", sessionStorage.getItem("customerEmail"));
    
//     form.reset();
//     toast.success("Login Successful");

//     // Redirect logic (keep your existing logic)
//     const selectedRoomId = sessionStorage.getItem('selectedRoomId');
//     if (selectedRoomId) {
//       navigate(`/booking/${selectedRoomId}`);
//       sessionStorage.removeItem('selectedRoomId');
//       sessionStorage.removeItem('redirectAfterLogin');
//     } else {
//       navigate("/customerpage/customerHome");
//     }
    
//   } catch (error) {
//     console.error("Login failed:", error);
//     toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
//   } finally {
//     setIsLoading(false);
//   }
// }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* EMAIL */}
//         <FormField
//           control={form.control}
//           name="Email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* PASSWORD */}
//         <FormField
//           control={form.control}
//           name="Password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button
//           className="rounded-full bg-blue-500 w-2xs h-8 text-white hover:bg-green-400 mx-auto block"
//           type="submit"
//           disabled={isLoading}
//         >
//           {isLoading ? "Logging in..." : "Login"}
//         </Button>

//         <Link to={"/password/forgot"}> forgot password</Link>

//         {/* Optional: Show booking context message */}
//         {sessionStorage.getItem('selectedRoomId') && (
//           <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-sm text-blue-800 text-center">
//               ⚡ Continue with your room booking after login
//             </p>
//           </div>
//         )}
//       </form>
//       <p className="mt-4 text-center">
//         Don't have an Account?{" "}
//         <Link to="/register" className="text-blue-500 hover:underline">
//           Register
//         </Link>
//       </p>
//     </Form>
//   );
// }


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

import { userRegister } from "../services/api.Register.js";
import { loginUser } from "../services/api.Login.js";
import { toast } from "react-toastify";

const registerSchema = z
  .object({
    fullName: z.string().min(6, {
      message: "Full name must be at least 6 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phoneNumber: z
      .string()
      .min(10, {
        message: "Phone number must be at least 10 digits.",
      })
      .max(15, {
        message: "Phone number cannot exceed 15 digits.",
      })
      .regex(/^[0-9+\-\s()]*$/, {
        message: "Please enter a valid phone number.",
      }),
    address: z.string().min(5, {
      message: "Address must be at least 5 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  Email: z.string().email("Enter a valid email"),
  Password: z.string().min(6, "Password must be at least 6 characters"),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    console.log("Submitting:", data);
    setIsLoading(true);

    const backendData = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      password: data.password,
    };

    try {
      const result = await userRegister(backendData);

      toast.success("Registration Successful");

      if (result && (result.id || result.email)) {
        toast.success("Registration Successful");
        form.reset();
        navigate("/login");
      } else {
        toast.error("Registration incomplete");
      }
    } catch (error) {
      toast.error(
        `Registration failed: ${error.message || "Please try again later"}`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* FULL NAME */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EMAIL */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PHONE NUMBER */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ADDRESS */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONFIRM PASSWORD */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="rounded-full bg-blue-500 w-3xs h-8 text-white hover:bg-green-400 mx-auto block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-center">
        Already have an Account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </Form>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: "",
      Password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const loginData = {
        email: values.Email,
        password: values.Password,
      };

      console.log("=== STARTING LOGIN ===");
      
      const result = await loginUser(loginData);
      
      console.log("=== LOGIN RESPONSE ===");
      console.log("Raw result:", result);
      
      if (!result) {
        throw new Error("No response from server");
      }
      
      // UNIVERSAL DATA EXTRACTION - handles ANY response format
      let userData = {};
      let token = "";
      
      // Check different possible response structures
      if (result.user && result.token) {
        // Format 1: { user: {...}, token: "..." }
        userData = result.user;
        token = result.token;
      } else if (result.data && result.token) {
        // Format 2: { data: {...}, token: "..." }
        userData = result.data;
        token = result.token;
      } else if (result.token) {
        // Format 3: { id: 1, email: "...", token: "..." }
        userData = result;
        token = result.token;
      } else {
        // Format 4: Just plain user object { id: 1, email: "...", ... }
        userData = result;
        token = `customer_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      console.log("Extracted userData:", userData);
      console.log("Extracted token:", token);
      
      // Find the user ID - check ALL possible property names
      const userId = userData.id || userData.userId || userData.customerId || 
                    result.id || result.userId || result.customerId;
      
      console.log("Found userId:", userId);
      
      if (!userId) {
        console.warn("No user ID found in response. Using email as identifier.");
      }
      
      // CRITICAL: Save to sessionStorage in multiple formats for compatibility
      const customerToStore = {
        id: userId || values.Email, // Use email if no ID
        email: values.Email,
        fullName: userData.fullName || userData.name || "",
        phoneNumber: userData.phoneNumber || userData.phone || "",
        address: userData.address || "",
        token: token,
        role: "CUSTOMER",
        // Include all original data just in case
        _raw: result
      };
      
      // Save the complete customer object
      sessionStorage.setItem("customer", JSON.stringify(customerToStore));
      
      // Save individual fields (for CustomerBookings.jsx compatibility)
      if (userId) {
        sessionStorage.setItem("customerId", userId.toString());
      }
      sessionStorage.setItem("customerEmail", values.Email);
      sessionStorage.setItem("customerToken", token);
      
      if (customerToStore.fullName) {
        sessionStorage.setItem("customerName", customerToStore.fullName);
      }
      if (customerToStore.phoneNumber) {
        sessionStorage.setItem("customerPhone", customerToStore.phoneNumber);
      }
      
      // Clean up any conflicting data
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("user"); // Remove generic user key
      
      console.log("=== sessionStorage AFTER SAVE ===");
      console.log("customer:", sessionStorage.getItem("customer"));
      console.log("customerId:", sessionStorage.getItem("customerId"));
      console.log("customerEmail:", sessionStorage.getItem("customerEmail"));
      
      form.reset();
      toast.success("Login Successful");

      // Redirect logic (keep your existing logic)
      const selectedRoomId = sessionStorage.getItem('selectedRoomId');
      if (selectedRoomId) {
        navigate(`/booking/${selectedRoomId}`);
        sessionStorage.removeItem('selectedRoomId');
        sessionStorage.removeItem('redirectAfterLogin');
      } else {
        navigate("/customerpage/customerHome");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* EMAIL */}
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="rounded-full bg-blue-500 w-2xs h-8 text-white hover:bg-green-400 mx-auto block"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center mt-4">
          <Link to="/password/forgot" className="text-blue-500 hover:underline text-sm">
            Forgot password?
          </Link>
        </div>

        {/* Optional: Show booking context message */}
        {sessionStorage.getItem('selectedRoomId') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              ⚡ Continue with your room booking after login
            </p>
          </div>
        )}
      </form>
      <p className="mt-4 text-center">
        Don't have an Account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </Form>
  );
}