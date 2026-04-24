import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  MapPin,
  Users,
  Package,
  Building2,
  Wrench,
  Filter,
  SlidersHorizontal,
  X,
  Layers,
} from "lucide-react";
import FacilityDetailsModal from "../components/FacilityDetailsModal";

const FACILITY_API_URL = "http://localhost:8081/api/facilities";
const EQUIPMENT_API_URL = "http://localhost:8081/api/equipment";

const getFacilityImagesUrl = (facilityId) =>
  `http://localhost:8081/api/facilities/${facilityId}/images`;

const getEquipmentImagesUrl = (equipmentId) =>
  `http://localhost:8081/api/equipment/${equipmentId}/images`;

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ARCHIVED", label: "Archived" },
];

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All Resources" },
  { value: "FACILITY", label: "Facilities" },
  { value: "EQUIPMENT", label: "Equipment" },
];

const STATUS_CLASSES = {
  ACTIVE: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25",
  UNDER_MAINTENANCE:
    "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25",
  OUT_OF_SERVICE: "bg-red-500/15 text-red-300 ring-1 ring-red-500/25",
  INACTIVE: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/25",
  ARCHIVED: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25",
};

const STATUS_DOT = {
  ACTIVE: "bg-emerald-400",
  UNDER_MAINTENANCE: "bg-amber-400",
  OUT_OF_SERVICE: "bg-red-400",
  INACTIVE: "bg-slate-400",
  ARCHIVED: "bg-violet-400",
};

const getStatusClass = (status) =>
  STATUS_CLASSES[status] ?? "bg-white/10 text-white ring-1 ring-white/10";

const getStatusDot = (status) => STATUS_DOT[status] ?? "bg-white/40";

const formatEnum = (value) =>
  value
    ? value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : "N/A";

const normalizeFacility = (facility) => ({
  id: facility.id,
  category: "FACILITY",
  code: facility.code || "",
  name: facility.name || "Unnamed Facility",
  type: facility.facilityType || "",
  description: facility.description || "",
  location: facility.building || "N/A",
  capacity: facility.capacity ?? 0,
  status: facility.status || "ACTIVE",
  isBookable:
    facility.active !== undefined && facility.active !== null
      ? facility.active
      : true,
  indoorOutdoor: facility.indoorOutdoor || "",
  imageUrl: null,
});

const normalizeEquipment = (equipment) => ({
  id: equipment.id,
  category: "EQUIPMENT",
  code: equipment.code || "",
  name: equipment.name || "Unnamed Equipment",
  type: equipment.equipmentType || "",
  description: equipment.description || "",
  location: equipment.currentLocation || "N/A",
  capacity: equipment.quantity ?? 0,
  status: equipment.status || "ACTIVE",
  isBookable:
    equipment.active !== undefined && equipment.active !== null
      ? equipment.active
      : true,
  indoorOutdoor: "",
  imageUrl: null,
});

async function fetchPrimaryImage(resource) {
  try {
    const url =
      resource.category === "FACILITY"
        ? getFacilityImagesUrl(resource.id)
        : getEquipmentImagesUrl(resource.id);

    const response = await axios.get(url);
    const images = response.data || [];

    if (!images.length) return null;

    const primaryImage =
      images.find((img) => img.isPrimary === true) || images[0];

    return primaryImage?.imageUrl || null;
  } catch {
    return null;
  }
}

