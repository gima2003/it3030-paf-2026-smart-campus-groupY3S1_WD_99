import { useEffect, useState } from "react";
import axios from "axios";

function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);

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
    try {
      const res = await axios.get("http://localhost:8081/api/technicians");
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  };

  loadTechnicians();
}, []);

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

      <div className="bg-[#0B1220] rounded-2xl shadow-md border border-white/10 p-6 overflow-x-auto">
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
              <tr
                key={tech.id}
                className="border-b border-white/10 text-gray-200"
              >
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
  );
}

export default AdminTechnicians;