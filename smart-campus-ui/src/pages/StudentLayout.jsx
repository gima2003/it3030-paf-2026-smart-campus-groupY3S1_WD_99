import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";

function StudentLayout() {
  return (
    <div className="flex h-screen bg-[#000919] text-white overflow-hidden">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#000919]">
        <StudentNavbar />

        <main className="flex-1 overflow-y-auto bg-[#000919]">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;