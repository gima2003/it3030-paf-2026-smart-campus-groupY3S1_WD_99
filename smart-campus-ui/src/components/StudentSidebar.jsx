import { Link, useLocation } from "react-router-dom";

function StudentSidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-[#0A6ED3] text-white"
        : "text-gray-400 hover:bg-[#0B1220] hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#000919] border-r border-white/10 p-6 min-h-screen">

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-8">
        Student Panel
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">

        <Link className={linkClass("/student")} to="/student">
          Dashboard
        </Link>

        <Link className={linkClass("/student/resources")} to="/student/resources">
          Browse Resources
        </Link>

        <Link className={linkClass("/student/bookings")} to="/student/bookings">
          My Bookings
        </Link>

        <Link className={linkClass("/student/report")} to="/student/report">
          Report Issue
        </Link>

        <Link className={linkClass("/student/tickets")} to="/student/tickets">
          My Tickets
        </Link>

        <Link className={linkClass("/student/notifications")} to="/student/notifications">
          Notifications
        </Link>

      </nav>
    </div>
  );
}

export default StudentSidebar;