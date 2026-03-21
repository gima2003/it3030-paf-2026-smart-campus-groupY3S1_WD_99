function CTASection() {
  return (
    <section className="bg-[#000919] py-24 px-8 text-center">
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h2 className="text-4xl font-bold text-white">
          Ready to Experience Smart Campus Management?
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-400 leading-relaxed">
          Secure, role-based access designed to streamline bookings,
          maintenance workflows, and campus operations efficiently.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <button className="bg-[#0A6ED3] text-white font-semibold px-10 py-4 rounded-xl hover:bg-[#085bb5] transition text-lg shadow-md">
            Login with University Email
          </button>
        </div>

      </div>
    </section>
  );
}

export default CTASection;