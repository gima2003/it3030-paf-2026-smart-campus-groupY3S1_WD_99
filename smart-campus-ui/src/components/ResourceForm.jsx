import { useEffect, useMemo, useState } from "react";
import Toast from "./Toast";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

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

      setExistingImages(initialData.images || []);
    } else {
      setFormData(emptyForm);
      setExistingImages([]);
    }

    setSelectedImages([]);
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
  if (toast.message) {
    const timer = setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }
  }, [toast]);

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

    if (Object.keys(newErrors).length > 0) {
      setToast({
        message: "Please fix the highlighted fields",
        type: "error",
      });
      return false;
    }

    return true;
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

  const handleImageSelection = (files) => {
    const validFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  const handleFileInputChange = (e) => {
    handleImageSelection(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageSelection(e.dataTransfer.files);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

    const handleRemoveExistingImage = (imageIdToRemove) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.id !== imageIdToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        selectedImages,
        existingImages,
      });

      setToast({
        message: initialData
          ? "Resource updated successfully"
          : "Resource created successfully",
        type: "success",
      });

      onClose();
    } catch (error) {
      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  const isFacility = formData.resourceCategory === "FACILITY";
  const title = initialData ? "Edit Resource" : "Add New Resource";
  const subtitle = initialData
    ? "Update the selected resource details"
    : "Enter the details for a new facility or equipment resource";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-[#000919] border border-white/10 rounded-xl shadow-2xl">
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

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-5">
            {/* Left Side - Existing Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                  <p className="text-red-400 text-xs mt-1">
                    {errors.resourceCode}
                  </p>
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
                <label className="block text-xs text-gray-400 mb-1">
                  Status
                </label>
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
                    <p className="text-red-400 text-xs mt-1">
                      {errors.location}
                    </p>
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
                    <p className="text-red-400 text-xs mt-1">
                      {errors.capacity}
                    </p>
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
                    <p className="text-red-400 text-xs mt-1">
                      {errors.capacity}
                    </p>
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

              <div className="md:col-span-2">
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
            </div>

            {/* Right Side - Image Upload */}
            <div className="bg-[#001233]/40 border border-white/10 rounded-xl p-4 h-fit">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Resource Images
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Browse or drag and drop images for this{" "}
                  {isFacility ? "facility" : "equipment"}.
                </p>
              </div>

              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-6 cursor-pointer transition ${
                  isDragOver
                    ? "border-[#0A6ED3] bg-[#0A6ED3]/10"
                    : "border-white/15 bg-[#000919]/60 hover:border-[#0A6ED3]/60"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="text-white text-sm font-medium mb-1">
                  Drag & drop images here
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  or click to browse from your device
                </div>
                <span className="bg-[#0A6ED3] hover:bg-[#054E98] text-white px-4 py-2 rounded-lg text-xs font-medium transition">
                  Browse Images
                </span>
              </label>

              <div className="mt-4 space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {existingImages.length === 0 && selectedImages.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-3">
                    No images selected yet
                  </div>
                ) : (
                  <>
                    {existingImages.map((image) => (
                      <div
                        key={`existing-${image.id}`}
                        className="flex items-center justify-between gap-3 bg-[#000919]/80 border border-white/10 rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <img
                            src={image.imageUrl}
                            alt={image.fileName || "resource"}
                            className="w-10 h-10 rounded object-cover border border-white/10"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-white truncate">
                              {image.fileName || "Existing image"}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {image.isPrimary ? "Primary image" : "Saved image"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {selectedImages.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-3 bg-[#000919]/80 border border-white/10 rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB • New image
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-red-400 hover:text-red-300 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      </div>
    </div>
  );
}

export default ResourceForm;