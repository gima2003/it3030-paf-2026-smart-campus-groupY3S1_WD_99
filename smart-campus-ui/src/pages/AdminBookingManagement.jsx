import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Filter,
  RotateCcw,
  CheckCircle,
  XCircle,
  CalendarDays,
  Clock,
  Clock3,
  User,
  LayoutGrid,
} from "lucide-react";
import {
  approveBooking,
  getAllBookings,
  rejectBooking,
  cancelBooking,
} from "../services/bookingService";
import { getAllUsers } from "../services/userService";

function AdminBookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Filters & Sorting
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("UPCOMING");

  // Actions state
  const [processingId, setProcessingId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [bookingsData, usersData] = await Promise.all([
        getAllBookings(),
        getAllUsers().catch(() => []), // Fallback to empty array if user fetch fails
      ]);

      const normalized = Array.isArray(bookingsData) ? bookingsData : [];

      const mergedBookings = normalized.map((b) => {
        const user = usersData.find((u) => u.id === b.userId);
        return {
          ...b,
          userRole: user ? user.role : b.userRole || "STUDENT",
          displayUserName: user
            ? `${user.firstName} ${user.lastName}`
            : b.userName || `User #${b.userId}`,
          displayUserId: user
            ? (user.role === "STUDENT" ? user.studentId : user.employeeId) || user.id
            : b.userId,
        };
      });

      setBookings(mergedBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
      setMessage("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedBookings = useMemo(() => {
    let updated = [...bookings];

    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      updated = updated.filter((booking) => {
        const userName = (booking.userName || "").toLowerCase();
        const resourceName = (
          booking.resourceName ||
          booking.facilityName ||
          booking.equipmentName ||
          ""
        ).toLowerCase();
        const purpose = (booking.purpose || "").toLowerCase();
        const role = (booking.userRole || "Student").toLowerCase(); // Fallback if backend doesn't send yet

        return (
          userName.includes(term) ||
          resourceName.includes(term) ||
          purpose.includes(term) ||
          role.includes(term)
        );
      });
    }

    if (statusFilter !== "ALL") {
      updated = updated.filter((b) => b.status === statusFilter);
    }

    if (roleFilter !== "ALL") {
      updated = updated.filter((b) => {
        const role = (b.userRole || "STUDENT").toUpperCase();
        return role === roleFilter.toUpperCase();
      });
    }

    updated.sort((a, b) => {
      const dateA = new Date(`${a.bookingDate || a.date}T${a.startTime || "00:00:00"}`);
      const dateB = new Date(`${b.bookingDate || b.date}T${b.startTime || "00:00:00"}`);

      if (sortOption === "LATEST") return dateB - dateA;
      return dateA - dateB; // UPCOMING
    });

    return updated;
  }, [bookings, searchText, statusFilter, roleFilter, sortOption]);

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

  const swalTheme = {
    background: "#081225",
    color: "#ffffff",
  };

  const handleApprove = async (bookingId) => {
    const result = await Swal.fire({
      ...swalTheme,
      title: "Approve booking?",
      text: "This booking request will be approved.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0A6ED3",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(bookingId);
      setMessage("");
      await approveBooking(bookingId, "Approved by admin");
      await Swal.fire({
        ...swalTheme,
        title: "Approved!",
        text: "Booking approved successfully.",
        icon: "success",
        confirmButtonColor: "#0A6ED3",
      });
      await fetchBookings();
    } catch (error) {
      console.error("Approve failed:", error);
      await Swal.fire({
        ...swalTheme,
        title: "Failed",
        text: "Failed to approve booking.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
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
      closeRejectModal();
      await Swal.fire({
        ...swalTheme,
        title: "Rejected!",
        text: "Booking rejected successfully.",
        icon: "success",
        confirmButtonColor: "#0A6ED3",
      });
      await fetchBookings();
    } catch (error) {
      console.error("Reject failed:", error);
      await Swal.fire({
        ...swalTheme,
        title: "Failed",
        text: "Failed to reject booking.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      ...swalTheme,
      title: "Cancel booking?",
      text: "This approved booking will be cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "Keep booking",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(bookingId);
      setMessage("");
      await cancelBooking(bookingId, "Cancelled by admin");
      await Swal.fire({
        ...swalTheme,
        title: "Cancelled!",
        text: "Booking cancelled successfully.",
        icon: "success",
        confirmButtonColor: "#0A6ED3",
      });
      await fetchBookings();
    } catch (error) {
      console.error("Cancel failed:", error);
      await Swal.fire({
        ...swalTheme,
        title: "Failed",
        text: "Failed to cancel booking.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border";
    switch (status) {
      case "APPROVED":
        return `${base} bg-green-500/10 text-green-400 border-green-500/20`;
      case "REJECTED":
        return `${base} bg-red-500/10 text-red-400 border-red-500/20`;
      case "CANCELLED":
        return `${base} bg-gray-500/10 text-gray-400 border-gray-500/20`;
      case "PENDING":
        return `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`;
      default:
        return `${base} bg-white/5 text-white/60 border-white/10`;
    }
  };

  const getRoleBadge = (role) => {
    const normalizedRole = (role || "STUDENT").toUpperCase();
    if (normalizedRole === "LECTURER") {
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[11px] font-bold uppercase";
    }
    return "bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-bold uppercase";
  };

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setRoleFilter("ALL");
    setSortOption("UPCOMING");
  };

  return (
    <div className="bg-[#000919] min-h-screen text-white p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 tracking-tight">Booking Management</h2>
          <p className="text-gray-400 text-sm">
            Review, approve, reject, and manage campus booking requests.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
            <h3 className="text-3xl font-bold mt-2 text-white">{stats.total}</h3>
          </div>
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-colors">
            <p className="text-gray-400 text-sm font-medium">Pending Review</p>
            <h3 className="text-3xl font-bold mt-2 text-yellow-400">{stats.pending}</h3>
          </div>
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/5 hover:border-green-500/20 transition-colors">
            <p className="text-gray-400 text-sm font-medium">Approved</p>
            <h3 className="text-3xl font-bold mt-2 text-green-400">{stats.approved}</h3>
          </div>
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/5 hover:border-red-500/20 transition-colors">
            <p className="text-gray-400 text-sm font-medium">Rejected / Cancelled</p>
            <h3 className="text-3xl font-bold mt-2 text-red-400">{stats.rejectedCancelled}</h3>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#081225] p-4 rounded-2xl border border-white/5 mb-6 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by user, resource, purpose or role..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[140px]">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3] appearance-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="relative min-w-[140px]">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3] appearance-none"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
              </select>
            </div>

            <div className="relative min-w-[150px]">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3] appearance-none"
              >
                <option value="UPCOMING">Upcoming First</option>
                <option value="LATEST">Latest First</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm transition-all"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
            <CheckCircle size={16} />
            {message}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-[#081225] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-[#0b1730] border-b border-white/5 text-[12px] uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-5 font-semibold">User</th>
                  <th className="py-4 px-5 font-semibold">Role</th>
                  <th className="py-4 px-5 font-semibold">Resource</th>
                  <th className="py-4 px-5 font-semibold">Date & Time</th>
                  <th className="py-4 px-5 font-semibold">Purpose</th>
                  <th className="py-4 px-5 font-semibold">Attendees</th>
                  <th className="py-4 px-5 font-semibold">Status</th>
                  <th className="py-4 px-5 font-semibold">Reason</th>
                  <th className="py-4 px-5 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#0A6ED3] border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading bookings...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAndSortedBookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                          <Search size={24} className="text-gray-500" />
                        </div>
                        <p className="text-base font-medium text-gray-300">No bookings found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0A6ED3]/20 flex items-center justify-center text-[#0A6ED3] font-bold text-xs shrink-0">
                            {(booking.displayUserName || booking.userName || booking.userId || "?").toString().charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-200">
                              {booking.displayUserName || booking.userName || `User #${booking.userId}`}
                            </span>
                            <span className="text-gray-500 text-[11px] font-medium mt-0.5">
                              ID: {booking.displayUserId || booking.userId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={getRoleBadge(booking.userRole)}>
                          {booking.userRole || "Student"}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <LayoutGrid size={14} className="text-gray-500" />
                          <span className="font-semibold text-white">
                            {booking.resourceName || booking.facilityName || booking.equipmentName || `ID: ${booking.resourceId}`}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-gray-300 text-[13px]">
                            <CalendarDays size={13} className="text-gray-500" />
                            {booking.date || booking.bookingDate}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[12px]">
                            <Clock3 size={13} className="text-gray-500" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <p className="text-gray-300 max-w-[180px] truncate text-[13px]" title={booking.purpose}>
                          {booking.purpose || "-"}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <User size={13} className="text-gray-500" />
                          {booking.attendees || 0}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <p className="text-gray-400 text-[12px] max-w-[160px] line-clamp-2" title={booking.reason || booking.adminReason}>
                          {booking.reason || booking.adminReason || "-"}
                        </p>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex justify-center items-center gap-2">
                          {booking.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleApprove(booking.id)}
                                disabled={processingId === booking.id}
                                className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => openRejectModal(booking.id)}
                                disabled={processingId === booking.id}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : booking.status === "APPROVED" ? (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={processingId === booking.id}
                              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg text-orange-400 hover:bg-orange-500/10 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-gray-600 text-[12px] italic">Done</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#081225] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white">Reject Booking</h2>
              <button onClick={closeRejectModal} className="text-gray-500 hover:text-white transition">
                <XCircle size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              Please provide a reason for rejecting this booking request. This will be visible to the user.
            </p>

            <textarea
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Facility is undergoing maintenance..."
              className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={processingId === selectedBookingId}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium transition disabled:opacity-60 flex items-center gap-2"
              >
                {processingId === selectedBookingId ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingManagement;