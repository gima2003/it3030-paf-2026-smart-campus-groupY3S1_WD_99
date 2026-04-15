import React, { useEffect, useState } from "react";
import { cancelBooking, getUserBookings } from "../services/bookingService";

function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(userId);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, "Cancelled by user");
      setMessage("Booking cancelled successfully.");
      fetchBookings();
    } catch (error) {
      console.error("Cancel failed:", error);
      setMessage("Failed to cancel booking.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold border";
    switch (status) {
      case "APPROVED":
        return `${base} bg-green-500/10 text-green-300 border-green-500/30`;
      case "REJECTED":
        return `${base} bg-red-500/10 text-red-300 border-red-500/30`;
      case "CANCELLED":
        return `${base} bg-gray-500/10 text-gray-300 border-gray-500/30`;
      default:
        return `${base} bg-yellow-500/10 text-yellow-300 border-yellow-500/30`;
    }
  };

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">My Bookings</h2>
          <p className="text-gray-400">
            View the status of your submitted booking requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <h3 className="text-3xl font-bold mt-2">{bookings.length}</h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Pending</p>
            <h3 className="text-3xl font-bold mt-2 text-yellow-300">
              {bookings.filter((b) => b.status === "PENDING").length}
            </h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Approved</p>
            <h3 className="text-3xl font-bold mt-2 text-green-300">
              {bookings.filter((b) => b.status === "APPROVED").length}
            </h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Rejected / Cancelled</p>
            <h3 className="text-3xl font-bold mt-2 text-red-300">
              {
                bookings.filter(
                  (b) => b.status === "REJECTED" || b.status === "CANCELLED"
                ).length
              }
            </h3>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-blue-300">
            {message}
          </div>
        )}

        <div className="bg-[#081225] p-6 rounded-2xl border border-white/10 overflow-x-auto">
          {loading ? (
            <p className="text-gray-400">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400">No recent bookings found.</p>
          ) : (
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Purpose</th>
                  <th className="py-3 px-3">Attendees</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5">
                    <td className="py-4 px-3 font-medium">
                      {booking.resourceName || booking.facilityName || `#${booking.resourceId}`}
                    </td>
                    <td className="py-4 px-3">{booking.date}</td>
                    <td className="py-4 px-3">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="py-4 px-3 max-w-[220px] truncate">
                      {booking.purpose}
                    </td>
                    <td className="py-4 px-3">{booking.attendees}</td>
                    <td className="py-4 px-3">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-gray-400">
                      {booking.reason || "-"}
                    </td>
                    <td className="py-4 px-3">
                      {booking.status === "APPROVED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentBookings;