function ResourceDetailsModal({ isOpen, onClose, resource }) {
  if (!isOpen || !resource) return null;

  const isFacility = resource.resourceCategory === "FACILITY";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#000919] border border-white/10 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div>
            <h2 className="text-base font-semibold text-white">
              {isFacility ? "Facility Details" : "Equipment Details"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              View full information about this resource
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-1">Category</p>
            <p className="text-white font-medium">
              {resource.resourceCategory}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Code</p>
            <p className="text-white font-medium">{resource.resourceCode}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Name</p>
            <p className="text-white font-medium">{resource.name}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Type</p>
            <p className="text-white font-medium">{resource.type}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">
              {isFacility ? "Building" : "Location"}
            </p>
            <p className="text-white font-medium">
              {resource.location || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">
              {isFacility ? "Capacity" : "Quantity"}
            </p>
            <p className="text-white font-medium">{resource.capacity ?? 0}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Bookable</p>
            <p className="text-white font-medium">
              {resource.isBookable ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-1">Status</p>
            <p className="text-white font-medium">{resource.status}</p>
          </div>

          {isFacility && (
            <div>
              <p className="text-gray-400 text-xs mb-1">Indoor / Outdoor</p>
              <p className="text-white font-medium">
                {resource.indoorOutdoor || "N/A"}
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <p className="text-gray-400 text-xs mb-1">Description</p>
            <p className="text-white font-medium">
              {resource.description || "No description"}
            </p>
          </div>

          {/* Footer button */}
          <div className="md:col-span-2 pt-2">
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailsModal;