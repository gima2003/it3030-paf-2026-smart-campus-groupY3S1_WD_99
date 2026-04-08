import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
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
        Smart Campus 360
        <span className="block text-sm text-gray-400 font-medium mt-1">
          Admin Panel
        </span>
      </h2>

      {/* Navigation */}
      <nav className="space-y-3">

        <Link className={linkClass("/admin")} to="/admin">
          Dashboard
        </Link>

        <Link className={linkClass("/admin/users")} to="/admin/users">
          User Management
        </Link>

        <Link className={linkClass("/admin/resources")} to="/admin/resources">
          Facilities & Assets
        </Link>

        <Link className={linkClass("/admin/bookings")} to="/admin/bookings">
          Booking Management
        </Link>

        <Link className={linkClass("/admin/tickets")} to="/admin/tickets">
          Tickets Management
        </Link>

        <Link className={linkClass("/admin/technicians")} to="/admin/technicians">
          Technicians Management
        </Link>

        <Link className={linkClass("/admin/notifications")} to="/admin/notifications">
          Notifications
        </Link>

        <Link className={linkClass("/admin/analytics")} to="/admin/analytics">
          Analytics
        </Link>

      </nav>
    </div>
  );
}

export default AdminSidebar;