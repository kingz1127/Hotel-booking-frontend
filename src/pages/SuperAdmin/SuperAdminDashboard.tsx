
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { CheckCircle, Clock, Download, Filter, Mail, Phone, Search, Shield, UserPlus, Users, XCircle, Key } from "lucide-react";
import { getAllAdmins, createAdmin, resendAdminCode, deleteAdmin } from "../../services/api.admin.js";
import { LiquidButton } from "@/components/ui/liquid.js";

// Admin creation schema
const adminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

// Permissions options
const PERMISSIONS = [
  { id: "manage_rooms", label: "Manage Rooms", description: "Can add, edit, delete rooms" },
  { id: "manage_bookings", label: "Manage Bookings", description: "Can view and manage bookings" },
  { id: "manage_customers", label: "Manage Customers", description: "Can view customer information" },
  { id: "manage_staff", label: "Manage Staff", description: "Can manage other staff members" },
  { id: "view_reports", label: "View Reports", description: "Can view analytics and reports" },
  { id: "manage_pricing", label: "Manage Pricing", description: "Can update room prices and discounts" },
  { id: "manage_content", label: "Manage Content", description: "Can update website content" },
  { id: "system_settings", label: "System Settings", description: "Can modify system settings" },
];

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      permissions: [],
    },
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      setError("Failed to load admins. Please try again.");
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createAdmin(data);
      if (result?.id) {
        toast.success(`Admin created! An 8-digit code has been sent to ${data.email}`);
        setShowCreateModal(false);
        form.reset();
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.message || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async (adminId, email) => {
    setIsGeneratingCode(true);
    try {
      await resendAdminCode(adminId);
      toast.success(`New 8-digit code sent to ${email}`);
    } catch (error) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to delete admin "${adminName}"?`)) {
      return;
    }

    try {
      await deleteAdmin(adminId);
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      toast.error(error.message || "Failed to delete admin");
    }
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (admin) => {
    // IMPORTANT FIX: Status logic updated
    if (!admin.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Disabled</span>;
    }
    if (!admin.emailVerified) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending Activation</span>;
    }
    // If admin is active AND email is verified, show Active
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
  };

  const splitFullName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // IMPORTANT FIX: Updated filter logic to match status badge logic
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "active" && admin.isActive && admin.emailVerified) ||
      (filterStatus === "pending" && admin.isActive && !admin.emailVerified) ||
      (filterStatus === "disabled" && !admin.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#c1bd3f] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage administrators and system access</p>
          </div>
          <LiquidButton
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Add New Admin
          </LiquidButton>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Admins</p>
                <p className="text-2xl font-bold mt-1">{admins.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Admins</p>
                <p className="text-2xl font-bold mt-1">
                  {admins.filter(a => a.isActive && a.emailVerified).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Activation</p>
                <p className="text-2xl font-bold mt-1">
                  {admins.filter(a => a.isActive && !a.emailVerified).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disabled Admins</p>
                <p className="text-2xl font-bold mt-1">
                  {admins.filter(a => !a.isActive).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={fetchAdmins}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search admins by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending Activation</option>
              <option value="disabled">Disabled</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || filterStatus !== "all" ? "No admins match your search" : "No admins found"}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-[#c1bd3f] to-[#a8a535] rounded-full flex items-center justify-center text-white font-bold">
                          {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.fullName ? admin.fullName : `${admin.firstName || ''} ${admin.lastName || ''}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            Admin ID: {admin.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{admin.email}</div>
                      <div className="text-sm text-gray-500">{admin.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(admin)}
                        {!admin.emailVerified && admin.codeGeneratedAt && (
                          <span className="text-xs text-gray-500">
                            Code sent: {formatDate(admin.codeGeneratedAt)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(admin.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(admin)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          View
                        </button>
                        {admin.isActive && !admin.emailVerified && (
                          <button
                            onClick={() => handleResendCode(admin.id, admin.email)}
                            disabled={isGeneratingCode}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50"
                          >
                            {isGeneratingCode ? "Sending..." : "Resend Code"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Admin</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    form.reset();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={form.handleSubmit(handleCreateAdmin)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...form.register("firstName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
                      placeholder="John"
                    />
                    {form.formState.errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...form.register("lastName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
                      placeholder="Doe"
                    />
                    {form.formState.errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      {...form.register("email")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
                      placeholder="admin@hotel.com"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      {...form.register("phoneNumber")}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1bd3f] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {form.formState.errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PERMISSIONS.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={permission.id}
                          {...form.register("permissions")}
                          className="mt-1 h-4 w-4 text-[#c1bd3f] rounded focus:ring-[#c1bd3f]"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            {permission.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.permissions && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.permissions.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 font-medium">
                        Security Information
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        An 8-digit verification code will be generated and sent to the admin's email.
                        They must use this code along with their email to log in for the first time.
                        After first login, they will set up their password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      form.reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <LiquidButton 
                    type="submit" 
                    className="px-6 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Admin & Send Code"}
                  </LiquidButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Details</h2>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-[#c1bd3f] to-[#a8a535] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {selectedAdmin.firstName?.charAt(0)}{selectedAdmin.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedAdmin.firstName} {selectedAdmin.lastName}
                    </h3>
                    <p className="text-gray-600">Admin ID: {selectedAdmin.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedAdmin.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedAdmin.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {getStatusBadge(selectedAdmin)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">{selectedAdmin.role}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Account Created</p>
                  <p className="font-medium">{formatDate(selectedAdmin.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Last Login</p>
                  <p className="font-medium">
                    {selectedAdmin.lastLoginAt ? formatDate(selectedAdmin.lastLoginAt) : "Never logged in"}
                  </p>
                </div>

                {!selectedAdmin.emailVerified && selectedAdmin.isActive && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-yellow-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                          Pending Activation
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Admin hasn't activated their account yet. They need to use the 8-digit code sent to their email.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedAdmin.isActive && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-gray-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Account Disabled
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          This admin account has been disabled and cannot log in.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  {selectedAdmin.isActive && !selectedAdmin.emailVerified && (
                    <button
                      onClick={() => {
                        handleResendCode(selectedAdmin.id, selectedAdmin.email);
                        setSelectedAdmin(null);
                      }}
                      disabled={isGeneratingCode}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50"
                    >
                      {isGeneratingCode ? "Sending..." : "Resend Activation Code"}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAdmin(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}