import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  MapPin,
  Users,
  Filter,
  Search,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

const FACILITY_API_URL = "http://localhost:8081/api/facilities";
const EQUIPMENT_API_URL = "http://localhost:8081/api/equipment";

const getFacilityImagesUrl = (id) =>
  `http://localhost:8081/api/facilities/${id}/images`;

const getEquipmentImagesUrl = (id) =>
  `http://localhost:8081/api/equipment/${id}/images`;

const fallbackImage =
  "https://placehold.co/1000x600/001233/FFFFFF?text=No+Image";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_BADGES = {
  ACTIVE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  UNDER_MAINTENANCE:
    "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  OUT_OF_SERVICE: "bg-red-500/15 text-red-300 border border-red-500/20",
  INACTIVE: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
  ARCHIVED: "bg-violet-500/15 text-violet-300 border border-violet-500/20",
};

const formatEnum = (value) =>
  value
    ? value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : "N/A";

const badgeClass = (status) =>
  STATUS_BADGES[status] ?? "bg-white/10 text-white/70 border border-white/10";

const normalizeFacilityDetail = (facility) => ({
  id: facility.id,
  resourceCategory: "FACILITY",
  resourceCode: facility.code || "",
  name: facility.name || "Unnamed Facility",
  type: facility.facilityType || "",
  description: facility.description || "",
  location: facility.building || "",
  capacity: facility.capacity ?? 0,
  status: facility.status || "ACTIVE",
  isBookable:
    facility.active !== undefined && facility.active !== null
      ? facility.active
      : true,
  indoorOutdoor: facility.indoorOutdoor || "",
  equipmentIds: facility.equipmentIds || [],
  equipmentNames: facility.equipmentNames || [],
});

const normalizeEquipmentDetail = (equipment) => ({
  id: equipment.id,
  resourceCategory: "EQUIPMENT",
  resourceCode: equipment.code || "",
  name: equipment.name || "Unnamed Equipment",
  type: equipment.equipmentType || "",
  description: equipment.description || "",
  location: equipment.currentLocation || "",
  capacity: equipment.quantity ?? 0,
  status: equipment.status || "ACTIVE",
  isBookable:
    equipment.active !== undefined && equipment.active !== null
      ? equipment.active
      : true,
  facilityIds: equipment.facilityIds || [],
  facilityNames: equipment.facilityNames || [],
});

const normalizeEquipmentListItem = (equipment) => ({
  id: equipment.id,
  code: equipment.code || "",
  name: equipment.name || "Unnamed Equipment",
  type: equipment.equipmentType || "",
  status: equipment.status || "ACTIVE",
  quantity: equipment.quantity ?? 0,
  location: equipment.currentLocation || "",
  facilityIds: equipment.facilityIds || [],
  facilityNames: equipment.facilityNames || [],
  imageUrl: "",
});

function SectionCard({ title, icon: Icon, rightContent, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0A6ED3]/15 border border-[#0A6ED3]/20 flex items-center justify-center">
            <Icon size={15} className="text-[#6CB6FF]" />
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        {rightContent}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <Icon size={13} className="text-[#6CB6FF]" />
        <span>{label}</span>
      </div>
      <p className="text-sm text-white font-medium truncate">{value}</p>
    </div>
  );
}

