import { Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentNavbar from "../components/StudentNavbar";

function StudentLayout() {
  const location = useLocation();

  const isStudentBookingCalendar =
    location.pathname === "/student/bookings/calendar";

  return (
    <div className="flex h-screen bg-[#000919] text-white overflow-hidden">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col bg-[#000919]">
        {/* Add extra top margin only for calendar page */}
        <div className={isStudentBookingCalendar ? "mt-4 md:mt-6" : ""}>
          <StudentNavbar />
        </div>

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;