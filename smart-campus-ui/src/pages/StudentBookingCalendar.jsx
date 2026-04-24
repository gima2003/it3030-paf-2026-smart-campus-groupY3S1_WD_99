import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Views, Navigate } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getUserBookings } from "../services/bookingService";

const localizer = momentLocalizer(moment);

/* -----------------------------
   Custom Toolbar
   ----------------------------- */
function CustomToolbar(toolbar) {
  const goToBack = () => {
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToToday = () => {
    toolbar.onNavigate(Navigate.TODAY);
  };

  const changeView = (view) => {
    toolbar.onView(view);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#081225] px-4 py-4 border-b border-white/10">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={goToToday}
          className="bg-[#0b1730] hover:bg-[#0A6ED3] text-white px-5 py-3 rounded-xl border border-white/10 transition font-medium"
        >
          Today
        </button>

        <button
          type="button"
          onClick={goToBack}
          className="bg-[#0b1730] hover:bg-[#0A6ED3] text-white px-5 py-3 rounded-xl border border-white/10 transition font-medium"
        >
          Back
        </button>

        <button
          type="button"
          onClick={goToNext}
          className="bg-[#0b1730] hover:bg-[#0A6ED3] text-white px-5 py-3 rounded-xl border border-white/10 transition font-medium"
        >
          Next
        </button>
      </div>

      <div className="text-white text-2xl font-bold text-center">
        {toolbar.label}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => changeView(Views.MONTH)}
          className={`px-5 py-3 rounded-xl border transition font-medium ${
            toolbar.view === Views.MONTH
              ? "bg-[#0A6ED3] text-white border-[#0A6ED3]"
              : "bg-[#0b1730] text-white border-white/10 hover:bg-[#0A6ED3]"
          }`}
        >
          Month
        </button>

        <button
          type="button"
          onClick={() => changeView(Views.WEEK)}
          className={`px-5 py-3 rounded-xl border transition font-medium ${
            toolbar.view === Views.WEEK
              ? "bg-[#0A6ED3] text-white border-[#0A6ED3]"
              : "bg-[#0b1730] text-white border-white/10 hover:bg-[#0A6ED3]"
          }`}
        >
          Week
        </button>

        <button
          type="button"
          onClick={() => changeView(Views.DAY)}
          className={`px-5 py-3 rounded-xl border transition font-medium ${
            toolbar.view === Views.DAY
              ? "bg-[#0A6ED3] text-white border-[#0A6ED3]"
              : "bg-[#0b1730] text-white border-white/10 hover:bg-[#0A6ED3]"
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
}

/* -----------------------------
   Custom Event Card
   -----------------------------
   Makes bookings look like small cards
   inside the date box instead of plain text
*/
function BookingEventCard({ event }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="font-semibold truncate">{event.resourceName}</div>
      <div className="text-[10px] opacity-90 truncate">{event.timeLabel}</div>
    </div>
  );
}

function StudentBookingCalendar() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Controlled calendar state
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const storedUserId = localStorage.getItem("userId") || "1";
      const data = await getUserBookings(storedUserId);

      console.log("Student calendar bookings:", data);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setErrorMessage("Failed to load booking calendar.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------
     Build calendar events
     --------------------------------- */
  const events = useMemo(() => {
    return bookings.map((booking) => {
      const resourceName =
        booking.facilityName || booking.equipmentName || "Resource";

      const start = new Date(`${booking.bookingDate}T${booking.startTime}`);
      const end = new Date(`${booking.bookingDate}T${booking.endTime}`);

      const timeLabel = `${moment(start).format("h:mm A")} - ${moment(end).format("h:mm A")}`;

      return {
        id: booking.id,
        title: `${resourceName} • ${timeLabel}`,
        start,
        end,
        status: booking.status,
        purpose: booking.purpose,
        resourceName,
        timeLabel,
      };
    });
  }, [bookings]);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#0A6ED3";
    let borderColor = "#0A6ED3";

    if (event.status === "APPROVED") {
      backgroundColor = "#15803d";
      borderColor = "#22c55e";
    }

    if (event.status === "PENDING") {
      backgroundColor = "#a16207";
      borderColor = "#eab308";
    }

    if (event.status === "REJECTED") {
      backgroundColor = "#b91c1c";
      borderColor = "#ef4444";
    }

    if (event.status === "CANCELLED") {
      backgroundColor = "#475569";
      borderColor = "#94a3b8";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "12px",
        color: "#ffffff",
        border: `1px solid ${borderColor}`,
        padding: "6px 8px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "default",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        minHeight: "42px",
      },
    };
  };

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto mt-2 md:mt-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-semibold mb-2">My Booking Calendar</h2>
            <p className="text-gray-400">
              View your bookings in calendar format.
            </p>
          </div>

          <button
            onClick={() => {
              const role = localStorage.getItem("role") || "";
              const basePath = role === "LECTURER" ? "/lecturer" : "/student";
              navigate(`${basePath}/bookings`);
            }}
            className="bg-[#0A6ED3] hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl transition"
          >
            Back to My Bookings
          </button>
        </div>

        {loading && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-300 mb-6">
            Loading booking calendar...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 mb-6">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <div className="bg-[#081225] p-5 md:p-6 rounded-2xl border border-white/10 shadow-xl">
            {/* Legend */}
            <div className="mb-5 flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-300 border border-green-600/30">
                Approved
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                Pending
              </span>
              <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-300 border border-red-600/30">
                Rejected
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
                Cancelled
              </span>
            </div>

            <div
              className="student-booking-calendar bg-[#06101f] rounded-xl overflow-hidden border border-white/10"
              style={{ height: "780px" }}
            >
              <Calendar
                localizer={localizer}
                events={events}
                date={currentDate}
                view={currentView}
                onNavigate={(date) => setCurrentDate(date)}
                onView={(view) => setCurrentView(view)}
                startAccessor="start"
                endAccessor="end"
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                selectable={false}
                popup
                toolbar={true}
                components={{
                  toolbar: CustomToolbar,
                  event: BookingEventCard,
                }}
                eventPropGetter={eventStyleGetter}
                min={new Date(0, 0, 0, 7, 0, 0)}
                max={new Date(0, 0, 0, 20, 0, 0)}
                step={60}
                timeslots={1}
                formats={{
                  timeGutterFormat: "h A",
                  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                    `${localizer.format(start, "h:mm A", culture)} - ${localizer.format(
                      end,
                      "h:mm A",
                      culture
                    )}`,
                  dayHeaderFormat: "ddd D",
                  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    `${localizer.format(start, "MMM D", culture)} - ${localizer.format(
                      end,
                      "MMM D",
                      culture
                    )}`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .student-booking-calendar .rbc-calendar {
          background: #06101f;
          color: #ffffff;
          font-family: inherit;
        }

        /* Hide default toolbar because custom toolbar is used */
        .student-booking-calendar .rbc-toolbar {
          display: none;
        }

        .student-booking-calendar .rbc-month-view,
        .student-booking-calendar .rbc-time-view {
          border: none;
        }

        .student-booking-calendar .rbc-header {
          background: #0b1730;
          color: #dbeafe;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.05);
          padding: 12px 8px;
          font-weight: 600;
        }

        .student-booking-calendar .rbc-date-cell {
          padding: 6px 8px;
          color: #cbd5e1;
          font-weight: 600;
        }

        .student-booking-calendar .rbc-row-bg,
        .student-booking-calendar .rbc-day-bg,
        .student-booking-calendar .rbc-month-row,
        .student-booking-calendar .rbc-time-content,
        .student-booking-calendar .rbc-timeslot-group,
        .student-booking-calendar .rbc-time-header-content {
          border-color: rgba(255,255,255,0.06);
        }

        .student-booking-calendar .rbc-month-row,
        .student-booking-calendar .rbc-time-content,
        .student-booking-calendar .rbc-day-slot .rbc-time-slot {
          background: #06101f;
          color: white;
        }

        .student-booking-calendar .rbc-time-gutter,
        .student-booking-calendar .rbc-time-gutter .rbc-timeslot-group,
        .student-booking-calendar .rbc-label {
          background: #081225;
          color: #94a3b8;
          border-color: rgba(255,255,255,0.06);
        }

        .student-booking-calendar .rbc-day-bg.rbc-today,
        .student-booking-calendar .rbc-today {
          background: rgba(10,110,211,0.10);
        }

        .student-booking-calendar .rbc-off-range-bg {
          background: #050d19;
        }

        .student-booking-calendar .rbc-off-range {
          color: #64748b;
        }

        .student-booking-calendar .rbc-current-time-indicator {
          background-color: #38bdf8;
        }

        /* Make events display-only */
        .student-booking-calendar .rbc-event,
        .student-booking-calendar .rbc-event-content {
          pointer-events: none !important;
        }

        .student-booking-calendar .rbc-show-more {
          color: #93c5fd;
          background: transparent;
        }

        /* Reduce clutter in week/day */
        .student-booking-calendar .rbc-time-slot {
          border-top: 1px solid rgba(255,255,255,0.04) !important;
        }

        /* Better month cell spacing so booking looks like a card under the date */
        .student-booking-calendar .rbc-row-content {
          z-index: 4;
          padding: 4px 6px 6px;
        }

        .student-booking-calendar .rbc-event {
          margin-top: 4px;
        }

        .student-booking-calendar .rbc-month-row {
          min-height: 140px;
        }

        .student-booking-calendar .rbc-event-content {
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }
      `}</style>
    </div>
  );
}

export default StudentBookingCalendar;