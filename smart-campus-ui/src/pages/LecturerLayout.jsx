import { Outlet } from "react-router-dom";
import LecturerSidebar from "../components/LecturerSidebar";
import LecturerNavbar from "../components/LecturerNavbar";

function LecturerLayout() {
  return (
    <div className="flex h-screen">
      <LecturerSidebar />
      <div className="flex-1 flex flex-col bg-[#000919]">
        <LecturerNavbar />
        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LecturerLayout;
