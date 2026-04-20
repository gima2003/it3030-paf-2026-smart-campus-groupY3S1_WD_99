import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

function StudentNavbar() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#000919]/95 backdrop-blur-md">
        <div className="h-20 px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-semibold tracking-tight">
              Student Dashboard
            </h2>
            <span className="text-sm text-gray-400">
              Manage bookings, resources, tickets, and notifications
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Notification */}
            <button
              className="relative w-11 h-11 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
              title="Notifications"
            >
              <FaBell className="text-lg" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0A6ED3] text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            {user && (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0A6ED3] to-[#054E98] flex items-center justify-center text-white shadow-md">
                  <FaUserCircle className="text-xl" />
                </div>

                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {user.studentId}
                  </span>
                </div>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A6ED3] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#085cb0] transition shadow-md shadow-blue-900/20"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

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