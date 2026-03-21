function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Secure Login",
      description:
        "Users authenticate using university credentials through secure OAuth login.",
    },
    {
      number: "02",
      title: "Submit Request",
      description:
        "Students and lecturers can book resources or report maintenance issues easily.",
    },
    {
      number: "03",
      title: "Approval & Assignment",
      description:
        "Admins review bookings and assign technicians based on workload and priority.",
    },
    {
      number: "04",
      title: "Track & Manage",
      description:
        "Users monitor booking status and technicians update task progress in real-time.",
    },
  ];

  return (
    <section className="bg-[#000919] py-24 px-8">
      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <h2 className="text-4xl font-bold text-white">
          How Smart Campus Works
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          A streamlined workflow connecting students, lecturers, administrators,
          and technicians in one unified platform.
        </p>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Number */}
              <div className="text-4xl font-bold text-[#0A6ED3]">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorksSection;