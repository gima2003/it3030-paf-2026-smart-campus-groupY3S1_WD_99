import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaBell, FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";

function TechnicianNavbar() {
  const { user, setUser, logout, fetchUser } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <div className="h-16 bg-[#000919] border-b border-white/10 px-6 flex justify-between items-center relative z-40">

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">
          Technician Dashboard
        </h3>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* User Info */}
          {user && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-gray-400">ID: {user.employeeId}</span>
            </div>
          )}

          {/* Notification */}
          <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-white transition" />

          {/* Profile Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition focus:outline-none"
            >
              <FaUserCircle className="text-2xl transform transition hover:scale-110" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                
                <button 
                  onClick={() => { setIsProfileOpen(true); setIsDropdownOpen(false); }}
                  className="w-full text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <span className="text-lg">👤</span> My Profile
                </button>

                <div className="px-5 py-2 mt-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Security Settings</div>
                  {!user?.mfaEnabled ? (
                    <a 
                      href="/mfa-setup" 
                      className="w-full text-left py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2 transition"
                    >
                      🛡️ Enable 2FA
                    </a>
                  ) : (
                    <div className="w-full text-left py-2 text-sm text-green-600 flex items-center gap-2 font-medium">
                      ✅ 2FA Enabled
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition font-medium"
                >
                  <span className="text-lg">🚪</span> Logout
                </button>
              </div>
            )}
          </div>

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

export default TechnicianNavbar;