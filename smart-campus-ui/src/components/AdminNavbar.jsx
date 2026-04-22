import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { useToast } from "../context/ToastContext";

function AdminNavbar() {
  const { user, setUser, logout, fetchUser, token } = useContext(AuthContext);
  const { showToast } = useToast();
 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleDisableMfa = async () => {
    try {
      if (window.confirm("Are you sure you want to disable Two-Factor Authentication?")) {
        await axios.post("http://localhost:8081/api/auth/mfa/disable", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast("MFA has been successfully disabled.", "success");
        fetchUser(); // Refresh user state
        setIsDropdownOpen(false);
      }
    } catch (err) {
      showToast(err.response?.data || "Failed to disable MFA.", "error");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#000919]/90 backdrop-blur-md">
        <div className="h-20 px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Side */}
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-semibold tracking-tight">
              Admin Dashboard
            </h2>
            <span className="text-sm text-gray-400">
              Manage campus operations, bookings, tickets, and users
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 lg:gap-4">
            {user && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
            )}

            {/* Notification */}
            <NotificationBell rolePrefix="admin" />

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition focus:outline-none"
              >
                <FaUserCircle className="text-2xl transform transition hover:scale-110" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-[#0B1220] rounded-xl shadow-2xl border border-white/10 py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* User Info Header */}
                  <div className="px-5 py-3 border-b border-white/10">
                    <div className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</div>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => { setIsProfileOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-3 transition"
                    >
                      <span className="text-lg">👤</span> My Profile
                    </button>

                    <div className="px-5 py-2 mt-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Security Settings</div>
                      
                      {/* MFA Logic: Only for ADMIN and STUDENT */}
                      {(user?.role === "ADMIN" || user?.role === "STUDENT") && (
                        !user?.mfaEnabled ? (
                          <a 
                            href="/mfa-setup" 
                            className="w-full text-left py-2 px-3 -mx-3 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition"
                          >
                            🛡️ Enable 2FA
                          </a>
                        ) : (
                          <div className="flex flex-col gap-1 -mx-3">
                            <div className="w-full text-left py-2 px-3 rounded-lg text-sm text-green-400 flex items-center gap-2 font-medium bg-green-400/10 border border-green-400/20">
                              ✅ 2FA Enabled
                            </div>
                            <button 
                              onClick={handleDisableMfa}
                              className="w-full text-left py-2 px-3 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-2 transition"
                            >
                              ⚠️ Disable 2FA
                            </button>
                          </div>
                        )
                      )}

                      {/* Hide setting for Technician/Manager/Lecturer */}
                      {user?.role !== "ADMIN" && user?.role !== "STUDENT" && (
                         <span className="text-xs text-gray-500 italic block py-1">Managed by Administrator</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition font-medium"
                  >
                    <span className="text-lg">🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
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

export default AdminNavbar;