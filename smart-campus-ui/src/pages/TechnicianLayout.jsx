import { Outlet } from "react-router-dom";
import TechnicianSidebar from "../components/TechnicianSidebar";
import TechnicianNavbar from "../components/TechnicianNavbar";

function TechnicianLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <TechnicianSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col bg-[#000919]">

        <TechnicianNavbar />

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default TechnicianLayout;