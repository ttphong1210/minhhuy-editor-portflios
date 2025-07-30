import api from "@/utils/axios";

export async function fetchAbout() {
  try {
    const response = await api.get("about");
    return response.data.about;
  } catch (e) {
    console.error("Error fetching about:", e);
  }
}
