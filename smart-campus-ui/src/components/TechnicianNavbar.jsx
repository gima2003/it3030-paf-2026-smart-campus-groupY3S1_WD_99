import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TechnicianNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#000919] border-b border-white/10">

      <h1 className="text-white text-lg font-semibold">
        Technician Dashboard
      </h1>

      <div className="flex items-center gap-5 text-white">

        <FaBell className="cursor-pointer" size={18} />
        <FaUserCircle size={22} />

        <button
          onClick={handleLogout}
          className="bg-[#0A6ED3] px-4 py-1 rounded-lg hover:bg-[#054E98]"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default TechnicianNavbar;