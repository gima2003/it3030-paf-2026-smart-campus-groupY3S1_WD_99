import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUniversity,
  FaCalendarCheck,
  FaExclamationCircle,
  FaTicketAlt,
  FaBell,
  FaHome, // 👈 NEW
} from "react-icons/fa";

function StudentSidebar() {
  const location = useLocation();
  const [hasUnreadBookingNotif, setHasUnreadBookingNotif] = useState(false);

  useEffect(() => {
    const handleFetched = (e) => {
      const list = e.detail;
      const unreadBooking = list.some(n => !n.isRead && n.title.toLowerCase().includes('booking'));
      setHasUnreadBookingNotif(unreadBooking);
    };
    window.addEventListener("notificationsFetched", handleFetched);
    return () => window.removeEventListener("notificationsFetched", handleFetched);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/student", icon: <FaTachometerAlt /> },
    { name: "Browse Resources", path: "/student/resources", icon: <FaUniversity /> },
    { name: "My Bookings", path: "/student/bookings", icon: <FaCalendarCheck />, showDot: hasUnreadBookingNotif },
    { name: "Report Issue", path: "/student/report", icon: <FaExclamationCircle /> },
    { name: "My Tickets", path: "/student/tickets", icon: <FaTicketAlt /> },
    { name: "Notifications", path: "/student/notifications", icon: <FaBell /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 min-h-screen bg-[#020817] border-r border-white/10 px-5 py-6 flex flex-col">

      {/* Brand */}
      <div className="mb-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A6ED3]/20 to-[#0B1220] p-4 shadow-lg">
          <h2 className="text-white text-xl font-bold tracking-tight">
            Smart Campus 360
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Student Panel
          </p>
        </div>
      </div>

      {/* 🔥 NEW HOME BUTTON */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 transition"
        >
          <FaHome />
          <span>Back to Home</span>
        </Link>
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
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? "bg-[#0A6ED3] text-white shadow-md shadow-blue-900/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className={`text-base transition ${
                isActive(item.path)
                  ? "text-white"
                  : "text-gray-500 group-hover:text-white"
              }`}
            >
              {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
            {item.showDot && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Card */}
      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">
            Student Services
          </p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Access campus resources, manage bookings, report issues, and track
            ticket updates in one place.
          </p>
        </div>
      </div>

    </aside>
  );
}

export default StudentSidebar;