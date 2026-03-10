import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}