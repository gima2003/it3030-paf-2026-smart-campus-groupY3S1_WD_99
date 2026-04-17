import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBell, FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

function StudentNavbar() {
  const { user, setUser, logout, fetchUser } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      <div className="h-16 bg-[#000919] border-b border-white/10 px-6 flex justify-between items-center relative z-40">

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">
          Student Dashboard
        </h3>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* User Info */}
          {user && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-gray-400">ID: {user.studentId}</span>
            </div>
          )}

          {/* Notification */}
          <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-white transition" />

          {/* Profile */}
          <FaUserCircle
            onClick={() => setIsProfileOpen(true)}
            className="text-gray-400 text-2xl cursor-pointer hover:text-white transition transform hover:scale-110"
          />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-[#0A6ED3] text-white px-4 py-2 rounded-lg hover:bg-[#054E98] transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateSuccess={(updatedUser) => setUser(updatedUser)}
      />
    </>
  );
}

export default StudentNavbar;