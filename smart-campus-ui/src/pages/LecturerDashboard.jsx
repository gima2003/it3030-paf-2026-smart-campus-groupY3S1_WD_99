import { FaCalendarCheck, FaTools, FaBell, FaPlus, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { getUserBookings } from "../services/bookingService";
import { notificationService } from "../services/notificationService";

function LecturerDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const API = "http://localhost:8081";

  const [loading, setLoading] = useState(true);
  const [upcomingBookingsCount, setUpcomingBookingsCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = async () => {
    if (!user || (!user.email && !user.id)) return;
    const userId = user.email || user.id; // Support both email and ID depending on what's available

    setLoading(true);
    try {
      // 1. Fetch Bookings
      let bookings = [];
      try {
        const bookingsData = await getUserBookings(userId);
        if (Array.isArray(bookingsData)) {
          bookings = bookingsData;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          setUpcomingBookingsCount(
            bookings.filter((b) => {
              if (b.status !== "APPROVED") return false;
              const bDate = new Date(b.bookingDate || b.createdAt || Date.now());
              return bDate >= today;
            }).length
          );
        } else {
          setUpcomingBookingsCount(0);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setUpcomingBookingsCount(0);
      }

      // 2. Fetch Tickets
      let tickets = [];
      try {
        const ticketsRes = await axios.get(`${API}/api/tickets/user/${userId}`);
        if (ticketsRes.data && Array.isArray(ticketsRes.data)) {
          tickets = ticketsRes.data;
          setOpenTicketsCount(
            tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length
          );
        } else {
          setOpenTicketsCount(0);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setOpenTicketsCount(0);
      }

      // 3. Fetch Notifications
      let notifications = [];
      try {
        const unreadData = await notificationService.getUnreadCount();
        setUnreadCount(unreadData || 0);

        const notifs = await notificationService.getUserNotifications();
        if (Array.isArray(notifs)) {
          notifications = notifs;
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setUnreadCount(0);
      }

      // 4. Combine Recent Activity
      let activities = [];

      bookings.forEach((b) => {
        activities.push({
          id: `b-${b.id}`,
          type: "Booking",
          message: `Booking for ${b.resourceName || "Resource"}`,
          status: b.status,
          date: new Date(b.createdAt || b.bookingDate || Date.now()),
        });
      });

      tickets.forEach((t) => {
        activities.push({
          id: `t-${t.id}`,
          type: "Ticket",
          message: `Ticket #${t.id} - ${t.title || t.issueType || "Issue"}`,
          status: t.status,
          date: new Date(t.createdAt || Date.now()),
        });
      });

      notifications.forEach((n) => {
        activities.push({
          id: `n-${n.id}`,
          type: "Notification",
          message: n.message || n.title || "New notification",
          status: n.isRead ? "READ" : "UNREAD",
          date: new Date(n.createdAt || Date.now()),
        });
      });

      activities.sort((a, b) => b.date - a.date);
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
      case "RESOLVED":
      case "READ":
        return "text-green-400 bg-green-400/10";
      case "PENDING":
      case "OPEN":
      case "UNREAD":
        return "text-yellow-400 bg-yellow-400/10";
      case "REJECTED":
      case "CANCELLED":
        return "text-red-400 bg-red-400/10";
      case "IN_PROGRESS":
        return "text-[#0A6ED3] bg-[#0A6ED3]/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-8">Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Upcoming Bookings"
          value={loading ? "..." : upcomingBookingsCount}
          icon={<FaCalendarCheck />}
        />
        <Card
          title="Open Tickets"
          value={loading ? "..." : openTicketsCount}
          icon={<FaTools />}
        />
        <Card
          title="Unread Notifications"
          value={loading ? "..." : unreadCount}
          icon={<FaBell />}
        />
        <Card
          title="Quick Action"
          value="New"
          icon={<FaPlus />}
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="mb-8 flex justify-end gap-4">
        <button
          onClick={() => navigate("/lecturer/bookings")}
          className="bg-white/10 border border-white/10 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white/20 transition shadow-lg"
        >
          <FaCalendarCheck />
          Request Booking
        </button>

        <button
          onClick={() => navigate("/lecturer/tickets")}
          className="bg-[#0A6ED3] px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#054E98] transition shadow-lg"
        >
          <FaPlus />
          Raise Ticket
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading activity...</p>
        ) : recentActivity.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity found.</p>
        ) : (
          <ul className="space-y-4 text-gray-300">
            {recentActivity.map((activity, index) => (
              <li
                key={activity.id}
                className={`flex justify-between items-start pb-3 ${
                  index !== recentActivity.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <div>
                  <span className="text-white font-medium block mb-1">
                    {activity.message}
                  </span>
                  <span className="text-xs text-gray-500">
                    {activity.date.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex justify-between items-center hover:border-[#0A6ED3] transition">
      <div>
        <h4 className="text-gray-300 text-sm mb-2">{title}</h4>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>

      <div className="text-[#0A6ED3] text-2xl">{icon}</div>
    </div>
  );
}

export default LecturerDashboard;
