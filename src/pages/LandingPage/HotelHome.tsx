import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function HotelHome() {
  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
