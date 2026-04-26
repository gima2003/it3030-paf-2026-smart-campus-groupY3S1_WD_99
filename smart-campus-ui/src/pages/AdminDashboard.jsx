import { useEffect, useState } from "react";
import axios from "axios";
import { getAllBookings } from "../services/bookingService";
import { FaSync } from "react-icons/fa";


function AdminDashboard() {
  const API = "http://localhost:8081";

  const [analytics, setAnalytics] = useState({
    totalTickets: 0,
    overdueTickets: 0,
    completedTickets: 0,
    onTimeTickets: 0,
    averageResponseTime: "N/A",
    averageResolutionTime: "N/A",
  });

  // ✅ NEW STATE (only addition)
  const [pendingBookings, setPendingBookings] = useState(0);
  const [resourceCounts, setResourceCounts] = useState({
  total: 0,
  facilities: 0,
  equipment: 0,
});
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API}/api/tickets/analytics/summary`);
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching ticket analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);



  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      let bookings = [];
      try {
        const bookingsData = await getAllBookings();
        if (Array.isArray(bookingsData)) {
          bookings = bookingsData;
          setPendingBookings(bookings.filter((b) => b.status === "PENDING").length);
        } else {
          setPendingBookings(0);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setPendingBookings(0);
      }

      // Fetch tickets
      let tickets = [];
      try {
        const ticketsRes = await axios.get(`${API}/api/tickets`);
        if (ticketsRes.data && Array.isArray(ticketsRes.data)) {
          tickets = ticketsRes.data;
          setOpenTicketsCount(tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length);
        } else {
          setOpenTicketsCount(0);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setOpenTicketsCount(0);
      }

      // Combine and format recent activity
      let activities = [];

      bookings.forEach((b) => {
        activities.push({
          id: `b-${b.id}`,
          type: "Booking",
          message: `Booking for ${b.resourceName || "Resource"} by ${b.userName || "User"}`,
          status: b.status,
          date: new Date(b.createdAt || b.bookingDate || Date.now()),
        });
      });

      tickets.forEach((t) => {
        activities.push({
          id: `t-${t.id}`,
          type: "Ticket",
          message: `Ticket #${t.id} - ${t.title || t.issueType || "Maintenance"}`,
          status: t.status,
          date: new Date(t.createdAt || Date.now()),
        });
      });

      // Sort by date descending
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
  }, []);

  useEffect(() => {
    fetchResourceCounts();
  }, []);

  // ✅ NEW FUNCTION (only addition)
  const fetchPendingBookings = async () => {
    try {
      const data = await getAllBookings();

      const pendingCount = Array.isArray(data)
        ? data.filter((booking) => booking.status === "PENDING").length
        : 0;

      setPendingBookings(pendingCount);
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
      setPendingBookings(0);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
      case "RESOLVED":
        return "text-green-400 bg-green-400/10";
      case "PENDING":
      case "OPEN":
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

  const fetchResourceCounts = async () => {
    try {
      const [facilityRes, equipmentRes] = await Promise.all([
        axios.get(`${API}/api/facilities`),
        axios.get(`${API}/api/equipment`),
      ]);

      const facilities = Array.isArray(facilityRes.data)
        ? facilityRes.data.length
        : 0;

      const equipment = Array.isArray(equipmentRes.data)
        ? equipmentRes.data.length
        : 0;

      setResourceCounts({
        total: facilities + equipment,
        facilities,
        equipment,
      });
    } catch (error) {
      console.error("Error fetching resource counts:", error);
    }
  };

  return (
    <div className="p-6 bg-[#000919] min-h-screen text-white">
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-8">System Overview</h2>

      {/* Top System Overview Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Total Resources</h3>

          <p className="text-3xl font-bold mt-2 text-white">
            {resourceCounts.total}
          </p>

          <span className="text-xs text-gray-500 mt-2 block">
            Facilities: {resourceCounts.facilities} | Equipment:{" "}
            {resourceCounts.equipment}
          </span>
        </div>

        {/* ✅ UPDATED CARD (only this value changed) */}
        <div className="bg-[#0B1220] p-6 rounded-2xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Pending Bookings</h3>
          <p className="text-3xl font-bold mt-2 text-white">
            {pendingBookings}
          </p>
          <span className="text-xs text-gray-500 mt-2 block">
            Awaiting Approval
          </span>
        </div>

        <div className="bg-[#0B1220] p-6 rounded-2xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold mt-2 text-white">{openTicketsCount}</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Maintenance Issues
          </span>
        </div>

        <div className="bg-[#0B1220] p-6 rounded-2xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Active Technicians</h3>
          <p className="text-3xl font-bold mt-2 text-white">3</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Currently Assigned
          </span>
        </div>
      </div>

      {/* SLA Analytics Dashboard */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">
          SLA Analytics Dashboard
        </h3>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
            <h3 className="text-gray-400 text-sm">Total Tickets</h3>
            <p className="text-3xl font-bold mt-2 text-white">
              {analytics.totalTickets}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              All maintenance tickets
            </span>
          </div>

          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-red-500 transition">
            <h3 className="text-gray-400 text-sm">Overdue Tickets</h3>
            <p className="text-3xl font-bold mt-2 text-red-400">
              {analytics.overdueTickets}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              Past SLA deadline
            </span>
          </div>

          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-green-500 transition">
            <h3 className="text-gray-400 text-sm">Completed Tickets</h3>
            <p className="text-3xl font-bold mt-2 text-green-400">
              {analytics.completedTickets}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              Successfully resolved
            </span>
          </div>

          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-cyan-500 transition">
            <h3 className="text-gray-400 text-sm">On-Time Tickets</h3>
            <p className="text-3xl font-bold mt-2 text-cyan-400">
              {analytics.onTimeTickets}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              Within SLA target
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">
          Performance Metrics
        </h3>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
            <h3 className="text-gray-400 text-sm">Average Response Time</h3>
            <p className="text-3xl font-bold mt-2 text-white">
              {analytics.averageResponseTime}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              Average time to first response
            </span>
          </div>

          <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
            <h3 className="text-gray-400 text-sm">Average Resolution Time</h3>
            <p className="text-3xl font-bold mt-2 text-white">
              {analytics.averageResolutionTime}
            </p>
            <span className="text-xs text-gray-500 mt-2 block">
              Average time to resolution
            </span>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <FaSync className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="bg-[#0B1220] p-6 rounded-2xl border border-white/10">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent activity found.</p>
          ) : (
            <ul className="space-y-4 text-gray-300 text-sm">
              {recentActivity.map((activity, index) => (
                <li
                  key={activity.id}
                  className={`flex justify-between items-start pb-3 ${
                    index !== recentActivity.length - 1
                      ? "border-b border-white/5"
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
    </div>
  );
}

export default AdminDashboard;