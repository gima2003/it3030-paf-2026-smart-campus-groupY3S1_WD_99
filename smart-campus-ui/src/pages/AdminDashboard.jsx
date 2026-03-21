function AdminDashboard() {
  return (
    <div className="p-6 bg-[#000919] min-h-screen text-white">

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-8">
        System Overview
      </h2>

      {/* Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        {/* Card 1 */}
        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Total Resources</h3>
          <p className="text-3xl font-bold mt-2 text-white">28</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Rooms, Labs, Equipment
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Pending Bookings</h3>
          <p className="text-3xl font-bold mt-2 text-white">6</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Awaiting Approval
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold mt-2 text-white">4</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Maintenance Issues
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10 hover:border-[#0A6ED3] transition">
          <h3 className="text-gray-400 text-sm">Active Technicians</h3>
          <p className="text-3xl font-bold mt-2 text-white">3</p>
          <span className="text-xs text-gray-500 mt-2 block">
            Currently Assigned
          </span>
        </div>

      </div>

      {/* Activity Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">
          Recent Activity
        </h3>

        <div className="bg-[#0B1220] p-6 rounded-xl border border-white/10">
          <ul className="space-y-3 text-gray-300 text-sm">

            <li className="border-b border-white/5 pb-2">
              Booking for Lecture Hall A approved
            </li>

            <li className="border-b border-white/5 pb-2">
              Ticket #12 assigned to Technician IT-02
            </li>

            <li className="border-b border-white/5 pb-2">
              Lab 3 marked OUT_OF_SERVICE
            </li>

            <li>
              New booking request for DSLR Camera #4
            </li>

          </ul>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;