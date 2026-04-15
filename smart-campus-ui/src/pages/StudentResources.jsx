import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacilities } from "../services/facilityService";

function StudentResources() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    let updated = [...resources];

    if (search.trim()) {
      const term = search.toLowerCase();
      updated = updated.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term) ||
          item.type?.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "ALL") {
      updated = updated.filter((item) => item.type === typeFilter);
    }

    setFilteredResources(updated);
  }, [search, typeFilter, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getFacilities();
      const normalized = Array.isArray(data) ? data : [];
      setResources(normalized);
      setFilteredResources(normalized);
    } catch (error) {
      console.error("Failed to load resources:", error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  const uniqueTypes = ["ALL", ...new Set(resources.map((r) => r.type).filter(Boolean))];

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Browse Resources</h2>
          <p className="text-gray-400">
            Explore available facilities and create a booking request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Total Resources</p>
            <h3 className="text-3xl font-bold mt-2">{resources.length}</h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Bookable</p>
            <h3 className="text-3xl font-bold mt-2 text-green-300">
              {resources.filter((r) => r.bookable !== false).length}
            </h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Types</p>
            <h3 className="text-3xl font-bold mt-2 text-blue-300">
              {uniqueTypes.length - 1}
            </h3>
          </div>
        </div>

        <div className="bg-[#081225] p-5 rounded-2xl border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name, location, or type"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "All Types" : type}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("ALL");
              }}
              className="border border-white/10 hover:bg-white/5 text-white rounded-xl px-4 py-3 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#081225] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-[#081225] p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400">No resources available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#081225] border border-white/10 rounded-2xl p-6 hover:border-[#0A6ED3]/40 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{resource.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {resource.code || `Resource #${resource.id}`}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      resource.status === "ACTIVE"
                        ? "bg-green-500/10 text-green-300 border-green-500/30"
                        : "bg-red-500/10 text-red-300 border-red-500/30"
                    }`}
                  >
                    {resource.status || "ACTIVE"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-5">
                  <p>
                    <span className="text-gray-400">Type:</span>{" "}
                    {resource.type || "N/A"}
                  </p>
                  <p>
                    <span className="text-gray-400">Location:</span>{" "}
                    {resource.location || "N/A"}
                  </p>
                  <p>
                    <span className="text-gray-400">Capacity:</span>{" "}
                    {resource.capacity ?? "N/A"}
                  </p>
                  <p>
                    <span className="text-gray-400">Description:</span>{" "}
                    {resource.description || "No description available"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate("/student/bookings/new", {
                        state: { resourceId: resource.id },
                      })
                    }
                    disabled={resource.bookable === false || resource.status === "OUT_OF_SERVICE"}
                    className="flex-1 bg-[#0A6ED3] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition"
                  >
                    Book Now
                  </button>

                  <button className="px-4 py-3 border border-white/10 hover:bg-white/5 rounded-xl transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentResources;