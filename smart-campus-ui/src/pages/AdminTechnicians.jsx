import { useEffect, useState } from "react";
import axios from "axios";

function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "HARDWARE",
    status: "ACTIVE",
  });

  // Fetch all technicians from backend
  const fetchTechnicians = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/technicians");
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  };

  useEffect(() => {
    const loadTechnicians = async () => {
      await fetchTechnicians();
    };

    loadTechnicians();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8081/api/technicians", formData);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        specialization: "HARDWARE",
        status: "ACTIVE",
      });

      fetchTechnicians();
    } catch (err) {
      console.error("Error adding technician:", err);
      alert("Failed to add technician");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/technicians/${id}`);
      fetchTechnicians();
    } catch (err) {
      console.error("Error deleting technician:", err);
      alert("Failed to delete technician");
    }
  };

  return (
    <div className="p-8 bg-[#000919] min-h-screen text-white">
      <h1 className="text-4xl font-bold text-white mb-8">
        Technicians Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-[#0B1220] rounded-2xl shadow-md border border-white/10 p-6">
          <h2 className="text-2xl font-semibold text-white mb-5">
            Add Technician
          </h2>

          <form onSubmit={handleAddTechnician} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter technician name"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000919] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter technician email"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000919] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000919] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000919] text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
              >
                <option value="HARDWARE">Hardware</option>
                <option value="NETWORK">Network</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="SOFTWARE">Software</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000919] text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A6ED3] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Add Technician
            </button>
          </form>
        </div>

        {/* Technician Table */}
        <div className="lg:col-span-2 bg-[#0B1220] rounded-2xl shadow-md border border-white/10 p-6 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-white mb-5">
            Technician List
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#000919] text-white">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Specialization</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {technicians.map((tech) => (
                <tr key={tech.id} className="border-b border-white/10 text-gray-200">
                  <td className="px-4 py-3">{tech.id}</td>
                  <td className="px-4 py-3">{tech.fullName}</td>
                  <td className="px-4 py-3">{tech.email}</td>
                  <td className="px-4 py-3">{tech.phone}</td>
                  <td className="px-4 py-3">{tech.specialization}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tech.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {tech.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {technicians.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No technicians found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTechnicians;