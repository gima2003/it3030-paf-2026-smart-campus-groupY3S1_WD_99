import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

function StudentNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="h-16 bg-[#000919] border-b border-white/10 px-6 flex justify-between items-center">

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">
        Student Dashboard
      </h3>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-white transition" />

        {/* Profile */}
        <FaUserCircle className="text-gray-400 text-2xl cursor-pointer hover:text-white transition" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-[#0A6ED3] text-white px-4 py-2 rounded-lg hover:bg-[#054E98] transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default StudentNavbar;