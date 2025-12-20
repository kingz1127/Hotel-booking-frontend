import { NavLink } from "react-router-dom";

export default function CustomerSidebar(){
   return <>
   <div>
   <NavLink to={"customerdashboard"}>
    Dasboard
   </NavLink>

   <NavLink to={"customersettings"}>
    Settings
   </NavLink>
   </div>
   </>
}