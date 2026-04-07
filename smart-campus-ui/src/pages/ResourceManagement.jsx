import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ResourceForm from "../components/ResourceForm";

const FACILITY_API_URL = "http://localhost:8081/api/facilities";
const EQUIPMENT_API_URL = "http://localhost:8081/api/equipment";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ARCHIVED", label: "Archived" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types" },
  { value: "LECTURE_HALL", label: "Lecture Hall" },
  { value: "LAB", label: "Lab" },
  { value: "MEETING_ROOM", label: "Meeting Room" },
  { value: "AUDITORIUM", label: "Auditorium" },
  { value: "PLAYGROUND", label: "Playground" },
  { value: "BASKETBALL_COURT", label: "Basketball Court" },
  { value: "VOLLEYBALL_COURT", label: "Volleyball Court" },
  { value: "BADMINTON_COURT", label: "Badminton Court" },
  { value: "PROJECTOR", label: "Projector" },
  { value: "LAPTOP", label: "Laptop" },
  { value: "SPEAKER_SYSTEM", label: "Speaker System" },
  { value: "MICROPHONE", label: "Microphone" },
  { value: "WHITEBOARD", label: "Whiteboard" },
  { value: "COMPUTER", label: "Computer" },
  { value: "SPORTS_KIT", label: "Sports Kit" },
];

const STATUS_CLASSES = {
  ACTIVE: "bg-green-500/20 text-green-300 border border-green-500/30",
  UNDER_MAINTENANCE:
    "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  OUT_OF_SERVICE: "bg-red-500/20 text-red-300 border border-red-500/30",
  INACTIVE: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  ARCHIVED: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
};

const TABLE_HEADERS = [
  "Code",
  "Name",
  "Type",
  "Location",
  "Capacity",
  "Bookable",
  "Status",
  "Actions",
];

const getStatusClass = (status) =>
  STATUS_CLASSES[status] ?? "bg-white/10 text-white border border-white/10";

const formatEnum = (value) => value?.replaceAll("_", " ");

const normalizeFacility = (facility) => ({
  id: facility.id,
  resourceCategory: "FACILITY",
  resourceCode: facility.code || "",
  name: facility.name || "",
  type: facility.facilityType || "",
  description: facility.description || "",
  status: facility.status || "ACTIVE",
  isBookable:
    facility.active !== undefined && facility.active !== null
      ? facility.active
      : true,
  location: facility.building || "",
  capacity: facility.capacity ?? 0,
  indoorOutdoor: facility.indoorOutdoor || "INDOOR",
});

const normalizeEquipment = (equipment) => ({
  id: equipment.id,
  resourceCategory: "EQUIPMENT",
  resourceCode: equipment.code || "",
  name: equipment.name || "",
  type: equipment.equipmentType || "",
  description: equipment.description || "",
  status: equipment.status || "ACTIVE",
  isBookable:
    equipment.active !== undefined && equipment.active !== null
      ? equipment.active
      : true,
  location: "N/A",
  capacity: equipment.quantity ?? 0,
  indoorOutdoor: null,
});

const buildFacilityPayload = (formData) => ({
  name: formData.name,
  code: formData.resourceCode,
  description: formData.description,
  facilityType: formData.type,
  building: formData.location,
  capacity: Number(formData.capacity) || 0,
  indoorOutdoor: formData.indoorOutdoor || "INDOOR",
  status: formData.status,
  active: formData.isBookable,
  equipmentIds: [],
});

const buildEquipmentPayload = (formData) => ({
  name: formData.name,
  code: formData.resourceCode,
  description: formData.description,
  equipmentType: formData.type,
  quantity: Number(formData.capacity) || 0,
  status: formData.status,
  active: formData.isBookable,
  facilityIds: [],
});

