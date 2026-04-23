import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaTools,
  FaUserCog,
  FaBell,
  FaChartBar,

} from "react-icons/fa";

function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "User Management", path: "/admin/users", icon: <FaUsers /> },
    { name: "Facilities & Assets", path: "/admin/resources", icon: <FaBuilding /> },
    { name: "Booking Management", path: "/admin/booking-management", icon: <FaCalendarCheck /> },
    { name: "Tickets Management", path: "/admin/tickets", icon: <FaTools /> },
    { name: "Technicians Management", path: "/admin/technicians", icon: <FaUserCog /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell /> },
    { name: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 min-h-screen bg-[#020817] border-r border-white/10 px-5 py-6 flex flex-col">

      {/* Brand */}
      <div className="mb-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A6ED3]/20 to-[#0B1220] p-4 shadow-lg">
          <h2 className="text-white text-xl font-bold tracking-tight">
            Smart Campus 360
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Admin Control Panel
          </p>
        </div>
      </div>

      {/* Section Label */}
      <div className="mb-3 px-2">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Navigation
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
              ${isActive(item.path)
                ? "bg-[#0A6ED3] text-white shadow-md shadow-blue-900/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <span
              className={`text-base transition ${isActive(item.path)
                  ? "text-white"
                  : "text-gray-500 group-hover:text-white"
                }`}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Info Card */}
      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">
            Campus Administration
          </p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Oversee facilities, bookings, maintenance, technician coordination,
            and notifications from one place.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;