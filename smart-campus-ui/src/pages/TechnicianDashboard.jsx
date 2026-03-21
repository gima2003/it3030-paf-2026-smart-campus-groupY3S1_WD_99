import { FaTools, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function TechnicianDashboard() {

  const tickets = [
    { id: 1, title: "Projector not working", location: "G1303", priority: "High", status: "OPEN" },
    { id: 2, title: "AC not cooling", location: "N202", priority: "Medium", status: "IN_PROGRESS" },
    { id: 3, title: "Light issue", location: "A505", priority: "Low", status: "RESOLVED" }
  ];

  const assigned = tickets.length;
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const highPriority = tickets.filter(t => t.priority === "High").length;

  return (
    <div>

      <h2 className="text-2xl font-semibold text-white mb-6">Overview</h2>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Assigned" value={assigned} icon={<FaTools />} />
        <Card title="In Progress" value={inProgress} icon={<FaClock />} />
        <Card title="Resolved" value={resolved} icon={<FaCheckCircle />} />
        <Card title="High Priority" value={highPriority} icon={<FaExclamationTriangle />} />
      </div>

      {/* TICKETS */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-lg text-white mb-4">Assigned Tickets</h3>

        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="p-4 bg-[#000919] border border-white/10 rounded-xl flex justify-between">

              <div>
                <h4 className="text-white">{ticket.title}</h4>
                <p className="text-gray-400 text-sm">{ticket.location}</p>
              </div>

              <div className="flex gap-3 items-center">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  ticket.status === "OPEN"
                    ? "bg-blue-600"
                    : ticket.status === "IN_PROGRESS"
                    ? "bg-yellow-400 text-black"
                    : "bg-green-500"
                }`}>
                  {ticket.status}
                </span>

                <span className={`text-sm ${
                  ticket.priority === "High"
                    ? "text-red-400"
                    : ticket.priority === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}>
                  {ticket.priority}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl text-[#0A6ED3] font-bold">{value}</h3>
      </div>
      <div className="text-[#0A6ED3] text-xl">{icon}</div>
    </div>
  );
}

export default TechnicianDashboard;