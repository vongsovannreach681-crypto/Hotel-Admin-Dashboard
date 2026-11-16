import axios from "axios";
import { MOCK_HOTELS, MOCK_ROOMS } from "../data/mockData";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/";
export const SERVER_STATIC_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
  },
});

export const getImageUrl = (image, fallback = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80") => {
  if (!image) return fallback;
  if (Array.isArray(image)) {
    if (image.length === 0) return fallback;
    return getImageUrl(image[0], fallback);
  }
  if (typeof image !== "string") return fallback;
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }
  const cleanPath = image.replace(/^\/+/, "");
  return `${SERVER_STATIC_URL}${cleanPath}`;
};

export const getHotelsData = async () => {
  try {
    const res = await api.get("/hotel");
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return MOCK_HOTELS;
  } catch (error) {
    console.warn("Backend hotel API unreachable or empty. Using fallback hotel catalog:", error.message);
    return MOCK_HOTELS;
  }
};

export const getRoomsData = async () => {
  try {
    const res = await api.get("/rooms");
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return MOCK_ROOMS;
  } catch (error) {
    console.warn("Backend room API unreachable or empty. Using fallback room catalog:", error.message);
    return MOCK_ROOMS;
  }
};

export const submitBooking = async (bookingData) => {
  try {
    const res = await api.post("/booking", bookingData);
    return { success: true, data: res.data };
  } catch (error) {
    console.warn("Backend booking API error:", error?.response?.data || error.message);
    // Return formatted error or simulated booking if offline
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to create booking",
    };
  }
};

export const getBookingsData = async () => {
  try {
    const res = await api.get("/booking");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.warn("Failed to fetch bookings:", error.message);
    return [];
  }
};

export default api;
