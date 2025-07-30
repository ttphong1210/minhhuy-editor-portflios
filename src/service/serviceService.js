import api from "@/utils/axios";

export async function fetchServices() {
  try {
    const response = await api.get("services");
    return response.data;
  } catch (e) {
    console.error("Error fetching services:", e);
  } 
}