function StatCard({ label, value, colorClass = "text-white" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <p className="text-gray-400 text-xs">{label}</p>
      <h3 className={`text-xl font-semibold mt-1 ${colorClass}`}>{value}</h3>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ResourceRow({ resource, onEdit, onDelete }) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition text-sm">
      <td className="px-4 py-2.5 font-medium">{resource.resourceCode}</td>

      <td className="px-4 py-2.5">
        <p className="font-medium text-white">{resource.name}</p>
        <p className="text-xs text-gray-400 line-clamp-1">
          {resource.description || "No description"}
        </p>
      </td>

      <td className="px-4 py-2.5 text-gray-300">{formatEnum(resource.type)}</td>
      <td className="px-4 py-2.5 text-gray-300">{resource.location || "N/A"}</td>
      <td className="px-4 py-2.5 text-gray-300">{resource.capacity ?? 0}</td>

      <td className="px-4 py-2.5">
        <span
          className={`px-2 py-0.5 rounded-full text-xs border ${
            resource.isBookable
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
          }`}
        >
          {resource.isBookable ? "Yes" : "No"}
        </span>
      </td>

      <td className="px-4 py-2.5">
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(
            resource.status
          )}`}
        >
          {formatEnum(resource.status)}
        </span>
      </td>

      <td className="px-4 py-2.5">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onEdit(resource)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-md text-xs font-medium transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(resource)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function ResourceManagement() {
  const [resources, setResources] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);

      const [facilityResponse, equipmentResponse] = await Promise.all([
        axios.get(FACILITY_API_URL),
        axios.get(EQUIPMENT_API_URL),
      ]);

      const normalizedFacilities = (facilityResponse.data || []).map(
        normalizeFacility
      );
      const normalizedEquipment = (equipmentResponse.data || []).map(
        normalizeEquipment
      );

      setResources([...normalizedFacilities, ...normalizedEquipment]);
    } catch (error) {
      console.error("Error fetching resources:", error);
      alert("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenAddForm = () => {
    setEditingResource(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (resource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingResource(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      const isFacility = formData.resourceCategory === "FACILITY";
      const payload = isFacility
        ? buildFacilityPayload(formData)
        : buildEquipmentPayload(formData);

      if (editingResource) {
        const updateUrl =
          editingResource.resourceCategory === "FACILITY"
            ? `${FACILITY_API_URL}/${editingResource.id}`
            : `${EQUIPMENT_API_URL}/${editingResource.id}`;

        await axios.put(updateUrl, payload);
        alert("Resource updated successfully");
      } else {
        const createUrl = isFacility ? FACILITY_API_URL : EQUIPMENT_API_URL;
        await axios.post(createUrl, payload);
        alert("Resource created successfully");
      }

      handleCloseForm();
      fetchResources();
    } catch (error) {
      console.error("Error saving resource:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to save resource. Check backend validation and enum values."
      );
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      return;
    }

    try {
      const deleteUrl =
        resource.resourceCategory === "FACILITY"
          ? `${FACILITY_API_URL}/${resource.id}`
          : `${EQUIPMENT_API_URL}/${resource.id}`;

      await axios.delete(deleteUrl);
      alert("Resource deleted successfully");
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        resource.resourceCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        resource.location?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || resource.status === statusFilter;

      const matchesType = typeFilter === "ALL" || resource.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [resources, searchText, statusFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: resources.length,
      active: resources.filter((r) => r.status === "ACTIVE").length,
      maintenance: resources.filter((r) => r.status === "UNDER_MAINTENANCE")
        .length,
      outOfService: resources.filter((r) => r.status === "OUT_OF_SERVICE")
        .length,
    }),
    [resources]
  );

  return (
    <div className="text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold">
            Facilities & Resource Management
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Manage campus facilities and equipment resources in one place
          </p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="bg-[#0A6ED3] hover:bg-[#054E98] px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Resource
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total Resources" value={stats.total} />
        <StatCard
          label="Active"
          value={stats.active}
          colorClass="text-green-400"
        />
        <StatCard
          label="Under Maintenance"
          value={stats.maintenance}
          colorClass="text-yellow-400"
        />
        <StatCard
          label="Out of Service"
          value={stats.outOfService}
          colorClass="text-red-400"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Search by code, name, or location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={TYPE_OPTIONS}
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr className="text-left text-xs text-gray-400">
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className={`px-4 py-2.5 font-medium ${
                      header === "Actions" ? "text-center" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    Loading resources...
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-sm text-gray-400"
                  >
                    No resources found
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => (
                  <ResourceRow
                    key={`${resource.resourceCategory}-${resource.id}`}
                    resource={resource}
                    onEdit={handleOpenEditForm}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ResourceForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={editingResource}
      />
    </div>
  );
}

export default ResourceManagement;