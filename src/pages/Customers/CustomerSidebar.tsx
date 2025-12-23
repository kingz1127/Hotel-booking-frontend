import { NavLink } from "react-router-dom";

export default function CustomerSidebar(){
   return <>
   <div>
   <NavLink to={"customerHome"}>
    Dasboard
   </NavLink>

   <NavLink to={"customersettings"}>
    Settings
   </NavLink>

   <NavLink to={"restaurant"}>
    Restaurant
   </NavLink>

   <NavLink to={"customerRoom"}>
      Rooms & Suites
   </NavLink>

<NavLink to={"customerBookings"}>
      Bookings
   </NavLink>
   
   </div>
   </>
}