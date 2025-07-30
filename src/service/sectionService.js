import api from "@/utils/axios";

export async function fetchSection() {
  try {
    const response = await api.get("sections");
    return response.data.sections;
  } catch (e) {
    console.error("Error fetching sections:", e);
  } 
}