function ImageSlider({ images, title }) {
  const safeImages =
    images.length > 0
      ? images
      : [{ id: "fallback", imageUrl: fallbackImage, fileName: "No image" }];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-[#001233] border border-white/10">
        <img
          src={safeImages[currentIndex].imageUrl || fallbackImage}
          alt={safeImages[currentIndex].fileName || title}
          className="w-full h-full object-cover"
        />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white border border-white/10 flex items-center justify-center hover:bg-[#0A6ED3]/80 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white border border-white/10 flex items-center justify-center hover:bg-[#0A6ED3]/80 transition"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <div className="absolute left-3 bottom-3 px-2.5 py-1 rounded-lg bg-black/50 text-xs text-white border border-white/10">
          {currentIndex + 1} / {safeImages.length}
        </div>
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {safeImages.slice(0, 4).map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-14 rounded-xl overflow-hidden border ${
                currentIndex === index
                  ? "border-[#0A6ED3] ring-1 ring-[#0A6ED3]/40"
                  : "border-white/10"
              }`}
            >
              <img
                src={image.imageUrl || fallbackImage}
                alt={image.fileName || `thumb-${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkedEquipmentCards({ items, onRemove }) {
  if (!items.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-400">
        No equipment linked to this facility.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3"
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#001233] border border-white/10 flex items-center justify-center shrink-0">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={20} className="text-white/20" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{item.name}</p>
            <p className="text-xs text-gray-400 mt-1">{formatEnum(item.type)}</p>
            <span
              className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] ${badgeClass(
                item.status
              )}`}
            >
              {formatEnum(item.status)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-red-300 hover:text-red-200 hover:bg-red-500/10 p-2 rounded-lg transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ResourceDetailsModal({
  isOpen,
  onClose,
  resource,
  onResourceUpdated,
}) {
  const [detail, setDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [allEquipment, setAllEquipment] = useState([]);
  const [linkedEquipmentCards, setLinkedEquipmentCards] = useState([]);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("ALL");
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFacility = resource?.resourceCategory === "FACILITY";
  const resourceId = resource?.id;

  useEffect(() => {
    if (!isOpen || !resourceId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const detailUrl = isFacility
          ? `${FACILITY_API_URL}/${resourceId}`
          : `${EQUIPMENT_API_URL}/${resourceId}`;

        const imageUrl = isFacility
          ? getFacilityImagesUrl(resourceId)
          : getEquipmentImagesUrl(resourceId);

        const [detailRes, imageRes, equipmentRes] = await Promise.all([
          axios.get(detailUrl),
          axios.get(imageUrl).catch(() => ({ data: [] })),
          isFacility
            ? axios.get(EQUIPMENT_API_URL).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);

        const normalizedDetail = isFacility
          ? normalizeFacilityDetail(detailRes.data)
          : normalizeEquipmentDetail(detailRes.data);

        setDetail(normalizedDetail);

        const orderedImages = [...(imageRes.data || [])].sort((a, b) => {
          if (a.isPrimary === b.isPrimary) return 0;
          return a.isPrimary ? -1 : 1;
        });
        setImages(orderedImages);

        if (isFacility) {
          const normalizedEquipments = (equipmentRes.data || []).map(
            normalizeEquipmentListItem
          );

          const linkedBase = normalizedEquipments.filter((item) =>
            normalizedDetail.equipmentIds.includes(item.id)
          );

          const linkedWithImages = await Promise.all(
            linkedBase.map(async (item) => {
              try {
                const res = await axios.get(getEquipmentImagesUrl(item.id));
                const imgs = res.data || [];
                const primary = imgs.find((img) => img.isPrimary) || imgs[0];

                return {
                  ...item,
                  imageUrl: primary?.imageUrl || "",
                };
              } catch {
                return { ...item, imageUrl: "" };
              }
            })
          );

          setAllEquipment(normalizedEquipments);
          setLinkedEquipmentCards(linkedWithImages);
        } else {
          setAllEquipment([]);
          setLinkedEquipmentCards([]);
        }

        setSelectedEquipmentIds([]);
      } catch (error) {
        console.error("Error loading resource details:", error);
        setErrorMessage("Failed to load resource details.");
        setDetail(null);
        setImages([]);
        setAllEquipment([]);
        setLinkedEquipmentCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, resourceId, isFacility]);

  useEffect(() => {
    if (!isOpen) {
      setDetail(null);
      setImages([]);
      setAllEquipment([]);
      setLinkedEquipmentCards([]);
      setSelectedEquipmentIds([]);
      setEquipmentSearch("");
      setEquipmentStatusFilter("ALL");
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [isOpen]);

  const availableEquipment = useMemo(() => {
    if (!isFacility || !detail) return [];

    return allEquipment.filter((item) => {
      const alreadyInCurrentFacility = detail.equipmentIds.includes(item.id);

      const linkedToAnotherFacility =
        Array.isArray(item.facilityIds) &&
        item.facilityIds.length > 0 &&
        !item.facilityIds.includes(detail.id);

      return !alreadyInCurrentFacility && !linkedToAnotherFacility;
    });
  }, [allEquipment, detail, isFacility]);

  const filteredAvailableEquipment = useMemo(() => {
    return availableEquipment.filter((item) => {
      const query = equipmentSearch.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      const matchesStatus =
        equipmentStatusFilter === "ALL" ||
        item.status === equipmentStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [availableEquipment, equipmentSearch, equipmentStatusFilter]);

  const handleToggleEquipmentSelection = (equipmentId) => {
    setSelectedEquipmentIds((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleAddSelectedEquipments = async () => {
    if (!detail || !isFacility || selectedEquipmentIds.length === 0) return;

    const selectedItems = allEquipment.filter((item) =>
      selectedEquipmentIds.includes(item.id)
    );

    const selectedWithImages = await Promise.all(
      selectedItems.map(async (item) => {
        try {
          const res = await axios.get(getEquipmentImagesUrl(item.id));
          const imgs = res.data || [];
          const primary = imgs.find((img) => img.isPrimary) || imgs[0];

          return {
            ...item,
            imageUrl: primary?.imageUrl || "",
          };
        } catch {
          return { ...item, imageUrl: "" };
        }
      })
    );

    setDetail((prev) => ({
      ...prev,
      equipmentIds: [...prev.equipmentIds, ...selectedItems.map((i) => i.id)],
      equipmentNames: [...prev.equipmentNames, ...selectedItems.map((i) => i.name)],
    }));

    setLinkedEquipmentCards((prev) => [...prev, ...selectedWithImages]);
    setSelectedEquipmentIds([]);
  };

  const handleRemoveLinkedEquipment = (equipmentId) => {
    if (!detail || !isFacility) return;

    const removeIndex = detail.equipmentIds.findIndex((id) => id === equipmentId);

    setDetail((prev) => ({
      ...prev,
      equipmentIds: prev.equipmentIds.filter((id) => id !== equipmentId),
      equipmentNames: prev.equipmentNames.filter((_, index) => index !== removeIndex),
    }));

    setLinkedEquipmentCards((prev) =>
      prev.filter((item) => item.id !== equipmentId)
    );
  };

  const handleSaveFacilityEquipmentLinks = async () => {
    if (!detail || !isFacility) return;

    try {
      setIsSavingLinks(true);

      const payload = {
        name: detail.name,
        code: detail.resourceCode,
        description: detail.description,
        facilityType: detail.type,
        building: detail.location,
        capacity: Number(detail.capacity) || 0,
        indoorOutdoor: detail.indoorOutdoor,
        status: detail.status,
        active: detail.isBookable,
        equipmentIds: detail.equipmentIds,
      };

      await axios.put(`${FACILITY_API_URL}/${detail.id}`, payload);

      if (onResourceUpdated) {
        await onResourceUpdated();
      }
    } catch (error) {
      console.error("Failed to update facility equipment:", error);
      alert("Failed to update facility equipment links");
    } finally {
      setIsSavingLinks(false);
    }
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-5">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#000919] border border-white/10 rounded-3xl shadow-2xl text-white flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {detail?.name ||
                (isFacility ? "Facility Details" : "Equipment Details")}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Admin resource details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-5">
          {isLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
              Loading resource details...
            </div>
          ) : errorMessage ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-red-300">
              {errorMessage}
            </div>
          ) : !detail ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-400">
              Resource details could not be loaded.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
                <SectionCard title="Images" icon={isFacility ? Building2 : Package}>
                  <ImageSlider images={images} title={detail.name} />
                </SectionCard>

                <SectionCard title="Overview" icon={isFacility ? Building2 : Package}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard
                      icon={isFacility ? Building2 : Package}
                      label="Category"
                      value={detail.resourceCategory}
                    />
                    <InfoCard
                      icon={Filter}
                      label="Status"
                      value={formatEnum(detail.status)}
                    />
                    <InfoCard
                      icon={Building2}
                      label="Code"
                      value={detail.resourceCode || "N/A"}
                    />
                    <InfoCard
                      icon={MapPin}
                      label={isFacility ? "Building" : "Location"}
                      value={detail.location || "N/A"}
                    />
                    <InfoCard
                      icon={Users}
                      label={isFacility ? "Capacity" : "Quantity"}
                      value={detail.capacity ?? 0}
                    />
                    <InfoCard
                      icon={Filter}
                      label="Bookable"
                      value={detail.isBookable ? "Yes" : "No"}
                    />
                    <div className="col-span-2">
                      <InfoCard
                        icon={isFacility ? Building2 : Package}
                        label="Type"
                        value={formatEnum(detail.type)}
                      />
                    </div>
                    {isFacility && (
                      <div className="col-span-2">
                        <InfoCard
                          icon={Filter}
                          label="Indoor / Outdoor"
                          value={formatEnum(detail.indoorOutdoor)}
                        />
                      </div>
                    )}
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <p className="text-xs text-gray-400 mb-1">Description</p>
                      <p className="text-sm text-white leading-6">
                        {detail.description || "No description"}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {isFacility && (
                <>
                  <SectionCard
                    title="Linked Equipment"
                    icon={Package}
                    rightContent={
                      <button
                        type="button"
                        onClick={handleSaveFacilityEquipmentLinks}
                        disabled={isSavingLinks}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0A6ED3] hover:bg-[#054E98] disabled:opacity-50 transition"
                      >
                        <Save size={14} />
                        {isSavingLinks ? "Saving..." : "Save"}
                      </button>
                    }
                  >
                    <LinkedEquipmentCards
                      items={linkedEquipmentCards}
                      onRemove={handleRemoveLinkedEquipment}
                    />
                  </SectionCard>

                  <SectionCard
                    title="Add Existing Equipment"
                    icon={Plus}
                    rightContent={
                      <button
                        type="button"
                        onClick={handleAddSelectedEquipments}
                        disabled={selectedEquipmentIds.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0A6ED3]/15 text-[#6CB6FF] border border-[#0A6ED3]/25 hover:bg-[#0A6ED3]/25 disabled:opacity-40 transition"
                      >
                        <Plus size={14} />
                        Add Selected
                      </button>
                    }
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
                        <div className="relative">
                          <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Search equipment by name, code, type, or location"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                            className="w-full rounded-xl bg-[#001233] border border-white/10 pl-10 pr-3 py-3 text-sm text-white outline-none focus:border-[#0A6ED3]"
                          />
                        </div>

                        <select
                          value={equipmentStatusFilter}
                          onChange={(e) => setEquipmentStatusFilter(e.target.value)}
                          className="w-full rounded-xl bg-[#001233] border border-white/10 px-3 py-3 text-sm text-white outline-none focus:border-[#0A6ED3]"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="overflow-x-auto border border-white/10 rounded-2xl">
                        <table className="w-full min-w-[700px] text-sm">
                          <thead className="bg-white/5 border-b border-white/10">
                            <tr className="text-left text-xs text-gray-400">
                              <th className="px-4 py-3">Select</th>
                              <th className="px-4 py-3">Code</th>
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-4 py-3">Location</th>
                              <th className="px-4 py-3">Qty</th>
                              <th className="px-4 py-3">Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredAvailableEquipment.length === 0 ? (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="px-4 py-8 text-center text-gray-400"
                                >
                                  No available equipment found
                                </td>
                              </tr>
                            ) : (
                              filteredAvailableEquipment.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-white/10 hover:bg-white/5"
                                >
                                  <td className="px-4 py-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedEquipmentIds.includes(item.id)}
                                      onChange={() =>
                                        handleToggleEquipmentSelection(item.id)
                                      }
                                      className="h-4 w-4"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-white/80">
                                    {item.code || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-white font-medium">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-3 text-white/70">
                                    {formatEnum(item.type)}
                                  </td>
                                  <td className="px-4 py-3 text-white/70">
                                    {item.location || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-white/70">
                                    {item.quantity ?? 0}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeClass(
                                        item.status
                                      )}`}
                                    >
                                      {formatEnum(item.status)}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </SectionCard>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}