import { useEffect, useMemo, useState } from "react";

function ResourceForm({ isOpen, onClose, onSubmit, initialData }) {
  const emptyForm = {
    resourceCategory: "FACILITY",
    resourceCode: "",
    name: "",
    type: "LECTURE_HALL",
    description: "",
    status: "ACTIVE",
    isBookable: true,
    location: "",
    capacity: 0,
    indoorOutdoor: "INDOOR",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const facilityTypeOptions = useMemo(
    () => [
      { value: "LECTURE_HALL", label: "Lecture Hall" },
      { value: "LAB", label: "Lab" },
      { value: "MEETING_ROOM", label: "Meeting Room" },
      { value: "AUDITORIUM", label: "Auditorium" },
      { value: "PLAYGROUND", label: "Playground" },
      { value: "BASKETBALL_COURT", label: "Basketball Court" },
      { value: "VOLLEYBALL_COURT", label: "Volleyball Court" },
      { value: "BADMINTON_COURT", label: "Badminton Court" },
    ],
    []
  );

  const equipmentTypeOptions = useMemo(
    () => [
      { value: "PROJECTOR", label: "Projector" },
      { value: "LAPTOP", label: "Laptop" },
      { value: "SPEAKER_SYSTEM", label: "Speaker System" },
      { value: "MICROPHONE", label: "Microphone" },
      { value: "WHITEBOARD", label: "Whiteboard" },
      { value: "COMPUTER", label: "Computer" },
      { value: "SPORTS_KIT", label: "Sports Kit" },
    ],
    []
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        resourceCategory: initialData.resourceCategory || "FACILITY",
        resourceCode: initialData.resourceCode || "",
        name: initialData.name || "",
        type: initialData.type || "LECTURE_HALL",
        description: initialData.description || "",
        status: initialData.status || "ACTIVE",
        isBookable:
          initialData.isBookable !== undefined ? initialData.isBookable : true,
        location: initialData.location || "",
        capacity: initialData.capacity ?? 0,
        indoorOutdoor: initialData.indoorOutdoor || "INDOOR",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resourceCode.trim()) {
      newErrors.resourceCode = "Resource code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Resource name is required";
    }

    if (!String(formData.type || "").trim()) {
      newErrors.type = "Type is required";
    }

    if (formData.resourceCategory === "FACILITY" && !formData.location.trim()) {
      newErrors.location = "Building is required";
    }

    if (formData.capacity < 0) {
      newErrors.capacity = `${
        formData.resourceCategory === "FACILITY" ? "Capacity" : "Quantity"
      } cannot be negative`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : name === "capacity"
            ? Number(value)
            : value,
      };

      if (name === "resourceCategory") {
        if (value === "FACILITY") {
          updated.type = "LECTURE_HALL";
          updated.location = "";
          updated.capacity = 0;
          updated.indoorOutdoor = "INDOOR";
        } else {
          updated.type = "PROJECTOR";
          updated.location = "";
          updated.capacity = 1;
          updated.indoorOutdoor = "INDOOR";
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isFacility = formData.resourceCategory === "FACILITY";
  const title = initialData ? "Edit Resource" : "Add New Resource";
  const subtitle = initialData
    ? "Update the selected resource details"
    : "Enter the details for a new facility or equipment resource";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#000919] border border-white/10 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-base leading-none"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5"
        >
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Resource Category
            </label>
            <select
              name="resourceCategory"
              value={formData.resourceCategory}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
            >
              <option value="FACILITY">Facility</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Resource Code
            </label>
            <input
              type="text"
              name="resourceCode"
              value={formData.resourceCode}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
              placeholder={isFacility ? "e.g. FAC-001" : "e.g. EQ-001"}
            />
            {errors.resourceCode && (
              <p className="text-red-400 text-xs mt-1">{errors.resourceCode}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Resource Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
              placeholder={
                isFacility ? "e.g. Main Lecture Hall" : "e.g. Projector A"
              }
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              {isFacility ? "Facility Type" : "Equipment Type"}
            </label>

            {isFacility ? (
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
              >
                {facilityTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                list="equipment-type-options"
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
                placeholder="e.g. Projector"
              />
            )}

            {!isFacility && (
              <datalist id="equipment-type-options">
                {equipmentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value} />
                ))}
              </datalist>
            )}

            {errors.type && (
              <p className="text-red-400 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
            >
              <option value="ACTIVE">Active</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {isFacility ? (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Building
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
                placeholder="e.g. Engineering Block"
              />
              {errors.location && (
                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
                placeholder="e.g. 1"
              />
              {errors.capacity && (
                <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>
          )}

          {isFacility ? (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
                placeholder="e.g. 150"
              />
              {errors.capacity && (
                <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Equipment Type
              </label>
              <input
                type="text"
                value={formData.type}
                readOnly
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white/80 outline-none"
              />
            </div>
          )}

          {isFacility && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Indoor / Outdoor
              </label>
              <select
                name="indoorOutdoor"
                value={formData.indoorOutdoor}
                onChange={handleChange}
                className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
              >
                <option value="INDOOR">Indoor</option>
                <option value="OUTDOOR">Outdoor</option>
              </select>
            </div>
          )}

          <div className={isFacility ? "md:col-span-2" : "md:col-span-2"}>
            <label className="block text-xs text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-lg bg-[#001233] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#0A6ED3]"
              placeholder="Short description about the resource"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="isBookable"
              checked={formData.isBookable}
              onChange={handleChange}
              className="h-3.5 w-3.5"
            />
            <label className="text-xs text-gray-300">
              This resource is bookable
            </label>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="submit"
              className="bg-[#0A6ED3] hover:bg-[#054E98] text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
            >
              {initialData ? "Update Resource" : "Create Resource"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResourceForm;