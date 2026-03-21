import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios"; // 🔥 ADDED

function StudentTickets() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      <h2 className="text-3xl font-semibold mb-6">Ticket Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-5 py-2 rounded-lg ${
            activeTab === "create"
              ? "bg-[#0A6ED3]"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Create Ticket
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`px-5 py-2 rounded-lg ${
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

/* ================= FORM ================= */

function CreateTicketForm() {
  const [form, setForm] = useState({
    itNumber: "",
    email: "",
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
  const emailPattern = /^(IT|it)\d{8}@my\.sliit\.lk$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    let newErrors = {};

    if (!itPattern.test(form.itNumber)) {
      newErrors.itNumber = "Format: IT12345678";
    }

    if (!emailPattern.test(form.email)) {
      newErrors.email = "Format: IT12345678@my.sliit.lk";
    }

    if (!form.title) newErrors.title = "Required";
    if (!form.description) newErrors.description = "Required";
    if (!form.room) newErrors.room = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* 🔥 MAIN BACKEND CONNECTION */
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

        createdByEmail: form.email,
        createdById: form.itNumber,
        createdByRole: "STUDENT"
      };

      const res = await axios.post(
        "http://localhost:8081/api/tickets",
        payload
      );

      console.log(res.data);

      alert("✅ Ticket Submitted Successfully!");

      // 🔥 RESET FORM
      setForm({
        itNumber: "",
        email: "",
        title: "",
        description: "",
        category: "Electrical",
        priority: "Low",
        building: "Main Building",
        room: "",
        files: [],
      });

    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 3);
    setForm((prev) => ({ ...prev, files: droppedFiles }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    setForm((prev) => ({ ...prev, files: selectedFiles }));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl backdrop-blur-md">

      <h3 className="text-lg font-semibold mb-6 text-[#0A6ED3]">
        Raise a Support Ticket
      </h3>

      {/* STUDENT INFO */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div>
          <label className="text-gray-300">IT Number *</label>
          <input
            name="itNumber"
            value={form.itNumber}
            onChange={handleChange}
            placeholder="IT12345678"
            className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
          />
          {errors.itNumber && <p className="text-red-400 text-sm">{errors.itNumber}</p>}
        </div>

        <div>
          <label className="text-gray-300">Email *</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="IT12345678@my.sliit.lk"
            className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
        </div>

      </div>

      {/* TITLE */}
      <div className="mb-5">
        <label className="text-gray-300">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
        />
        {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
      </div>

      {/* DESCRIPTION */}
      <div className="mb-6">
        <label className="text-gray-300">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mt-1 bg-transparent border border-white/10 rounded-lg"
        />
        {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
      </div>

      {/* CATEGORY + PRIORITY */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <select name="category" onChange={handleChange} className="p-3 bg-[#000919] border border-white/10 rounded-lg">
          <option>Electrical</option>
          <option>Hardware</option>
          <option>Network</option>
          <option>Facility</option>
        </select>

        <select name="priority" onChange={handleChange} className="p-3 bg-[#000919] border border-white/10 rounded-lg">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

      </div>

      {/* LOCATION */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <select name="building" onChange={handleChange} className="p-3 bg-[#000919] border border-white/10 rounded-lg">
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
          {errors.room && <p className="text-red-400 text-sm">{errors.room}</p>}
        </div>

      </div>

      {/* FILE UPLOAD */}
      <div className="mb-6">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/20 p-8 text-center rounded-xl hover:border-[#0A6ED3]"
        >
          <input type="file" multiple onChange={handleFileSelect} className="hidden" id="upload" />

          <label htmlFor="upload" className="cursor-pointer">
            <FaUpload className="mx-auto text-3xl text-[#0A6ED3]" />
            <p className="mt-2">Drag & drop or click to upload</p>
          </label>
        </div>

        {form.files.map((file, i) => (
          <div key={i} className="text-sm mt-2">{file.name}</div>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#0A6ED3] px-6 py-3 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

/* ================= LIST ================= */

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!email) {
          console.error("No email found in localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:8081/api/tickets/user/${email}`
        );

        console.log("Fetched tickets:", res.data);

        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets(); // ✅ NOW USED
  }, [email]);

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
    <div className="bg-white/5 p-6 rounded-2xl space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="p-4 rounded-xl border border-white/10 bg-[#000919] flex justify-between items-center"
        >
          <div>
            <h4 className="font-semibold text-white">{ticket.title}</h4>
            <p className="text-sm text-gray-400">
              {ticket.building} - {ticket.room}
            </p>
          </div>

          <div className="flex gap-3 items-center">

            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.status === "OPEN"
                ? "bg-blue-500 text-white"
                : ticket.status === "IN_PROGRESS"
                ? "bg-yellow-400 text-black"
                : ticket.status === "RESOLVED"
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }`}>
              {ticket.status.replace("_", " ")}
            </span>

            <span className={`text-sm font-semibold ${
              ticket.priority === "High"
                ? "text-red-400"
                : ticket.priority === "Medium"
                ? "text-yellow-400"
                : "text-green-400"
            }`}>
              {ticket.priority}
            </span>

          </div>
        </div>
      ))}
    </div>
  );
}


export default StudentTickets;