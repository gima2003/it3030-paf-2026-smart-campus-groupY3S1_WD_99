import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Users,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";
import {
  cancelBooking,
  deleteBooking,
  getUserBookings,
} from "../services/bookingService";

function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOption, setSortOption] = useState("UPCOMING");

  const userId = localStorage.getItem("userId") || "1";
  const navigate = useNavigate();

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

  const normalizeDate = (booking) => booking.bookingDate || booking.date || "";

  const isFutureOrToday = (bookingDate) => {
    if (!bookingDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const booking = new Date(bookingDate);
    booking.setHours(0, 0, 0, 0);

    return booking >= today;
  };

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel booking?",
      text: "This will cancel your approved booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, cancel it",
      background: "#081225",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelBooking(bookingId, "Cancelled by user");

      await Swal.fire({
        icon: "success",
        title: "Cancelled!",
        text: "Booking cancelled successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#081225",
        color: "#ffffff",
      });

      fetchBookings();
    } catch (error) {
      console.error("Cancel failed:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : null) ||
        "Failed to cancel booking.";

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMessage,
        background: "#081225",
        color: "#ffffff",
      });
    }
  };

  const handleDelete = async (bookingId) => {
    const result = await Swal.fire({
      title: "Delete booking?",
      text: "This booking record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it",
      background: "#081225",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBooking(bookingId);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Booking deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#081225",
        color: "#ffffff",
      });

      fetchBookings();
    } catch (error) {
      console.error("Delete failed:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : null) ||
        "Failed to delete booking.";

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: backendMessage,
        background: "#081225",
        color: "#ffffff",
      });
    }
  };

  const handleBookAgain = async (booking) => {
    const result = await Swal.fire({
      title: "Book again?",
      text: "Previous booking details will be reused in a new booking form.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0A6ED3",
      cancelButtonColor: "#6b7280",
      background: "#081225",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    const role = localStorage.getItem("role") || "";
    const basePath = role === "LECTURER" ? "/lecturer" : "/student";
    navigate(`${basePath}/bookings/new`, {
      state: {
        bookingData: {
          resourceId: booking.resourceId || "",
          date: normalizeDate(booking),
          startTime: booking.startTime || "",
          endTime: booking.endTime || "",
          purpose: booking.purpose || "",
          attendees: booking.attendees || "",
        },
      },
    });
  };

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";
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

  const filteredAndSortedBookings = useMemo(() => {
    let updated = [...bookings];

    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      updated = updated.filter((booking) => {
        const facilityName =
          booking.facilityName ||
          booking.resourceName ||
          booking.equipmentName ||
          "";
        const purpose = booking.purpose || "";
        return (
          facilityName.toLowerCase().includes(term) ||
          purpose.toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter !== "ALL") {
      updated = updated.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      updated = updated.filter((booking) => normalizeDate(booking) === dateFilter);
    }

    updated.sort((a, b) => {
      const dateA = new Date(`${normalizeDate(a)}T${a.startTime || "00:00:00"}`);
      const dateB = new Date(`${normalizeDate(b)}T${b.startTime || "00:00:00"}`);

      if (sortOption === "NEWEST") return dateB - dateA;
      if (sortOption === "OLDEST") return dateA - dateB;

      // UPCOMING default
      return dateA - dateB;
    });

    return updated;
  }, [bookings, searchText, statusFilter, dateFilter, sortOption]);

  const upcomingBookings = filteredAndSortedBookings.filter(
    (booking) =>
      booking.status === "APPROVED" && isFutureOrToday(normalizeDate(booking))
  );

  const otherBookings = filteredAndSortedBookings.filter(
    (booking) =>
      !(booking.status === "APPROVED" && isFutureOrToday(normalizeDate(booking)))
  );

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setDateFilter("");
    setSortOption("UPCOMING");
  };

  const hasActiveFilters =
    searchText || statusFilter !== "ALL" || dateFilter || sortOption !== "UPCOMING";

  const BookingCard = ({ booking }) => {
    const facilityName =
      booking.facilityName || booking.resourceName || booking.equipmentName || "-";

    const bookingDate = normalizeDate(booking);

    return (
      <div className="bg-[#081225] border border-white/10 rounded-2xl p-5 hover:border-[#0A6ED3]/40 transition">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{facilityName}</h3>
            <p className="text-sm text-gray-400 mt-1">{booking.purpose || "-"}</p>
          </div>

          <div>{booking.status && <span className={getStatusBadge(booking.status)}>{booking.status}</span>}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <CalendarDays size={16} className="text-[#6CB6FF]" />
            <span>{bookingDate || "-"}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Clock3 size={16} className="text-[#6CB6FF]" />
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} className="text-[#6CB6FF]" />
            <span>{booking.attendees ?? 0} attendees</span>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div>
            <span className="text-gray-400">Purpose: </span>
            <span className="text-white/90">{booking.purpose || "-"}</span>
          </div>

          <div>
            <span className="text-gray-400">Decision: </span>
            <span className="text-white/85">
              {booking.adminReason || booking.reason || "-"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {booking.status === "APPROVED" && (
            <button
              onClick={() => handleCancel(booking.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              Cancel
            </button>
          )}

          {(booking.status === "REJECTED" || booking.status === "CANCELLED") && (
            <button
              onClick={() => handleBookAgain(booking)}
              className="bg-[#0A6ED3] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              Book Again
            </button>
          )}

          {(booking.status === "PENDING" ||
            booking.status === "REJECTED" ||
            booking.status === "CANCELLED") && (
            <button
              onClick={() => handleDelete(booking.id)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-semibold mb-2">My Bookings</h2>
            <p className="text-gray-400">
              View and manage your submitted booking requests.
            </p>
          </div>

          <button
            onClick={() => {
              const role = localStorage.getItem("role") || "";
              const basePath = role === "LECTURER" ? "/lecturer" : "/student";
              navigate(`${basePath}/bookings/calendar`);
            }}
            className="bg-[#0A6ED3] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Calendar View
          </button>
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

        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search facility or purpose"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0b1730] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
            >
              <option value="UPCOMING">Upcoming First</option>
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-xl transition"
              >
                <RotateCcw size={16} />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-[#081225] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        ) : filteredAndSortedBookings.length === 0 ? (
          <div className="bg-[#081225] p-8 rounded-2xl border border-white/10 text-center">
            <p className="text-gray-400">No bookings found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {upcomingBookings.length > 0 && (
              <div>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-white">
                    Upcoming Bookings
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Your approved upcoming bookings are shown here first.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            {otherBookings.length > 0 && (
              <div>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-white">
                    Booking History
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Pending, rejected, cancelled, and other past records.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {otherBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentBookings;