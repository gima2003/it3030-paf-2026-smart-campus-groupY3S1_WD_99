import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, checkBookingAvailability } from "../services/bookingService";
import { getFacilities } from "../services/facilityService";
import { getEquipment } from "../services/equipmentService";
import Swal from "sweetalert2";

function StudentBookingForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Support both:
  // 1. Book Now from resources page
  // 2. Book Again from bookings page
  const selectedResourceId = location.state?.resourceId || "";
  const selectedResourceType = location.state?.resourceType || "FACILITY";
  const bookingData = location.state?.bookingData || null;

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    resourceType: "FACILITY",
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetchResources();

    const storedUserId = localStorage.getItem("userId") || "1";

    setFormData({
      userId: storedUserId,
      resourceType:
        bookingData?.resourceType || selectedResourceType || "FACILITY",
      resourceId: bookingData?.resourceId || selectedResourceId || "",
      date: bookingData?.date || "",
      startTime: bookingData?.startTime || "",
      endTime: bookingData?.endTime || "",
      purpose: bookingData?.purpose || "",
      attendees: bookingData?.attendees || "",
    });
  }, [selectedResourceId, selectedResourceType, bookingData]);

  useEffect(() => {
    const shouldCheck =
      formData.resourceId &&
      formData.date &&
      formData.startTime &&
      formData.endTime;

    if (!shouldCheck) {
      setAvailability(null);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setAvailability({
        available: false,
        message: "End time must be later than start time.",
        suggestions: [],
      });
      return;
    }

    const runAvailabilityCheck = async () => {
      try {
        setCheckingAvailability(true);

        const payload = {
          resourceType: formData.resourceType,
          facilityId:
            formData.resourceType === "FACILITY"
              ? Number(formData.resourceId)
              : null,
          equipmentId:
            formData.resourceType === "EQUIPMENT"
              ? Number(formData.resourceId)
              : null,
          bookingDate: formData.date,
          startTime: `${formData.startTime}:00`,
          endTime: `${formData.endTime}:00`,
        };

        const result = await checkBookingAvailability(payload);
        setAvailability(result);
      } catch (error) {
        console.error("Availability check failed:", error);
        setAvailability({
          available: false,
          message: "Failed to check availability.",
          suggestions: [],
        });
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeoutId = setTimeout(() => {
      runAvailabilityCheck();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [
    formData.resourceType,
    formData.resourceId,
    formData.date,
    formData.startTime,
    formData.endTime,
  ]);

  const fetchResources = async () => {
    try {
      setLoadingResources(true);

      const [facilityData, equipmentData] = await Promise.all([
        getFacilities(),
        getEquipment(),
      ]);

      const normalizedFacilities = (
        Array.isArray(facilityData) ? facilityData : []
      ).map((facility) => ({
        id: facility.id,
        name: facility.name,
        type: "FACILITY",
      }));

      const normalizedEquipment = (
        Array.isArray(equipmentData) ? equipmentData : []
      ).map((equipment) => ({
        id: equipment.id,
        name: equipment.name,
        type: "EQUIPMENT",
      }));

      setResources([...normalizedFacilities, ...normalizedEquipment]);
    } catch (error) {
      console.error("Error loading resources:", error);
      setErrorMessage("Failed to load resources.");
    } finally {
      setLoadingResources(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSuccessMessage("");
    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "resourceType" ? { resourceId: "" } : {}),
    }));
  };

  const handleSuggestionClick = (slot) => {
    setSuccessMessage("");
    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
    }));
  };

  const validateForm = () => {
    if (!formData.resourceId) {
      return `Please select a ${
        formData.resourceType === "EQUIPMENT" ? "equipment" : "facility"
      }.`;
    }
    if (!formData.date) return "Please select a booking date.";
    if (!formData.startTime) return "Please select a start time.";
    if (!formData.endTime) return "Please select an end time.";
    if (!formData.purpose.trim()) return "Please enter a purpose.";

    if (formData.startTime >= formData.endTime) {
      return "End time must be later than start time.";
    }

    if (availability && !availability.available) {
      return availability.message || "Selected time slot is not available.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = {
      userId: Number(formData.userId),
      resourceType: formData.resourceType,
      facilityId:
        formData.resourceType === "FACILITY"
          ? Number(formData.resourceId)
          : null,
      equipmentId:
        formData.resourceType === "EQUIPMENT"
          ? Number(formData.resourceId)
          : null,
      bookingDate: formData.date,
      startTime: `${formData.startTime}:00`,
      endTime: `${formData.endTime}:00`,
      purpose: formData.purpose,
      attendees: formData.attendees ? Number(formData.attendees) : 0,
    };

    try {
      setSubmitting(true);
      await createBooking(payload);

        await Swal.fire({
          title: "Booking Successful",
          text: "Your booking request has been submitted successfully.",
          icon: "success",
          confirmButtonText: "Go to My Bookings",

          background: "#081225",
          color: "#ffffff",
          confirmButtonColor: "#0A6ED3",

          iconColor: "#22c55e",
          customClass: {
            popup: "rounded-2xl border border-white/10 shadow-2xl",
            title: "text-white font-semibold",
            htmlContainer: "text-gray-300",
            confirmButton: "rounded-xl px-6 py-3 font-semibold",
          },
        });

        navigate("/student/bookings");
    } catch (error) {
      console.error("Booking creation failed:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : null) ||
        "Failed to submit booking request.";

      setErrorMessage(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to submit booking request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setAvailability(null);

    setFormData((prev) => ({
      ...prev,
      resourceType:
        bookingData?.resourceType || selectedResourceType || "FACILITY",
      resourceId: bookingData?.resourceId || selectedResourceId || "",
      date: bookingData?.date || "",
      startTime: bookingData?.startTime || "",
      endTime: bookingData?.endTime || "",
      purpose: bookingData?.purpose || "",
      attendees: bookingData?.attendees || "",
    }));
  };

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Create Booking Request</h2>
          <p className="text-gray-400">
            Fill in the details to request a booking for a campus resource.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Workflow</p>
            <h3 className="text-lg font-semibold mt-2">
              PENDING → APPROVED / REJECTED
            </h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Request Type</p>
            <h3 className="text-lg font-semibold mt-2">
              {formData.resourceType === "EQUIPMENT"
                ? "Equipment Booking"
                : "Facility Booking"}
            </h3>
          </div>

          <div className="bg-[#081225] p-5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm">Review</p>
            <h3 className="text-lg font-semibold mt-2">Admin approval required</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#081225] p-6 rounded-2xl border border-white/10 h-fit">
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                • Select a{" "}
                {formData.resourceType === "EQUIPMENT" ? "equipment" : "facility"}{" "}
                from the list.
              </p>
              <p>• Choose a valid booking date and time range.</p>
              <p>• Add a clear booking purpose.</p>
              <p>• Enter expected attendees where applicable.</p>
              <p>• Your request will be reviewed by admin.</p>
              {bookingData && (
                <p className="text-yellow-300">
                  • Rebooking previous request. Review and update details before
                  submitting.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#081225] p-6 md:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Booking Form</h3>
              <div className="h-10 w-10 rounded-xl bg-[#0A6ED3]/20 border border-[#0A6ED3]/30 flex items-center justify-center text-[#0A6ED3] text-xl font-bold">
                +
              </div>
            </div>

            {successMessage && (
              <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Resource Type
                </label>
                <select
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleChange}
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                >
                  <option value="FACILITY">Facility</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  {formData.resourceType === "EQUIPMENT" ? "Equipment" : "Facility"}
                </label>
                <select
                  name="resourceId"
                  value={formData.resourceId}
                  onChange={handleChange}
                  disabled={loadingResources}
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                >
                  <option value="">
                    {loadingResources
                      ? "Loading resources..."
                      : formData.resourceType === "EQUIPMENT"
                      ? "Select equipment"
                      : "Select facility"}
                  </option>
                  {resources
                    .filter((resource) => resource.type === formData.resourceType)
                    .map((resource) => (
                      <option
                        key={`${resource.type}-${resource.id}`}
                        value={resource.id}
                      >
                        {resource.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                  />
                </div>
              </div>

              {(checkingAvailability || availability) && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    checkingAvailability
                      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                      : availability?.available
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  <p>
                    {checkingAvailability
                      ? "Checking availability..."
                      : availability?.message}
                  </p>

                  {!checkingAvailability &&
                    availability &&
                    !availability.available &&
                    availability.suggestions &&
                    availability.suggestions.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-2">Suggested available slots:</p>

                        <div className="flex flex-wrap gap-2">
                          {availability.suggestions.map((slot, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSuggestionClick(slot)}
                              className="px-3 py-2 rounded-lg border border-red-400/30 bg-[#0b1730] hover:bg-white/5 text-white transition"
                            >
                              {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Purpose
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter the purpose of the booking"
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter attendee count"
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    checkingAvailability ||
                    (availability && !availability.available)
                  }
                  className="bg-[#0A6ED3] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Booking"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="border border-white/10 hover:bg-white/5 text-white px-6 py-3 rounded-xl transition"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentBookingForm;