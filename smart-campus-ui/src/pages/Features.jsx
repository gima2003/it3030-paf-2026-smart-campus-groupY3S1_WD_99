import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUniversity,
  FaCalendarCheck,
  FaTools,
  FaBell,
  FaUserShield,
  FaSearch,
  FaImage,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

function Features() {
  const mainFeatures = [
    {
      icon: <FaUniversity className="text-3xl text-[#0A6ED3]" />,
      title: "Resource Management",
      description:
        "Browse lecture halls, labs, meeting rooms, and equipment with key details such as type, capacity, location, and availability.",
    },
    {
      icon: <FaCalendarCheck className="text-3xl text-[#0A6ED3]" />,
      title: "Booking Management",
      description:
        "Create booking requests, follow approval status, and manage reservations through a clear structured workflow.",
    },
    {
      icon: <FaSearch className="text-3xl text-[#0A6ED3]" />,
      title: "Conflict Detection",
      description:
        "Reduce overlapping reservations by validating booking requests for the same resource, date, and time range.",
    },
    {
      icon: <FaTools className="text-3xl text-[#0A6ED3]" />,
      title: "Maintenance Ticketing",
      description:
        "Report campus issues, monitor ticket progress, and support technician-based maintenance handling in one place.",
    },
    {
      icon: <FaBell className="text-3xl text-[#0A6ED3]" />,
      title: "Notifications",
      description:
        "Receive updates for approvals, ticket progress, assignments, and other important workflow changes.",
    },
    {
      icon: <FaUserShield className="text-3xl text-[#0A6ED3]" />,
      title: "Role-Based Access",
      description:
        "Students, admins, and technicians access different features based on their responsibilities and permissions.",
    },
  ];

  const highlights = [
    {
      icon: <FaImage className="text-[#0A6ED3] text-xl" />,
      title: "Image Attachments",
      text: "Add visual evidence when reporting issues.",
    },
    {
      icon: <FaCheckCircle className="text-[#0A6ED3] text-xl" />,
      title: "Status Tracking",
      text: "Follow booking and ticket progress clearly.",
    },
    {
      icon: <FaCalendarCheck className="text-[#0A6ED3] text-xl" />,
      title: "Book Again",
      text: "Recreate booking requests more quickly.",
    },
  ];

  return (
    <div className="bg-[#000919] text-white min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="px-6 md:px-12 lg:px-20 py-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#0A6ED3] uppercase tracking-[0.2em] text-sm font-semibold mb-2">
            Features
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            System Features & Functional Capabilities
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-7">
            A set of tools designed to manage bookings, maintenance requests,
            notifications, and role-based campus operations efficiently.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-[#071225] border border-white/10 rounded-3xl p-6 hover:border-[#0A6ED3]/60 hover:-translate-y-2 transition duration-300"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#0A6ED3]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A6ED3]/10 border border-[#0A6ED3]/20 flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

                  <p className="text-gray-400 leading-7 mb-5">
                    {feature.description}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Highlights */}
      <section className="px-6 md:px-12 lg:px-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#071225] to-[#0B1220] border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Additional Highlights
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-8">
                Small but useful features that improve the overall user
                experience and make the platform more practical.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#000919]/60 border border-white/10 rounded-2xl p-6 text-center hover:border-[#0A6ED3]/50 transition duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#0A6ED3]/10 border border-[#0A6ED3]/20 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-7">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Features;