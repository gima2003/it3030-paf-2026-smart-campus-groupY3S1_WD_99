import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";
import { getFacilities } from "../services/facilityService";

function StudentBookingForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedResourceId = location.state?.resourceId || "";

  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    resourceId: selectedResourceId,
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFacilities();

    const storedUserId = localStorage.getItem("userId") || "1";

    setFormData((prev) => ({
      ...prev,
      userId: storedUserId,
      resourceId: selectedResourceId || prev.resourceId,
    }));
  }, [selectedResourceId]);

  const fetchFacilities = async () => {
    try {
      setLoadingFacilities(true);
      const data = await getFacilities();
      setFacilities(data);
    } catch (error) {
      console.error("Error loading facilities:", error);
      setErrorMessage("Failed to load facilities.");
    } finally {
      setLoadingFacilities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.resourceId) return "Please select a facility.";
    if (!formData.date) return "Please select a booking date.";
    if (!formData.startTime) return "Please select a start time.";
    if (!formData.endTime) return "Please select an end time.";
    if (!formData.purpose.trim()) return "Please enter a purpose.";
    if (formData.startTime >= formData.endTime) {
      return "End time must be later than start time.";
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
      resourceId: Number(formData.resourceId),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      attendees: formData.attendees ? Number(formData.attendees) : 0,
    };

    try {
      setSubmitting(true);
      await createBooking(payload);

      setSuccessMessage("Booking request submitted successfully.");

      setTimeout(() => {
        navigate("/student/bookings");
      }, 1200);
    } catch (error) {
      console.error("Booking creation failed:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
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

    setFormData((prev) => ({
      ...prev,
      resourceId: selectedResourceId || "",
      date: "",
      startTime: "",
      endTime: "",
      purpose: "",
      attendees: "",
    }));
  };

  return (
    <div className="bg-[#000919] min-h-screen p-6 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Create Booking Request</h2>
          <p className="text-gray-400">
            Fill in the details to request a booking for a campus facility.
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
            <h3 className="text-lg font-semibold mt-2">Facility Booking</h3>
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
              <p>• Select a facility from the list.</p>
              <p>• Choose a valid booking date and time range.</p>
              <p>• Add a clear booking purpose.</p>
              <p>• Enter expected attendees where applicable.</p>
              <p>• Your request will be reviewed by admin.</p>
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
                  Facility
                </label>
                <select
                  name="resourceId"
                  value={formData.resourceId}
                  onChange={handleChange}
                  disabled={loadingFacilities}
                  className="w-full bg-[#0b1730] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED3]"
                >
                  <option value="">
                    {loadingFacilities ? "Loading facilities..." : "Select facility"}
                  </option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
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
                  disabled={submitting}
                  className="bg-[#0A6ED3] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60"
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