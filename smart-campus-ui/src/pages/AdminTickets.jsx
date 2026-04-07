import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaComments, FaPaperPlane, FaImage } from "react-icons/fa";

function AdminTickets() {
  const API = "http://localhost:8081";

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [newStatus, setNewStatus] = useState("");
  const [technician, setTechnician] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);

  const adminEmail = localStorage.getItem("email") || "admin@sliit.lk";

  // FETCH ALL TICKETS
  const fetchTickets = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/tickets`);
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  }, []);

  // FETCH ALL TECHNICIANS
  const fetchTechnicians = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/technicians`);
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  }, []);

  // FETCH COMMENTS FOR SELECTED TICKET
  const fetchComments = useCallback(async (ticketId) => {
    try {
      const res = await axios.get(`${API}/api/ticket-comments/ticket/${ticketId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  }, []);

  // FETCH ATTACHMENTS FOR SELECTED TICKET
  const fetchAttachments = useCallback(async (ticketId) => {
    try {
      setAttachmentLoading(true);
      const res = await axios.get(`${API}/api/ticket-attachments/ticket/${ticketId}`);
      setAttachments(res.data);
    } catch (err) {
      console.error("Error fetching attachments:", err);
      setAttachments([]);
    } finally {
      setAttachmentLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchTickets();
      await fetchTechnicians();
    };

    loadData();
  }, [fetchTickets, fetchTechnicians]);

  useEffect(() => {
    if (selectedTicket?.id) {
      fetchComments(selectedTicket.id);
      fetchAttachments(selectedTicket.id);
    } else {
      setComments([]);
      setAttachments([]);
    }
  }, [selectedTicket, fetchComments, fetchAttachments]);

  // WHEN SELECTING A TICKET, PRELOAD CURRENT VALUES
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTechnician(ticket.technicianEmail || "");
    setNewStatus(ticket.status || "OPEN");
    setCommentText("");
  };

  // UPDATE TICKET
  const updateTicket = async () => {
    if (!selectedTicket) return;

    try {
      if (technician && technician.trim() !== "") {
        await axios.put(
          `${API}/api/tickets/${selectedTicket.id}/assign`,
          null,
          {
            params: { technicianEmail: technician },
          }
        );
      }

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

      setSelectedTicket((prev) => ({
        ...prev,
        technicianEmail: technician,
        status: newStatus,
      }));

      alert("Ticket updated successfully!");
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket");
    }
  };

  // ADD COMMENT
  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) return;

    try {
      setCommentLoading(true);

      const payload = {
        ticketId: selectedTicket.id,
        message: commentText,
        createdByEmail: adminEmail,
        createdByRole: "ADMIN",
      };

      await axios.post(`${API}/api/ticket-comments`, payload);
      setCommentText("");
      await fetchComments(selectedTicket.id);
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment");
    } finally {
      setCommentLoading(false);
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

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

              <div className="space-y-2 mb-6">
                <p className="text-gray-200">
                  <strong className="text-white">Title:</strong> {selectedTicket.title}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Description:</strong> {selectedTicket.description}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Category:</strong> {selectedTicket.category}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Priority:</strong> {selectedTicket.priority}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Location:</strong> {selectedTicket.building} -{" "}
                  {selectedTicket.room}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Current Status:</strong>{" "}
                  {formatStatus(selectedTicket.status)}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Assigned Technician:</strong>{" "}
                  {selectedTicket.technicianEmail || "Not Assigned"}
                </p>
              </div>

              {/* ATTACHMENTS */}
              <div className="border-t border-white/10 pt-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaImage className="text-[#0A6ED3]" />
                  <h4 className="text-lg font-semibold text-white">Attachments</h4>
                </div>

                {attachmentLoading ? (
                  <p className="text-gray-400 text-sm">Loading attachments...</p>
                ) : attachments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No attachments</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="bg-[#000919] border border-white/10 rounded-xl p-3"
                      >
                        <img
                          src={`${API}/api/ticket-attachments/view?path=${encodeURIComponent(
                            att.filePath
                          )}`}
                          alt={att.fileName}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />

                        <p className="text-sm text-gray-300 truncate">
                          {att.fileName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ASSIGN TECHNICIAN */}
              <div className="mt-4">
                <label className="block mb-2 text-white">Assign Technician</label>
                <select
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full p-3 bg-[#000919] border border-white/10 rounded text-white"
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
                <label className="block mb-2 text-white">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 bg-[#000919] border border-white/10 rounded text-white"
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

              {/* COMMENTS */}
              <div className="border-t border-white/10 pt-5 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaComments className="text-[#0A6ED3]" />
                  <h4 className="text-lg font-semibold text-white">Comments</h4>
                </div>

                <div className="bg-[#000919] border border-white/10 rounded-xl p-4 max-h-72 overflow-y-auto space-y-3 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-[#0A6ED3]">
                              {comment.createdByRole}
                            </p>
                            <p className="text-xs text-gray-400">
                              {comment.createdByEmail}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>

                        <p className="text-sm text-gray-200 whitespace-pre-wrap">
                          {comment.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3">
                  <textarea
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment about this ticket..."
                    className="w-full p-3 bg-[#000919] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0A6ED3]"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={commentLoading || !commentText.trim()}
                      className="inline-flex items-center gap-2 bg-[#0A6ED3] px-5 py-2.5 rounded-lg hover:bg-[#085bb0] transition disabled:opacity-60"
                    >
                      <FaPaperPlane />
                      {commentLoading ? "Sending..." : "Add Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTickets;