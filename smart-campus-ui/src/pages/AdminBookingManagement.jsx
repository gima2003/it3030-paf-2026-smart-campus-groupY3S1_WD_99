import React, { useEffect, useMemo, useState } from "react";
import {
  approveBooking,
  getAllBookings,
  rejectBooking,
  cancelBooking,
} from "../services/bookingService";

function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchDate, setSearchDate] = useState("");
  const [message, setMessage] = useState("");

  const [processingId, setProcessingId] = useState(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let updated = [...bookings];

    if (statusFilter !== "ALL") {
      updated = updated.filter((b) => b.status === statusFilter);
    }

    if (searchDate) {
      updated = updated.filter((b) => {
        const bookingDate = b.date || b.bookingDate || "";
        return bookingDate === searchDate;
      });
    }

    setFilteredBookings(updated);
  }, [bookings, statusFilter, searchDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      const normalized = Array.isArray(data) ? data : [];
      setBookings(normalized);
      setFilteredBookings(normalized);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
      setFilteredBookings([]);
      setMessage("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      setMessage("");

      await approveBooking(bookingId, "Approved by admin");

      setMessage("Booking approved successfully.");
      await fetchBookings();
    } catch (error) {
      console.error("Approve failed:", error);
      setMessage("Failed to approve booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedBookingId(null);
    setRejectReason("");
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      setMessage("Please enter a rejection reason.");
      return;
    }

    try {
      setProcessingId(selectedBookingId);
      setMessage("");

      await rejectBooking(selectedBookingId, rejectReason);

      setMessage("Booking rejected successfully.");
      closeRejectModal();
      await fetchBookings();
    } catch (error) {
      console.error("Reject failed:", error);
      setMessage("Failed to reject booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setProcessingId(bookingId);
      setMessage("");

      await cancelBooking(bookingId, "Cancelled by admin");

      setMessage("Booking cancelled successfully.");
      await fetchBookings();
    } catch (error) {
      console.error("Cancel failed:", error);
      setMessage("Failed to cancel booking.");
    } finally {
      setProcessingId(null);
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

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      approved: bookings.filter((b) => b.status === "APPROVED").length,
      rejectedCancelled: bookings.filter(
        (b) => b.status === "REJECTED" || b.status === "CANCELLED"
      ).length,
    };
  }, [bookings]);

  return (
    <div className="text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">Booking Management</h2>
        <p className="text-gray-400">
          Review, approve, reject, and manage student booking requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Total Bookings</p>
          <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
        </div>

        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Pending</p>
          <h3 className="text-3xl font-bold mt-2 text-yellow-300">
            {stats.pending}
          </h3>
        </div>

        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Approved</p>
          <h3 className="text-3xl font-bold mt-2 text-green-300">
            {stats.approved}
          </h3>
        </div>

        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Rejected / Cancelled</p>
          <h3 className="text-3xl font-bold mt-2 text-red-300">
            {stats.rejectedCancelled}
          </h3>
        </div>
      </div>

      <div className="bg-[#081225] p-5 rounded-2xl border border-white/10 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
          />

          <button
            onClick={() => {
              setStatusFilter("ALL");
              setSearchDate("");
            }}
            className="border border-white/10 hover:bg-white/5 text-white rounded-xl px-4 py-3 transition"
          >
            Reset Filters
          </button>
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
        ) : filteredBookings.length === 0 ? (
          <p className="text-gray-400">No bookings found.</p>
        ) : (
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="py-3 px-3">User</th>
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5">
                  <td className="py-4 px-3">
                    {booking.userName || booking.userId}
                  </td>

                  <td className="py-4 px-3 font-medium">
                    {booking.resourceName ||
                      booking.facilityName ||
                      booking.resourceId}
                  </td>

                  <td className="py-4 px-3">
                    {booking.date || booking.bookingDate}
                  </td>

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
                    {booking.reason || booking.adminReason || "-"}
                  </td>

                  <td className="py-4 px-3">
                    {booking.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          disabled={processingId === booking.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-60"
                        >
                          {processingId === booking.id ? "..." : "Approve"}
                        </button>

                        <button
                          onClick={() => openRejectModal(booking.id)}
                          disabled={processingId === booking.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-60"
                        >
                          {processingId === booking.id ? "..." : "Reject"}
                        </button>
                      </div>
                    ) : booking.status === "APPROVED" ? (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={processingId === booking.id}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-60"
                      >
                        {processingId === booking.id ? "..." : "Cancel"}
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-[#081225] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Reject Booking
            </h2>
            <p className="text-gray-400 mb-5">
              Please provide a reason for rejecting this booking request.
            </p>

            <textarea
              rows="5"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeRejectModal}
                className="px-5 py-2.5 rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
              >
                Close
              </button>

              <button
                onClick={handleRejectConfirm}
                disabled={processingId === selectedBookingId}
                className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-60"
              >
                {processingId === selectedBookingId
                  ? "Rejecting..."
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingManagement;