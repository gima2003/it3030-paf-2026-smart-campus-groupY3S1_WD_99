import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#000919]/95 backdrop-blur-md px-8 py-4 flex justify-between items-center">

      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Smart Campus 360 Logo"
          className="h-12 w-auto object-contain"
        />
        <h1 className="text-lg font-semibold text-white">
          Smart Campus 360
        </h1>
      </div>

      {/* Middle - Links */}
      <div className="hidden md:flex gap-8 text-gray-300 font-medium">

        <button
          onClick={() => navigate("/")}
          className="hover:text-white transition"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/features")}
          className="hover:text-white transition"
        >
          Features
        </button>

        <button
          onClick={() => navigate("/about")}
          className="hover:text-white transition"
        >
          About
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="hover:text-white transition"
        >
          Contact
        </button>

      </div>

      {/* Right - Auth */}
      <div className="flex items-center gap-4">

        {/* Login */}
        <button
          onClick={() => navigate("/login")}
          className="text-gray-300 hover:text-white font-medium transition"
        >
          Login
        </button>

        {/* Sign Up */}
        <button
          onClick={() => navigate("/signup")}
          className="bg-[#0A6ED3] text-white px-5 py-2 rounded-lg hover:bg-[#054E98] transition shadow-md"
        >
          Sign Up
        </button>

        {/* Profile */}
        <FaUserCircle className="text-2xl text-gray-400 cursor-pointer hover:text-white transition" />
      </div>
    </nav>
  );
}

export default Navbar;