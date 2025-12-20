import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { adminLogin, verifyAdminCode } from "../../services/api.admin.js";
import { Hotel, Mail, Key, HelpCircle, RefreshCw } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid.js";

// Combined schema for email and code
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z.string().length(8, "Code must be 8 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  // Send new code (MANUAL - only when user clicks)
  const handleSendCode = async () => {
    const email = form.getValues("email");
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      form.setFocus("email");
      return;
    }
    
    setSendingCode(true);
    setErrorMessage("");
    
    try {
      const result = await adminLogin({ email });
      
      if (result.success || result.message?.toLowerCase().includes("sent")) {
        toast.success("8-digit code sent to your email!");
        form.setValue("code", ""); // Clear old code
        form.setFocus("code"); // Focus on code field
      } else {
        toast.error("Failed to send code");
      }
    } catch (error: any) {
      const errorMsg = error.message || "Failed to send code";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSendingCode(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: { email: string; code: string }) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      const result = await verifyAdminCode({
        email: data.email,
        code: data.code
      });
      
      const token = result.token || result.data?.token;
      
      if (!token) {
        throw new Error("No authentication token received");
      }
      
      // Save admin data with token
      const adminWithToken = {
        ...(result.admin || result.data?.admin || {
          email: data.email,
          role: "admin",
          id: result.id || `admin_${Date.now()}`
        }),
        token: token
      };
      
      localStorage.setItem("admin", JSON.stringify(adminWithToken));
      
      toast.success("Login successful! Redirecting...");
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      const errorMsg = error.message || "Invalid verification code";
      setErrorMessage(errorMsg);
      
      if (errorMsg.includes("expired")) {
        toast.error("Code has expired. Click 'Send Code' for a fresh one.");
      } else if (errorMsg.includes("invalid") || errorMsg.includes("incorrect")) {
        toast.error("Invalid code. Please check and try again.");
      } else if (errorMsg.includes("not found") || errorMsg.includes("not registered")) {
        toast.error("Email not registered. Contact super admin.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-[#c1bd3f] to-[#a8a535] rounded-2xl">
              <Hotel className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300">Enter email and verification code</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
              <p className="text-red-300 text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  {...form.register("email")}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent transition-all"
                  placeholder="admin@hotel.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Code Field */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-white font-medium">
                  8-digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || loading}
                  className="flex items-center gap-1 text-sm text-[#c1bd3f] hover:text-[#a8a535] disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${sendingCode ? "animate-spin" : ""}`} />
                  {sendingCode ? "Sending..." : "Send Code"}
                </button>
              </div>
              
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  {...form.register("code")}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent transition-all text-center text-2xl tracking-widest"
                  placeholder="00000000"
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              </div>
              {form.formState.errors.code && (
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.code.message}
                </p>
              )}
              
              <div className="mt-2 text-xs text-gray-400">
                <p>• Enter the 8-digit code from registration email</p>
                <p>• Codes expire in 15 minutes</p>
                <p>• Need a new code? Click "Send Code"</p>
              </div>
            </div>

            {/* Submit Button */}
            <LiquidButton
              type="submit"
              disabled={loading}
              className="w-full py-3 mb-4"
            >
              {loading ? "Verifying..." : "Login"}
            </LiquidButton>
          </form>

          {/* Instructions for New Admins */}
          <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <h3 className="text-white text-sm font-medium mb-2">First Time Login?</h3>
            <ol className="text-xs text-blue-200/80 space-y-1">
              <li>1. Enter the email used during registration</li>
              <li>2. Enter the 8-digit code from your welcome email</li>
              <li>3. Click "Login"</li>
              <li className="text-yellow-300">• If code expired, click "Send Code" for a new one</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Luxury Hotel Admin System
          </p>
        </div>
      </div>
    </div>
  );
}