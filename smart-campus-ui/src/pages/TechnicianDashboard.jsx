import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import axios from "axios";
import {
  FaTools,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaComments,
  FaPaperPlane,
  FaImage,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function TechnicianDashboard() {
  const { showToast } = useToast();
  const API = "http://localhost:8081";

  const { user } = useContext(AuthContext);
  const technicianEmail =
    user?.email || localStorage.getItem("email") || "tech01@sliit.lk";

  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const fetchAssignedTickets = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/api/tickets/technician/${technicianEmail}`
      );
      setTickets(res.data || []);
    } catch (err) {
      console.error("Error fetching technician tickets:", err);
      setTickets([]);
    }
  }, [API, technicianEmail]);

  const fetchComments = useCallback(
    async (ticketId) => {
      try {
        const res = await axios.get(
          `${API}/api/ticket-comments/ticket/${ticketId}`
        );
        setComments(res.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    },
    [API]
  );

  const fetchAttachments = useCallback(
    async (ticketId) => {
      try {
        setAttachmentLoading(true);
        const res = await axios.get(
          `${API}/api/ticket-attachments/ticket/${ticketId}`
        );
        setAttachments(res.data || []);
        setImageErrors({});
      } catch (err) {
        console.error("Error fetching attachments:", err);
        setAttachments([]);
        setImageErrors({});
      } finally {
        setAttachmentLoading(false);
      }
    },
    [API]
  );

  useEffect(() => {
    fetchAssignedTickets();
  }, [fetchAssignedTickets]);

  useEffect(() => {
    if (selectedTicketId) {
      fetchComments(selectedTicketId);
      fetchAttachments(selectedTicketId);
    } else {
      setComments([]);
      setAttachments([]);
      setImageErrors({});
    }
  }, [selectedTicketId, fetchComments, fetchAttachments]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicketId(ticket.id);
    setNewStatus(ticket.status || "IN_PROGRESS");
    setCommentText("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;

    try {
      await axios.put(`${API}/api/tickets/${selectedTicket.id}/status`, null, {
        params: { status: newStatus },
      });

      await fetchAssignedTickets();
      showToast("Ticket status updated successfully!", "success");
    } catch (err) {
      console.error("Error updating ticket status:", err);
      showToast("Failed to update ticket status", "error");
    }
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) return;

    try {
      setCommentLoading(true);

      const payload = {
        ticketId: selectedTicket.id,
        message: commentText,
        createdByEmail: technicianEmail,
        createdByRole: "TECHNICIAN",
      };

      await axios.post(`${API}/api/ticket-comments`, payload);
      setCommentText("");
      await fetchComments(selectedTicket.id);
      showToast("Comment added successfully!", "success");
    } catch (err) {
      console.error("Error adding comment:", err);
      showToast("Failed to add comment", "error");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleImageError = (attachmentId, info) => {
    console.log("Technician image failed:", info);
    setImageErrors((prev) => ({
      ...prev,
      [attachmentId]: true,
    }));
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
      case "REJECTED":
        return "bg-red-500 text-white";
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

  const formatStatus = (status) => status?.replace("_", " ");

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>

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
                className={`p-4 bg-[#000919] border rounded-xl flex justify-between cursor-pointer transition ${selectedTicketId === ticket.id
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
                    {formatStatus(ticket.status)}
                  </span>

                  <span
                    className={`text-sm font-medium ${getPriorityStyle(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          {!selectedTicket ? (
            <p className="text-gray-400 text-center mt-20">Select a ticket</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-[#0A6ED3] mb-4">
                Ticket Details
              </h3>

              <div className="space-y-2 mb-6">
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Title:</strong>{" "}
                  {selectedTicket.title}
                </p>
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Description:</strong>{" "}
                  {selectedTicket.description}
                </p>
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Category:</strong>{" "}
                  {selectedTicket.category}
                </p>
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Priority:</strong>{" "}
                  {selectedTicket.priority}
                </p>
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Location:</strong>{" "}
                  {selectedTicket.building} - {selectedTicket.room}
                </p>
                <p className="mb-2 text-gray-200">
                  <strong className="text-white">Status:</strong>{" "}
                  {formatStatus(selectedTicket.status)}
                </p>
              </div>

              <div className="border-t border-white/10 pt-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaImage className="text-[#0A6ED3]" />
                  <h4 className="text-lg font-semibold text-white">
                    Attachments
                  </h4>
                </div>

                {attachmentLoading ? (
                  <p className="text-gray-400 text-sm">Loading attachments...</p>
                ) : attachments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No attachments</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attachments.map((att) => {
                      const imageUrl = `${API}/api/ticket-attachments/view/${att.id}`;

                      return (
                        <div
                          key={att.id}
                          className="bg-[#000919] border border-white/10 rounded-xl p-3"
                        >
                          {!imageErrors[att.id] ? (
                            <img
                              src={imageUrl}
                              alt={att.fileName}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                              loading="lazy"
                              onError={() => handleImageError(att.id, att)}
                            />
                          ) : (
                            <div className="w-full h-40 rounded-lg mb-3 bg-white/5 border border-white/10 flex items-center justify-center text-center p-4">
                              <div>
                                <FaImage className="mx-auto text-2xl text-gray-500 mb-2" />
                                <p className="text-sm text-gray-400">
                                  Failed to load image
                                </p>
                              </div>
                            </div>
                          )}

                          <p className="text-sm text-gray-300 truncate">
                            {att.fileName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

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
                      className="inline-flex items-center gap-2 bg-[#0A6ED3] px-5 py-2.5 rounded-lg hover:bg-[#085bb0] transition disabled:opacity-60 text-white"
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