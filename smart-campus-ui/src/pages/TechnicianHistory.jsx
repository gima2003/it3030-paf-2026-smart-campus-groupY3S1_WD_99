import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

function TechnicianHistory() {
  const API = "http://localhost:8081";
  const { user } = useContext(AuthContext);
  const technicianEmail = user?.email || localStorage.getItem("email") || "tech01@sliit.lk";

  const [historyTickets, setHistoryTickets] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/tickets/technician/${technicianEmail}`);
      const tickets = res.data || [];
      // Only keep RESOLVED or CLOSED tickets
      const completed = tickets.filter(
        (t) => t.status === "RESOLVED" || t.status === "CLOSED"
      );
      // Sort newest first based on resolvedAt or updatedAt
      completed.sort((a, b) => new Date(b.resolvedAt || b.updatedAt) - new Date(a.resolvedAt || a.updatedAt));
      setHistoryTickets(completed);
    } catch (err) {
      console.error("Error fetching history tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [API, technicianEmail]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTickets = filter === "ALL"
    ? historyTickets
    : historyTickets.filter((t) => t.status === filter);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    if (status === "RESOLVED") {
      return <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCheckCircle /> RESOLVED</span>;
    }
    if (status === "CLOSED") {
      return <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaTimesCircle /> CLOSED</span>;
    }
    return <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold">{status}</span>;
  };

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Service History</h2>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Filter by Status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 bg-[#0B1220] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#0A6ED3]"
          >
            <option value="ALL">All Completed</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0B1220] rounded-2xl shadow-md border border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#000919] text-gray-400 text-sm">
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Ticket Details</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Location & Category</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Completion Date</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading history...</td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">📜</span>
                    <p>No resolved or closed tickets found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white mb-1">{ticket.title}</div>
                    <div className="text-xs text-gray-400">ID: {ticket.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-200">{ticket.building} - {ticket.room}</div>
                    <div className="text-xs text-gray-400 mt-1">{ticket.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FaClock className="text-[#0A6ED3]" />
                      {formatDateTime(ticket.resolvedAt || ticket.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TechnicianHistory;
