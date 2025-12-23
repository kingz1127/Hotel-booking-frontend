import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import TopNavbar from "@/components/TopNavbar";


export default function CustomerPage(){
    return<>

    <div className="flex flex-col ">

        <div>
        <TopNavbar />
        </div>

        <div>
            <CustomerSidebar />
        </div>

        <div>
            <Outlet />
        </div>
    </div>

    </>
}