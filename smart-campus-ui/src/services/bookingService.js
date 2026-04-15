import api from "./api";

/*
  Booking Service
  ---------------
  Uses PUT because backend controller methods are:
  @PutMapping("/{bookingId}/approve")
  @PutMapping("/{bookingId}/reject")
  @PutMapping("/{bookingId}/cancel")
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