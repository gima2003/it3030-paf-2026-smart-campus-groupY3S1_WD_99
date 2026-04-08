import React from "react";

function StudentBookings() {
  return (
    <div className="bg-[#000919] min-h-screen p-8 text-white">
      <h2 className="text-3xl font-semibold mb-6">My Bookings</h2>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <p className="text-gray-400">No recent bookings found.</p>
      </div>
    </div>
  );
}

export default StudentBookings;
