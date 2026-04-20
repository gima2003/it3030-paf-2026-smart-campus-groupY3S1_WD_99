import dashboardPreview from "../assets/prev1.jpeg";

function HeroSection() {
  return (
    <section className="bg-[#000919] py-28 px-8 text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">

        {/* Left Content */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Transforming Campus Management with
            <span className="text-[#0A6ED3]"> Smart Digital Solutions</span>
          </h2>

          <p className="mt-6 text-lg text-gray-300">
            A centralized system for booking facilities, tracking maintenance,
            and managing campus operations with role-based access control.
          </p>

          <div className="mt-8 flex gap-4">
            {/* Primary Button */}
            <button className="bg-[#0A6ED3] text-white px-8 py-3 rounded-lg hover:bg-[#054E98] transition">
              Get Started
            </button>

            {/* Secondary Button */}
            <button className="border border-gray-400 px-8 py-3 rounded-lg hover:bg-white hover:text-[#000919] transition">
              Learn More
            </button>
          </div>
        </div>

      {/* Right Preview */}
<div className="hidden md:block">
  <div className="bg-white/5 border border-white/10 h-80 rounded-2xl overflow-hidden shadow-lg">
    
    <img
      src={dashboardPreview}
      alt="Dashboard Preview"
      className="w-full h-full object-cover"
    />

  </div>
</div>

      </div>
    </section>
  );
}

export default HeroSection;