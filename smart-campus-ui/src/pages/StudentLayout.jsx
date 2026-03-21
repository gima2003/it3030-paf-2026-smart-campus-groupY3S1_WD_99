import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";

function StudentLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <StudentSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col bg-[#000919]">

        <StudentNavbar />

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default StudentLayout;