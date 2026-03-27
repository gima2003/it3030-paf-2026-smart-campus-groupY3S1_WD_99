import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTools,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function TechnicianDashboard() {
  const API = "http://localhost:8081";

  // TEMPORARY: later replace with logged-in technician email
  const technicianEmail = "tech01@sliit.lk";

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchAssignedTickets = async () => {
    try {
      const res = await axios.get(
        `${API}/api/tickets/technician/${technicianEmail}`
      );
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching technician tickets:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAssignedTickets();
    };

    loadData();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status || "IN_PROGRESS");
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;

    try {
      await axios.put(
        `${API}/api/tickets/${selectedTicket.id}/status`,
        null,
        {
          params: { status: newStatus },
        }
      );

      await fetchAssignedTickets();

      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
      });

      alert("Ticket status updated successfully!");
    } catch (err) {
      console.error("Error updating ticket status:", err);
      alert("Failed to update ticket status");
    }
  };

  const assigned = tickets.length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
  const highPriority = tickets.filter(
    (t) => t.priority?.toLowerCase() === "high"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-600 text-white";
      case "IN_PROGRESS":
        return "bg-yellow-400 text-black";
      case "RESOLVED":
        return "bg-green-500 text-white";
      case "CLOSED":
        return "bg-gray-500 text-white";
      default:
        return "bg-white/10 text-white";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Assigned" value={assigned} icon={<FaTools />} />
        <Card title="In Progress" value={inProgress} icon={<FaClock />} />
        <Card title="Resolved" value={resolved} icon={<FaCheckCircle />} />
        <Card
          title="High Priority"
          value={highPriority}
          icon={<FaExclamationTriangle />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - TICKET LIST */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg text-white mb-4">Assigned Tickets</h3>

          <div className="space-y-4">
            {tickets.length === 0 && (
              <p className="text-gray-400">No assigned tickets found</p>
            )}

            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket)}
                className={`p-4 bg-[#000919] border rounded-xl flex justify-between cursor-pointer transition ${
                  selectedTicket?.id === ticket.id
                    ? "border-[#0A6ED3]"
                    : "border-white/10 hover:bg-white/10"
                }`}
              >
                <div>
                  <h4 className="text-white font-medium">{ticket.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {ticket.building} - {ticket.room}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>

                  <span className={`text-sm font-medium ${getPriorityStyle(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
       <div className="bg-white/5 p-6 rounded-xl border border-white/10">
  {!selectedTicket ? (
    <p className="text-gray-400 text-center mt-20">
      Select a ticket
    </p>
  ) : (
    <>
      <h3 className="text-xl font-semibold text-[#0A6ED3] mb-4">
        Ticket Details
      </h3>

      <p className="mb-2 text-gray-200">
        <strong className="text-white">Title:</strong> {selectedTicket.title}
      </p>
      <p className="mb-2 text-gray-200">
        <strong className="text-white">Description:</strong> {selectedTicket.description}
      </p>
      <p className="mb-2 text-gray-200">
        <strong className="text-white">Category:</strong> {selectedTicket.category}
      </p>
      <p className="mb-2 text-gray-200">
        <strong className="text-white">Priority:</strong> {selectedTicket.priority}
      </p>
      <p className="mb-2 text-gray-200">
        <strong className="text-white">Location:</strong> {selectedTicket.building} - {selectedTicket.room}
      </p>
      <p className="mb-2 text-gray-200">
        <strong className="text-white">Status:</strong> {selectedTicket.status}
      </p>

      <div className="mt-4">
        <label className="block mb-2 text-white">Update Status</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full p-3 bg-[#000919] border border-white/10 rounded text-white"
        >
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <button
        onClick={handleUpdateStatus}
        className="mt-5 w-full bg-[#0A6ED3] p-3 rounded hover:bg-[#054E98] transition text-white"
      >
        Update Ticket Status
      </button>
    </>
  )}
</div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl text-[#0A6ED3] font-bold">{value}</h3>
      </div>
      <div className="text-[#0A6ED3] text-xl">{icon}</div>
    </div>
  );
}

export default TechnicianDashboard;