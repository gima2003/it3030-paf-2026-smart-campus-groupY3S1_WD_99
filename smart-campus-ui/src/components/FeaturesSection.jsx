function FeaturesSection() {
  const features = [
    {
      title: "Smart Resource Booking",
      description:
        "Reserve classrooms and facilities with automated conflict detection and approval workflows.",
    },
    {
      title: "Maintenance Workflow",
      description:
        "Report technical issues and track technician assignments in real-time.",
    },
    {
      title: "Resource Management",
      description:
        "Admins can manage facilities, update availability, and control campus assets.",
    },
    {
      title: "Role-Based Access",
      description:
        "Secure authentication with customized dashboards for each campus role.",
    },
    {
      title: "Real-Time Notifications",
      description:
        "Instant updates for booking approvals, ticket status changes, and assignments.",
    },
    {
      title: "Analytics & Monitoring",
      description:
        "View booking statistics and technician workload insights from the dashboard.",
    },
  ];

  return (
    <section className="bg-white py-24 px-8">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-4xl font-bold text-[#000919]">
          Powerful Features for Smart Campus Operations
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Built to streamline academic and facility management efficiently.
        </p>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition"
            >
              {/* Accent Line */}
              <div className="w-10 h-1 bg-[#0A6ED3] mb-6 rounded-full"></div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#000919]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;