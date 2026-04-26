import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import AdminViewUserModal from "../components/AdminViewUserModal";

function AdminTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTech, setViewingTech] = useState(null);

  const fetchTechnicians = async () => {
    try {
      const users = await getAllUsers();
      const techs = users.filter(u => u.role === "TECHNICIAN");
      setTechnicians(techs);
    } catch (err) {
      console.error("Error fetching technicians:", err);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleViewDetails = (tech) => {
    setViewingTech(tech);
    setIsViewModalOpen(true);
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
                <td className="px-4 py-3">{tech.employeeId || tech.id}</td>
                <td className="px-4 py-3">{tech.firstName} {tech.lastName}</td>
                <td className="px-4 py-3">{tech.email}</td>
                <td className="px-4 py-3">{tech.phone}</td>
                <td className="px-4 py-3">{tech.specialization || "General"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tech.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tech.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleViewDetails(tech)}
                    className="bg-[#0A6ED3]/20 text-[#0A6ED3] px-3 py-1 rounded-lg hover:bg-[#0A6ED3]/30 transition"
                  >
                    View Tec Details
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

      <AdminViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={viewingTech}
      />
    </div>
  );
}

export default AdminTechnicians;