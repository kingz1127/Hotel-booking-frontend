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
import {ToastContainer} from "react-toastify";



function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
    <Routes>

{/* This is the home page */}
      <Route path="/" element={<HotelHome />}>
      <Route path="/" element={<HomePage />} />
      <Route path="register" element={<Register />}/>
      <Route path="Login" element={<Login />} />
        
      </Route>

      {/* This is the Admin page */}
      <Route path="/admin" element={<Admin />}> 
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
