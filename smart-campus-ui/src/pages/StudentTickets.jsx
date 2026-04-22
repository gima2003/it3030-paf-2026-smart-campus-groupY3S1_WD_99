import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import {
  FaUpload,
  FaPaperPlane,
  FaComments,
  FaTrash,
  FaImage,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function StudentTickets() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      <h2 className="text-3xl font-semibold mb-6">Ticket Management</h2>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "create"
              ? "bg-[#0A6ED3]"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Create Ticket
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "list"
              ? "bg-[#0A6ED3]"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          My Tickets
        </button>
      </div>

      {activeTab === "create" ? <CreateTicketForm /> : <MyTickets />}
    </div>
  );
}

/* ================= CREATE FORM ================= */

function CreateTicketForm() {
  const API = "http://localhost:8081";
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    itNumber: "",
    email: user?.email || localStorage.getItem("email") || "",
    title: "",
    description: "",
    category: "Electrical",
    priority: "Low",
    building: "Main Building",
    room: "",
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const itPattern = /^(IT|it)\d{8}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (user?.role === 'LECTURER' || user?.role === 'MANAGER') {
      if (!form.itNumber || form.itNumber.trim() === "") {
        newErrors.itNumber = "Required";
      }
    } else {
      if (!itPattern.test(form.itNumber)) {
        newErrors.itNumber = "Format: IT12345678";
      }
    }

    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Required";
    }

    if (!form.title.trim()) newErrors.title = "Required";
    if (!form.description.trim()) newErrors.description = "Required";
    if (!form.room.trim()) newErrors.room = "Required";

    if (form.files.length > 3) {
      newErrors.files = "Maximum 3 images allowed";
    }

    const nonImageFile = form.files.find(
      (file) => file.type && !file.type.startsWith("image/")
    );
    if (nonImageFile) {
      newErrors.files = "Only image files are allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      itNumber: "",
      email: user?.email || localStorage.getItem("email") || "",
      title: "",
      description: "",
      category: "Electrical",
      priority: "Low",
      building: "Main Building",
      room: "",
      files: [],
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        building: form.building,
        room: form.room,
        createdByEmail:
          user?.email || localStorage.getItem("email") || form.email,
        createdById: form.itNumber,
        createdByRole: user?.role || "STUDENT",
      };

      const ticketRes = await axios.post(`${API}/api/tickets`, payload);
      const savedTicket = ticketRes.data;

      if (form.files && form.files.length > 0) {
        const uploadData = new FormData();

        form.files.forEach((file) => {
          uploadData.append("files", file);
        });

        try {
          await axios.post(
            `${API}/api/ticket-attachments/upload/${savedTicket.id}`,
            uploadData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          alert("✅ Ticket submitted successfully with attachments!");
        } catch (uploadErr) {
          console.error("Attachment upload failed:", uploadErr);
          console.error("Upload response data:", uploadErr.response?.data);
          console.error("Upload status:", uploadErr.response?.status);

          alert(
            `⚠️ Ticket was created, but image upload failed. ${
              uploadErr.response?.data || ""
            }`
          );
        }
      } else {
        alert("✅ Ticket submitted successfully!");
      }

      resetForm();
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("❌ Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 3) {
      setErrors((prev) => ({
        ...prev,
        files: "Maximum 3 images allowed",
      }));
    }

    const limitedFiles = droppedFiles.slice(0, 3);

    const onlyImages = limitedFiles.filter(
      (file) => file.type && file.type.startsWith("image/")
    );

    setForm((prev) => ({ ...prev, files: onlyImages }));

    if (limitedFiles.length !== onlyImages.length) {
      setErrors((prev) => ({
        ...prev,
        files: "Only image files are allowed",
      }));
    } else if (droppedFiles.length <= 3) {
      setErrors((prev) => ({
        ...prev,
        files: "",
      }));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setErrors((prev) => ({
        ...prev,
        files: "Maximum 3 images allowed",
      }));
    }

    const limitedFiles = selectedFiles.slice(0, 3);

    const onlyImages = limitedFiles.filter(
      (file) => file.type && file.type.startsWith("image/")
    );

    setForm((prev) => ({ ...prev, files: onlyImages }));

    if (limitedFiles.length !== onlyImages.length) {
      setErrors((prev) => ({
        ...prev,
        files: "Only image files are allowed",
      }));
    } else if (selectedFiles.length <= 3) {
      setErrors((prev) => ({
        ...prev,
        files: "",
      }));
    }

    e.target.value = "";
  };

  const removeSelectedFile = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }));

    setErrors((prev) => ({
      ...prev,
      files: "",
    }));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-6 text-[#0A6ED3]">
        Raise a Support Ticket
      </h3>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-gray-300">
            {user?.role === 'LECTURER' || user?.role === 'MANAGER' ? 'Employee ID *' : 'IT Number *'}
          </label>
          <input
            name="itNumber"
            value={form.itNumber}
            onChange={handleChange}
            placeholder={user?.role === 'LECTURER' || user?.role === 'MANAGER' ? 'EMP12345' : 'IT12345678'}
            className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
          />
          {errors.itNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.itNumber}</p>
          )}
        </div>

        <div>
          <label className="text-gray-300">Email (Auto-filled) *</label>
          <input
            name="email"
            value={form.email}
            readOnly
            className="w-full p-3 mt-1 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-gray-300">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="text-gray-300">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-3 bg-[#000919] border border-white/10 rounded-lg"
        >
          <option>Electrical</option>
          <option>Hardware</option>
          <option>Network</option>
          <option>Facility</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="p-3 bg-[#000919] border border-white/10 rounded-lg"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <select
          name="building"
          value={form.building}
          onChange={handleChange}
          className="p-3 bg-[#000919] border border-white/10 rounded-lg"
        >
          <option>Main Building</option>
          <option>New Building</option>
        </select>

        <div>
          <input
            name="room"
            value={form.room}
            onChange={handleChange}
            placeholder="Room (e.g., G1303)"
            className="w-full p-3 bg-transparent border border-white/10 rounded-lg"
          />
          {errors.room && (
            <p className="text-red-400 text-sm mt-1">{errors.room}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/20 p-8 text-center rounded-xl hover:border-[#0A6ED3] transition"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="upload"
          />

          <label htmlFor="upload" className="cursor-pointer">
            <FaUpload className="mx-auto text-3xl text-[#0A6ED3]" />
            <p className="mt-2">Drag & drop or click to upload</p>
            <p className="mt-1 text-sm text-gray-400">Up to 3 images</p>
          </label>
        </div>

        {errors.files && (
          <p className="text-red-400 text-sm mt-2">{errors.files}</p>
        )}

        {form.files.length > 0 && (
          <div className="mt-3 space-y-2">
            {form.files.map((file, i) => (
              <div
                key={i}
                className="text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between gap-3"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  className="text-red-400 hover:text-red-300 transition"
                  title="Remove image"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0A6ED3] px-6 py-3 rounded-lg hover:bg-[#085bb0] transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

/* ================= MY TICKETS ================= */

function MyTickets() {
  const API = "http://localhost:8081";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "Electrical",
    priority: "Low",
    building: "Main Building",
    room: "",
  });

  const { user } = useContext(AuthContext);
  const email = user?.email || localStorage.getItem("email");

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const fetchTickets = useCallback(async () => {
    try {
      if (!email) return;

      const res = await axios.get(`${API}/api/tickets/user/${email}`);
      const fetchedTickets = res.data || [];
      setTickets(fetchedTickets);

      if (fetchedTickets.length > 0) {
        setSelectedTicketId((prevId) => {
          const stillExists = fetchedTickets.some((t) => t.id === prevId);
          return stillExists ? prevId : fetchedTickets[0].id;
        });
      } else {
        setSelectedTicketId(null);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setTickets([]);
      setSelectedTicketId(null);
    } finally {
      setLoading(false);
    }
  }, [API, email]);

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
    fetchTickets();
  }, [fetchTickets]);

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

  useEffect(() => {
    if (selectedTicket) {
      setEditForm({
        title: selectedTicket.title || "",
        description: selectedTicket.description || "",
        category: selectedTicket.category || "Electrical",
        priority: selectedTicket.priority || "Low",
        building: selectedTicket.building || "Main Building",
        room: selectedTicket.room || "",
      });
      setEditErrors({});
      setIsEditing(false);
    }
  }, [selectedTicket]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicketId(ticket.id);
    setIsEditing(false);
    setEditErrors({});
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) return;

    try {
      setCommentLoading(true);

      const payload = {
        ticketId: selectedTicket.id,
        message: commentText,
        createdByEmail: email,
        createdByRole: user?.role || "STUDENT",
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

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      const res = await axios.delete(
        `${API}/api/ticket-attachments/${attachmentId}`
      );

      if (selectedTicket?.id) {
        await fetchAttachments(selectedTicket.id);
      }

      console.log("Delete response:", res.data);
      alert("Attachment deleted successfully");
    } catch (err) {
      console.error("Error deleting attachment:", err);
      console.error("Backend response:", err.response?.data);
      alert(
        `Failed to delete attachment: ${
          err.response?.data || "Unknown error"
        }`
      );
    }
  };

  const handleImageError = (attachmentId, info) => {
    console.log("Image failed:", info);
    setImageErrors((prev) => ({
      ...prev,
      [attachmentId]: true,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editForm.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editForm.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!editForm.room.trim()) {
      newErrors.room = "Room is required";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditCancel = () => {
    if (!selectedTicket) return;

    setEditForm({
      title: selectedTicket.title || "",
      description: selectedTicket.description || "",
      category: selectedTicket.category || "Electrical",
      priority: selectedTicket.priority || "Low",
      building: selectedTicket.building || "Main Building",
      room: selectedTicket.room || "",
    });
    setEditErrors({});
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    if (!selectedTicket) return;
    if (!validateEditForm()) return;

    try {
      setEditLoading(true);

      const payload = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        priority: editForm.priority,
        building: editForm.building,
        room: editForm.room,
      };

      await axios.put(`${API}/api/tickets/${selectedTicket.id}`, payload);

      await fetchTickets();
      setIsEditing(false);
      alert("✅ Ticket updated successfully");
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data ||
          "❌ Failed to update ticket"
      );
    } finally {
      setEditLoading(false);
    }
  };

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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-300";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl">
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl">
        <p>No tickets yet</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-5">My Tickets</h3>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket)}
              className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                selectedTicketId === ticket.id
                  ? "border-[#0A6ED3] bg-[#0B1220]"
                  : "border-white/10 bg-[#000919] hover:bg-[#0B1220]"
              }`}
            >
              <div>
                <h4 className="font-semibold text-white">{ticket.title}</h4>
                <p className="text-sm text-gray-400">
                  {ticket.building} - {ticket.room}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    ticket.status
                  )}`}
                >
                  {ticket.status?.replace("_", " ")}
                </span>

                <span
                  className={`text-sm font-semibold ${getPriorityStyle(
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

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        {!selectedTicket ? (
          <p className="text-gray-400 text-center mt-20">Select a ticket</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-semibold text-[#0A6ED3]">
                Ticket Details
              </h3>

              {selectedTicket.status === "OPEN" && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 bg-[#0A6ED3] px-4 py-2 rounded-lg hover:bg-[#085bb0] transition"
                >
                  <FaEdit />
                  Edit Ticket
                </button>
              )}
            </div>

            {isEditing && selectedTicket.status === "OPEN" ? (
              <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Edit Ticket
                </h4>

                <div className="mb-4">
                  <label className="text-gray-300">Title *</label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full p-3 mt-1 bg-[#000919] border border-white/10 rounded-lg"
                  />
                  {editErrors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {editErrors.title}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-gray-300">Description *</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full p-3 mt-1 bg-[#000919] border border-white/10 rounded-lg"
                  />
                  {editErrors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {editErrors.description}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-300 block mb-1">Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="w-full p-3 bg-[#000919] border border-white/10 rounded-lg"
                    >
                      <option>Electrical</option>
                      <option>Hardware</option>
                      <option>Network</option>
                      <option>Facility</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Priority</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                      className="w-full p-3 bg-[#000919] border border-white/10 rounded-lg"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-300 block mb-1">Building</label>
                    <select
                      name="building"
                      value={editForm.building}
                      onChange={handleEditChange}
                      className="w-full p-3 bg-[#000919] border border-white/10 rounded-lg"
                    >
                      <option>Main Building</option>
                      <option>New Building</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Room *</label>
                    <input
                      name="room"
                      value={editForm.room}
                      onChange={handleEditChange}
                      className="w-full p-3 bg-[#000919] border border-white/10 rounded-lg"
                    />
                    {editErrors.room && (
                      <p className="text-red-400 text-sm mt-1">
                        {editErrors.room}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleEditCancel}
                    disabled={editLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition disabled:opacity-60"
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    onClick={handleEditSave}
                    disabled={editLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A6ED3] hover:bg-[#085bb0] transition disabled:opacity-60"
                  >
                    <FaSave />
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                <p className="text-gray-200">
                  <strong className="text-white">Title:</strong>{" "}
                  {selectedTicket.title}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Description:</strong>{" "}
                  {selectedTicket.description}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Category:</strong>{" "}
                  {selectedTicket.category}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Priority:</strong>{" "}
                  {selectedTicket.priority}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Location:</strong>{" "}
                  {selectedTicket.building} - {selectedTicket.room}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Status:</strong>{" "}
                  {selectedTicket.status?.replace("_", " ")}
                </p>
                <p className="text-gray-200">
                  <strong className="text-white">Assigned Technician:</strong>{" "}
                  {selectedTicket.technicianEmail || "Not Assigned Yet"}
                </p>
              </div>
            )}

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

                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-gray-300 truncate">
                            {att.fileName}
                          </p>

                          <button
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete attachment"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-5">
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
  );
}

export default StudentTickets;