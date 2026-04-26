import api from "./api";

export const getEquipment = async () => {
  try {
    const response = await api.get("/equipment");
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};