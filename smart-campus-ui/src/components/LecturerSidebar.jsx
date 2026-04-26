import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function LecturerSidebar() {
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

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-[#0A6ED3] text-white"
        : "text-gray-400 hover:bg-[#0B1220] hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#000919] border-r border-white/10 p-6 min-h-screen">
      <h2 className="text-xl font-bold text-white mb-8">
        Smart Campus 360
        <span className="block text-sm text-gray-400 mt-1">
          Lecturer Panel
        </span>
      </h2>

      <nav className="space-y-3">
        <Link className={linkClass("/lecturer")} to="/lecturer">
          Dashboard
        </Link>
        <Link className={linkClass("/lecturer/tickets")} to="/lecturer/tickets">
          My Tickets
        </Link>

        <Link className={linkClass("/lecturer/resources")} to="/lecturer/resources">
          Browse Resources
        </Link>

        <Link className={`${linkClass("/lecturer/bookings")} flex items-center justify-between`} to="/lecturer/bookings">
          <span>My Bookings</span>
          {hasUnreadBookingNotif && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-2"></span>
          )}
        </Link>

        <Link
          className={linkClass("/lecturer/notifications")}
          to="/lecturer/notifications"
        >
          Notifications
        </Link>
      </nav>
    </div>
  );
}

export default LecturerSidebar;
