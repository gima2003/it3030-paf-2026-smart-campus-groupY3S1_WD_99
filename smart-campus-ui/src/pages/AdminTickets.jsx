import { useState, useEffect } from "react";
import axios from "axios";

function AdminTickets() {
  const API = "http://localhost:8081";

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [newStatus, setNewStatus] = useState("");
  const [technician, setTechnician] = useState("");

  // FETCH ALL TICKETS
  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/api/tickets`);
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  // FETCH ALL TECHNICIANS
  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(`${API}/api/technicians`);
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTickets();
      await fetchTechnicians();
    };

    loadData();
  }, []);

  // WHEN SELECTING A TICKET, PRELOAD CURRENT VALUES
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTechnician(ticket.technicianEmail || "");
    setNewStatus(ticket.status || "OPEN");
  };

  // UPDATE TICKET
  const updateTicket = async () => {
    if (!selectedTicket) return;

    try {
      // 1. Assign technician first if selected
      if (technician && technician.trim() !== "") {
        await axios.put(
          `${API}/api/tickets/${selectedTicket.id}/assign`,
          null,
          {
            params: { technicianEmail: technician },
          }
        );
      }

      // 2. Then update status
      if (newStatus && newStatus.trim() !== "") {
        await axios.put(
          `${API}/api/tickets/${selectedTicket.id}/status`,
          null,
          {
            params: { status: newStatus },
          }
        );
      }

      await fetchTickets();

      setSelectedTicket({
        ...selectedTicket,
        technicianEmail: technician,
        status: newStatus,
      });

      alert("Ticket updated successfully!");
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket");
    }
  };

  // FILTER
  const filteredTickets =
    filterStatus === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  // PRIORITY COLOR
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

  // STATUS BADGE
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
              onClick={() => handleSelectTicket(ticket)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedTicket?.id === ticket.id
                  ? "border-[#0A6ED3] bg-white/10"
                  : "border-white/10 hover:bg-white/10"
              }`}
            >
              <h3 className="font-semibold">{ticket.title}</h3>

              <p className="text-sm text-gray-400 mt-1">
                {ticket.building} - {ticket.room}
              </p>

              <div className="flex justify-between mt-3 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {formatStatus(ticket.status)}
                </span>

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

              <p className="mb-2">
                <strong>Title:</strong> {selectedTicket.title}
              </p>
              <p className="mb-2">
                <strong>Description:</strong> {selectedTicket.description}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {selectedTicket.category}
              </p>
              <p className="mb-2">
                <strong>Priority:</strong> {selectedTicket.priority}
              </p>
              <p className="mb-2">
                <strong>Location:</strong> {selectedTicket.building} -{" "}
                {selectedTicket.room}
              </p>
              <p className="mb-2">
                <strong>Current Status:</strong>{" "}
                {formatStatus(selectedTicket.status)}
              </p>
              <p className="mb-2">
                <strong>Assigned Technician:</strong>{" "}
                {selectedTicket.technicianEmail || "Not Assigned"}
              </p>

              {/* ASSIGN TECHNICIAN */}
              <div className="mt-4">
                <label className="block mb-2">Assign Technician</label>
                <select
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full p-3 bg-[#000919] border border-white/10 rounded"
                >
                  <option value="">Select Technician</option>
                  {technicians
                    .filter((tech) => tech.status === "ACTIVE")
                    .map((tech) => (
                      <option key={tech.id} value={tech.email}>
                        {tech.fullName} - {tech.specialization}
                      </option>
                    ))}
                </select>
              </div>

              {/* UPDATE STATUS */}
              <div className="mt-4">
                <label className="block mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 bg-[#000919] border border-white/10 rounded"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <button
                onClick={updateTicket}
                className="mt-5 w-full bg-[#0A6ED3] p-3 rounded hover:bg-[#054E98] transition"
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