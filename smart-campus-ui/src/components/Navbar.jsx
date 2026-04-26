import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#000919]/95 backdrop-blur-md border-b border-white/5 px-8 py-5 flex justify-between items-center z-50 relative sticky top-0">

      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Smart Campus 360 Logo"
          className="h-10 w-auto object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-xl font-bold tracking-tight text-white cursor-pointer" onClick={() => navigate("/")}>
          Smart Campus <span className="text-[#0A6ED3]">360</span>
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
        <button
          onClick={() => navigate("/login")}
          className="bg-[#0A6ED3] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0855A6] hover:shadow-[0_0_20px_rgba(10,110,211,0.4)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 border border-transparent hover:border-white/10"
        >
          Login to Dashboard
        </button>
      </div>

    </nav>
  );
}

export default Navbar;