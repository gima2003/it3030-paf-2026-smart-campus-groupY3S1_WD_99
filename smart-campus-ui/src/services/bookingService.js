import api from "./api";

/*
  Booking Service
  ---------------
  Backend endpoints:
  POST   /bookings
  GET    /bookings
  GET    /bookings/user/{id}
  PUT    /bookings/{id}/approve
  PUT    /bookings/{id}/reject
  PUT    /bookings/{id}/cancel
  DELETE /bookings/{id}
  POST   /bookings/check-availability
*/

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};

export const approveBooking = async (bookingId, reason = "") => {
  try {
    const response = await api.put(`/bookings/${bookingId}/approve`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error(`Error approving booking ${bookingId}:`, error);
    throw error;
  }
};

export const rejectBooking = async (bookingId, reason = "") => {
  try {
    const response = await api.put(`/bookings/${bookingId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error(`Error rejecting booking ${bookingId}:`, error);
    throw error;
  }
};

export const cancelBooking = async (bookingId, reason = "") => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting booking ${bookingId}:`, error);
    throw error;
  }
};

export const checkBookingAvailability = async (availabilityData) => {
  try {
    const response = await api.post("/bookings/check-availability", availabilityData);
    return response.data;
  } catch (error) {
    console.error("Error checking booking availability:", error);
    throw error;
  }
};