import { BrowserRouter, Route, Routes } from "react-router-dom"
import HotelHome from "./pages/LandingPage/HotelHome"
import Register from "./pages/LandingPage/Register"
import Login from "./pages/LandingPage/Login"
import Admin from "./pages/Administration/Admin"
import AdminDashboard from "./pages/Administration/AdminDashboard"
import AdminCustomers from "./pages/Administration/AdminCustomers"
import AdminRooms from "./pages/Administration/AdminRooms"
import AdminStaffs from "./pages/Administration/AdminStaffs"
import HomePage from "./pages/LandingPage/HomePage"
import { ToastContainer } from "react-toastify";

// Import Super Admin components

import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard"

import SuperAdminLayout from "./pages/SuperAdmin/SuperAdminLayout"
import SuperAdminLogin from "./pages/SuperAdmin/SuperAdminLogin"

import CustomerDashboard from "./pages/Customers/CustomerDashboard"
import CustomerSettings from "./pages/Customers/CustomerSettings"

import CustomerPage from "./pages/Customers/Customerpage"
import AdminLogin from "./pages/Administration/AdminLogin"
import ProtectedRoute from "./components/ProtectedRoute"
import ManageAdmins from "./pages/SuperAdmin/ManageAdmins"


function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>

          {/* This is the home page */}
          <Route path="/" element={<HotelHome />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customerpage" element={<CustomerPage />}>
          <Route path="customerdashboard" element={<CustomerDashboard />}/>
          <Route path="customersettings" element={<CustomerSettings />} />

          </Route>

          {/* Super Admin Routes */}
          <Route path="/super-admin" element={<SuperAdminLogin />} />
          
          {/* Super Admin Dashboard with Layout */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="manageadmins" element={<ManageAdmins />} />
            {/* Add other super admin routes here */}
          </Route>

          {/* Admin Login with 8-digit code */}
           <Route path="/admin/login" element={<AdminLogin />} />
          

          {/* Regular Admin Routes */}
         // Update admin route to use ProtectedRoute:
<Route path="/admin" element={
  <ProtectedRoute role="ADMIN">
    <Admin />
  </ProtectedRoute>
}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="customers" element={<AdminCustomers />} />
  <Route path="rooms" element={<AdminRooms />} />
  <Route path="staffs" element={<AdminStaffs />} />
</Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App