function FilterSelect({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6CB6FF]/60 pointer-events-none z-10"
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl bg-[#001233]/80 border border-white/8 ${
          Icon ? "pl-9" : "pl-4"
        } pr-8 py-2.5 text-sm text-white/90 outline-none focus:border-[#0A6ED3]/60 focus:ring-2 focus:ring-[#0A6ED3]/10 transition-all cursor-pointer hover:border-white/15`}
        style={{ backgroundImage: "none" }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#001233]"
          >
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/8 rounded-lg w-3/4" />
        <div className="h-3 bg-white/5 rounded-lg w-1/3" />
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-white/5 rounded-lg w-full" />
          <div className="h-3 bg-white/5 rounded-lg w-4/5" />
          <div className="h-3 bg-white/5 rounded-lg w-2/3" />
        </div>
        <div className="h-8 bg-white/6 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function ResourceCard({ resource, onViewDetails, onBookNow }) {
  const isFacility = resource.category === "FACILITY";

  return (
    <div className="group relative bg-[#001233]/60 border border-white/8 rounded-2xl overflow-hidden
      hover:border-[#0A6ED3]/40 transition-all duration-300 h-full flex flex-col
      hover:shadow-[0_0_30px_-8px_rgba(10,110,211,0.25)] hover:-translate-y-0.5"
    >
      <div className="relative h-48 bg-[#000919] overflow-hidden flex-shrink-0">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-2">
              {isFacility ? (
                <Building2 size={28} className="text-[#6CB6FF]/50" />
              ) : (
                <Package size={28} className="text-[#6CB6FF]/50" />
              )}
            </div>
            <span className="text-xs text-white/20">No image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium tracking-wide bg-[#0A6ED3]/80 text-white backdrop-blur-sm">
            {isFacility ? "Facility" : "Equipment"}
          </span>

          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium backdrop-blur-sm flex items-center gap-1.5 ${getStatusClass(resource.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(resource.status)}`} />
            {formatEnum(resource.status)}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3.5">
          <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-1 group-hover:text-[#6CB6FF] transition-colors duration-200">
            {resource.name}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <MetaRow icon={isFacility ? Building2 : Wrench} text={formatEnum(resource.type)} />
          <MetaRow icon={MapPin} text={resource.location || "N/A"} />
          <MetaRow
            icon={isFacility ? Users : Package}
            text={`${isFacility ? "Capacity" : "Quantity"}: ${resource.capacity ?? 0}`}
          />
        </div>

        <p className="text-[13px] text-white/35 line-clamp-2 flex-1 leading-relaxed mb-4">
          {resource.description || "No description available."}
        </p>

        <div className="flex gap-3 mt-auto">
          {/* 🔥 FIXED BUTTON */}
          <button
            onClick={() => onBookNow(resource)}
            disabled={
              !resource.isBookable ||
              ["OUT_OF_SERVICE", "UNDER_MAINTENANCE"].includes(resource.status)
            }
            className="flex-1 bg-[#0A6ED3] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-medium transition"
          >
            Book Now
          </button>

          <button
            onClick={() => onViewDetails(resource)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              bg-[#0A6ED3]/15 text-[#6CB6FF] border border-[#0A6ED3]/25
              hover:bg-[#0A6ED3] hover:text-white hover:border-[#0A6ED3]"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-white/50">
      <Icon size={13} className="text-[#6CB6FF]/60 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function StatChip({ icon: Icon, label, count }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 text-xs"
      style={{ background: "rgba(0, 18, 51, 0.6)" }}
    >
      <Icon size={12} className="text-[#6CB6FF]/60" />
      <span className="text-white/40">{label}</span>
      <span className="text-white/70 font-medium">{count}</span>
    </div>
  );
}

function StudentResources() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [facilityResponse, equipmentResponse] = await Promise.all([
        axios.get(FACILITY_API_URL),
        axios.get(EQUIPMENT_API_URL),
      ]);

      const facilities = (facilityResponse.data || []).map(normalizeFacility);
      const equipment = (equipmentResponse.data || []).map(normalizeEquipment);
      const mergedResources = [...facilities, ...equipment];

      const resourcesWithImages = await Promise.all(
        mergedResources.map(async (resource) => {
          const imageUrl = await fetchPrimaryImage(resource);
          return { ...resource, imageUrl };
        })
      );

      setResources(resourcesWithImages);
    } catch (error) {
      console.error("Error fetching student resources:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const q = searchText.toLowerCase();

      const matchesSearch =
        resource.name?.toLowerCase().includes(q) ||
        resource.code?.toLowerCase().includes(q) ||
        resource.location?.toLowerCase().includes(q) ||
        resource.type?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" || resource.category === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" || resource.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [resources, searchText, categoryFilter, statusFilter]);

  const facilityCount = useMemo(
    () => resources.filter((r) => r.category === "FACILITY").length,
    [resources]
  );

  const equipmentCount = useMemo(
    () => resources.filter((r) => r.category === "EQUIPMENT").length,
    [resources]
  );

  const hasActiveFilters =
    searchText || categoryFilter !== "ALL" || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearchText("");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleOpenDetails = (resource) => {
    if (resource.category === "FACILITY") {
      setSelectedFacilityId(resource.id);
      setIsFacilityModalOpen(true);
    }
  };

  const handleCloseFacilityModal = () => {
    setIsFacilityModalOpen(false);
    setSelectedFacilityId(null);
  };

  const handleBookNow = (resource) => {
    const role = localStorage.getItem("role") || "";
    const basePath = role === "LECTURER" ? "/lecturer" : "/student";
    navigate(`${basePath}/bookings/new`, {
      state: {
        resourceId: resource.id,
        resourceType: resource.category,
      },
    });
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#000919" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10,110,211,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,110,211,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#0A6ED3]/20 border border-[#0A6ED3]/30 flex items-center justify-center">
                  <Layers size={15} className="text-[#6CB6FF]" />
                </div>
                <span className="text-xs font-medium text-[#6CB6FF]/70 tracking-widest uppercase">
                  Campus Resources
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Browse Resources
              </h1>
              <p className="text-sm text-white/40 mt-1.5 max-w-md">
                Explore available facilities and equipment across the campus.
              </p>
            </div>

            {!loading && (
              <div className="flex items-center gap-2 flex-wrap">
                <StatChip
                  icon={Building2}
                  label="Facilities"
                  count={facilityCount}
                />
                <StatChip
                  icon={Wrench}
                  label="Equipment"
                  count={equipmentCount}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/8 p-4 mb-6"
          style={{ background: "rgba(0, 18, 51, 0.5)" }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, code, type, or location…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-xl bg-[#000919]/60 border border-white/8 pl-10 pr-9 py-2.5
                  text-sm text-white placeholder:text-white/25
                  outline-none focus:border-[#0A6ED3]/60 focus:ring-2 focus:ring-[#0A6ED3]/10
                  transition-all"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <div className="min-w-[160px]">
                <FilterSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={CATEGORY_OPTIONS}
                  icon={Layers}
                />
              </div>
              <div className="min-w-[180px]">
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={STATUS_OPTIONS}
                  icon={SlidersHorizontal}
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && !loading && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
              <span className="text-xs text-white/35">
                {filteredResources.length} result
                {filteredResources.length !== 1 ? "s" : ""} found
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-[#6CB6FF]/60 hover:text-[#6CB6FF] transition-colors flex items-center gap-1"
              >
                <X size={12} />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div
            className="rounded-2xl border border-white/8 p-16 text-center"
            style={{ background: "rgba(0, 18, 51, 0.3)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <Search size={22} className="text-white/20" />
            </div>
            <p className="text-white/60 text-base font-medium">
              No resources found
            </p>
            <p className="text-white/25 text-sm mt-1.5">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-5 px-5 py-2 rounded-xl text-sm font-medium
                  bg-[#0A6ED3]/15 text-[#6CB6FF] border border-[#0A6ED3]/25
                  hover:bg-[#0A6ED3]/25 transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/30">
                {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={`${resource.category}-${resource.id}`}
                  resource={resource}
                  onViewDetails={handleOpenDetails}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          </>
        )}

        <FacilityDetailsModal
          isOpen={isFacilityModalOpen}
          onClose={handleCloseFacilityModal}
          facilityId={selectedFacilityId}
        />
      </div>
    </div>
  );
}

export default StudentResources;