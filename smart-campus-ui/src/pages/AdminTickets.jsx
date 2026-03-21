import { useState, useEffect } from "react";
import axios from "axios";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [newStatus, setNewStatus] = useState("");
  const [technician, setTechnician] = useState("");

  // ✅ FETCH TICKETS
const fetchTickets = async () => {
  try {
    const res = await axios.get("http://localhost:8081/api/tickets");
    setTickets(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const loadData = async () => {
    await fetchTickets();
  };

  loadData();
}, []);

  // ✅ UPDATE TICKET
  const updateTicket = async () => {
    if (!selectedTicket) return;

    try {
      await axios.put(
        `http://localhost:8081/api/tickets/${selectedTicket.id}`,
        {
          status: newStatus,
          assignedTechnician: technician,
        }
      );

      alert("Ticket updated!");
      fetchTickets();
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  // ✅ FILTER
  const filteredTickets =
    filterStatus === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  // ✅ PRIORITY COLOR
  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-400 font-semibold";
      case "medium":
        return "text-yellow-400 font-semibold";
      case "low":
        return "text-green-400 font-semibold";
      default:
        return "text-gray-300";
    }
  };

  // ✅ STATUS BADGE
  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-500 text-white";
      case "IN_PROGRESS":
        return "bg-yellow-400 text-black";
      case "RESOLVED":
        return "bg-green-500 text-white";
      case "CLOSED":
        return "bg-gray-500 text-white";
      case "REJECTED":
        return "bg-red-500 text-white";
      default:
        return "bg-white/10 text-white";
    }
  };

  const formatStatus = (status) => status?.replace("_", " ");

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-semibold">
          Maintenance & Ticket Management
        </h2>
        <div className="text-gray-400">
          Total Tickets: {tickets.length}
        </div>
      </div>

      {/* FILTER */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="p-3 bg-[#000919] border border-white/10 rounded-lg mb-6"
      >
        <option value="ALL">All</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="space-y-4">
          {filteredTickets.length === 0 && (
            <p className="text-gray-400">No tickets found</p>
          )}

          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition"
            >
              <h3 className="font-semibold">{ticket.title}</h3>
              <p className="text-sm text-gray-400">{ticket.student}</p>

              <div className="flex justify-between mt-3 items-center">
                {/* STATUS */}
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(ticket.status)}`}>
                  {formatStatus(ticket.status)}
                </span>

                {/* PRIORITY */}
                <span className={getPriorityStyle(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

          {!selectedTicket ? (
            <p className="text-gray-400 text-center mt-20">
              Select a ticket
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4 text-[#0A6ED3]">
                Ticket Details
              </h3>

              <p><strong>Title:</strong> {selectedTicket.title}</p>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <p><strong>Location:</strong> {selectedTicket.building} - {selectedTicket.room}</p>
              <p><strong>Assigned:</strong> {selectedTicket.assignedTechnician || "Not Assigned"}</p>

              {/* ASSIGN TECHNICIAN */}
              <div className="mt-4">
                <label>Assign Technician</label>
                <input
                  className="w-full p-2 mt-1 bg-[#000919] border border-white/10 rounded"
                  placeholder="Enter technician email"
                  onChange={(e) => setTechnician(e.target.value)}
                />
              </div>

              {/* UPDATE STATUS */}
              <div className="mt-4">
                <label>Update Status</label>
                <select
                  className="w-full p-2 mt-1 bg-[#000919] border border-white/10 rounded"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>RESOLVED</option>
                  <option>CLOSED</option>
                  <option>REJECTED</option>
                </select>
              </div>

              <button
                onClick={updateTicket}
                className="mt-5 w-full bg-[#0A6ED3] p-3 rounded hover:bg-[#054E98]"
              >
                Update Ticket
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminTickets;