import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";

export default function CustomerPage(){
    return<>

    <div>

        <div>
            <CustomerSidebar />
        </div>

        <div>
            <Outlet />
        </div>
    </div>

    </>
}