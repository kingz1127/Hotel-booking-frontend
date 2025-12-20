import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { superAdminLogin } from "../../services/api.superadmin.js";
import { Lock, Shield, User } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid.js";


const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function SuperAdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const result = await superAdminLogin(data);
      
      if (result?.token) {
        toast.success("Super Admin login successful!");
        
        // Store super admin data
        localStorage.setItem("superAdmin", JSON.stringify({
          token: result.token,
          username: result.username,
          role: "SUPER_ADMIN",
        }));

        // Redirect to super admin dashboard
        navigate("/super-admin/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
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
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Super Admin Portal</h1>
          <p className="text-gray-300">Highest level system access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={form.handleSubmit(handleLogin)}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">
                Super Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  {...form.register("username")}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter super admin username"
                  disabled={loading}
                />
              </div>
              {form.formState.errors.username && (
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  {...form.register("password")}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-red-300 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Security Warning */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-red-300 font-medium">
                    Restricted Access
                  </p>
                  <p className="text-xs text-red-200/80 mt-1">
                    This portal is for authorized super administrators only.
                    All activities are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            <LiquidButton
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              {loading ? "Authenticating..." : "Access Super Admin Dashboard"}
            </LiquidButton>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <Link 
                to="/" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <Link 
                to="/admin/login" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Regular Admin Login →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Luxury Hotel Super Admin System
          </p>
          <p className="text-gray-500 text-xs mt-1">
            For emergency access, contact system administrator
          </p>
        </div>
      </div>
    </div>
  );
}