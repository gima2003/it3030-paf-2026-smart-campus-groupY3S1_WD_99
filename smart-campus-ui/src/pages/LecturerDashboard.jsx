import { FaCalendarCheck, FaTools, FaBell, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LecturerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      {/* Title */}
      <h2 className="text-3xl font-semibold mb-8">Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Upcoming Bookings"
          value="2"
          icon={<FaCalendarCheck />}
        />
        <Card
          title="Open Tickets"
          value="1"
          icon={<FaTools />}
        />
        <Card
          title="Unread Notifications"
          value="3"
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
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

        <ul className="space-y-4 text-gray-300">
          <li className="border-b border-white/10 pb-3">
            Booking request for{" "}
            <strong className="text-white">Seminar Hall 1</strong> is pending
            approval.
          </li>
          <li className="border-b border-white/10 pb-3">
            Ticket for{" "}
            <strong className="text-white">Projector Not Working</strong> marked
            as{" "}
            <span className="text-[#0A6ED3] font-medium">IN_PROGRESS</span>.
          </li>
          <li>
            Your booking for{" "}
            <strong className="text-white">Computer Lab 2</strong> was{" "}
            <span className="text-green-400 font-medium">APPROVED</span>.
          </li>
        </ul>
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
