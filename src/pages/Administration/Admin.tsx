import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

export default function Admin(){
    return<>
    <div>
    <div><AdminSideBar /></div>
    <div><Outlet /></div>
    
    </div>
    </>
}