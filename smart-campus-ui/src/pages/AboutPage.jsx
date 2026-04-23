import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBuilding, FaUsers, FaLightbulb, FaShieldAlt } from "react-icons/fa";

function AboutPage() {
  return (
    <div className="bg-[#000919] text-white min-h-screen">
      <Navbar />

      <section className="px-6 md:px-12 lg:px-20 py-20 relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#0A6ED3] uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Empowering Education Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A6ED3] to-indigo-400">Innovation</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Smart Campus 360 is a next-generation platform designed to streamline campus operations, 
            enhance facility management, and create a seamless educational experience for students, 
            lecturers, and staff.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-16 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We aim to bridge the gap between technology and education by providing a centralized 
              hub for campus resources. Our mission is to eliminate administrative bottlenecks, 
              reduce resource conflicts, and provide real-time insights into campus operations.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="bg-[#071225] border border-white/10 rounded-2xl p-6 hover:border-[#0A6ED3]/60 transition duration-300">
                <h3 className="text-3xl font-bold text-[#0A6ED3] mb-2">10k+</h3>
                <p className="text-gray-400 text-sm">Active Students</p>
              </div>
              <div className="bg-[#071225] border border-white/10 rounded-2xl p-6 hover:border-indigo-400/60 transition duration-300">
                <h3 className="text-3xl font-bold text-indigo-400 mb-2">500+</h3>
                <p className="text-gray-400 text-sm">Campus Facilities</p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0A6ED3] to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative h-96 bg-[#071225] border border-white/10 rounded-2xl overflow-hidden p-8 flex items-center justify-center">
              <div className="text-center">
                <FaBuilding className="text-8xl text-[#0A6ED3]/20 mx-auto mb-6" />
                <p className="text-2xl font-semibold text-gray-300">Modernizing the way campuses operate.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Values</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">The principles that drive our platform and guide our continuous development.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#071225] border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-[#0A6ED3]/50">
              <div className="w-14 h-14 rounded-2xl bg-[#0A6ED3]/10 flex items-center justify-center mb-6">
                <FaLightbulb className="text-2xl text-[#0A6ED3]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Constantly evolving to bring the latest technological advancements to campus management.</p>
            </div>
            <div className="bg-[#071225] border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-indigo-400/50">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <FaUsers className="text-2xl text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Designed with students, faculty, and administrators in mind for a seamless experience.</p>
            </div>
            <div className="bg-[#071225] border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-[#0A6ED3]/50">
              <div className="w-14 h-14 rounded-2xl bg-[#0A6ED3]/10 flex items-center justify-center mb-6">
                <FaShieldAlt className="text-2xl text-[#0A6ED3]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Ensuring data protection and privacy with role-based access and secure authentication.</p>
            </div>
            <div className="bg-[#071225] border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-indigo-400/50">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <FaBuilding className="text-2xl text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliability</h3>
              <p className="text-gray-400 text-sm leading-relaxed">A robust infrastructure that guarantees high availability and consistent performance.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
