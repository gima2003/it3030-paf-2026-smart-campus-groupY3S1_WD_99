import api from "./api";

export const getFacilities = async () => {
  const response = await api.get("/facilities");
  return response.data;
};