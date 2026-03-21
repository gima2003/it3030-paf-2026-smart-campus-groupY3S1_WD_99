function AdminNavbar() {
  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="h-16 bg-[#000919] border-b border-white/10 px-6 flex justify-between items-center">

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">
        Admin Dashboard
      </h3>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Role Label */}
        <span className="text-gray-400 text-sm">
          Admin
        </span>

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

export default AdminNavbar;