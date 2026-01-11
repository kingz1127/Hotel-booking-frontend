

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

      
      
      const result = await loginUser(loginData);
      
      
      
      if (!result) {
        throw new Error("No response from server");
      }
      
      
      let userData = {};
      let token = "";
      
     
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
       
        userData = result;
        token = `customer_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
     
      
      
      const userId = userData.id || userData.userId || userData.customerId || 
                    result.id || result.userId || result.customerId;
      
      
      
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
      
     
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("user"); 
      
      
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