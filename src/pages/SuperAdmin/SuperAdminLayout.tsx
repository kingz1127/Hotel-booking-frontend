// components/SuperAdminLayout.jsx
import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { 
  Shield, 
  Users, 
  LogOut, 
  Home, 
  BarChart3,
  Settings,
  FileText,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { verifySuperAdminToken } from "../../services/api.superadmin.js";

export default function SuperAdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if super admin is authenticated
    const checkAuth = async () => {
      const { valid } = await verifySuperAdminToken();
      if (!valid) {
        navigate("/super-admin");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("superAdmin");
    navigate("/super-admin");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-my-Bg text-white transition-all duration-300`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-500" />
              {isSidebarOpen && (
                <span className="text-xl font-bold">Super Admin</span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {isSidebarOpen ? '«' : '»'}
            </button>
          </div>
        </div>
        
        <nav className="mt-8">
          <NavLink
            to="/super-admin/dashboard" 
            className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-[#c1bd3f] text-gray-900 font-semibold" 
                : "hover:bg-gray-800"
            }`
          }
          >
            <Home className="h-5 w-5" />
            {isSidebarOpen && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink 
            to="/super-admin/manageadmins" 
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <Users className="h-5 w-5" />
            {isSidebarOpen && <span>Manage Admins</span>}
          </NavLink>
          
          <NavLink 
            to="/super-admin/audit" 
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <FileText className="h-5 w-5" />
            {isSidebarOpen && <span>Audit Logs</span>}
          </NavLink>
          
          <NavLink 
            to="/super-admin/reports" 
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            {isSidebarOpen && <span>Reports</span>}
          </NavLink>
          
          <NavLink 
            to="/super-admin/settings" 
            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span>Settings</span>}
          </NavLink>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg w-full justify-center transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
            <p className="text-gray-600">Highest level system control panel</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Super Admin</p>
                <p className="text-sm text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}