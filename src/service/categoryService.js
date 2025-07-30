import api from "@/utils/axios";

export async function fetchCategories() {
  try {
    const response = await api.get("categories");
    return response.data;
  } catch (e) {
    console.error("Error fetching categories:", e);
  } 
}
