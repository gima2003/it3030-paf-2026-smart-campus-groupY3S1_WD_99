function Footer() {
  return (
    <footer className="bg-[#000919] text-gray-400 py-16 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

        {/* Column 1 - System Info */}
        <div>
          <h3 className="text-xl font-semibold text-white">
            Smart Campus 360
          </h3>
          <p className="mt-4 leading-relaxed">
            A centralized campus management platform designed to
            streamline bookings, maintenance workflows, and academic
            resource management.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-3">
            <li className="hover:text-[#0A6ED3] cursor-pointer transition">
              Home
            </li>
            <li className="hover:text-[#0A6ED3] cursor-pointer transition">
              Features
            </li>
            <li className="hover:text-[#0A6ED3] cursor-pointer transition">
              How It Works
            </li>
            <li className="hover:text-[#0A6ED3] cursor-pointer transition">
              Login
            </li>
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white">
            Contact
          </h4>
          <p className="mt-4">support@university.edu</p>
          <p className="mt-1">+94 11 234 5678</p>
          <p className="mt-1">University IT Department</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
        © 2026 Smart Campus 360. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;