import { Link } from "react-router-dom";

export default function AdminSideBar() {
  return (
    <>
      <div>
        <h1>Admin Sidebar</h1>

        <Link to={"dashboard"}>
            Dashboard
        </Link>
        <Link to={"customers"}>
            Customers
        </Link>
        <Link to={"rooms"}>
            Rooms
        </Link>
        <Link to={"staffs"}>
            Staffs
        </Link>
      </div>
    </>
  );
}
