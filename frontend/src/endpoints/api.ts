import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
console.log("API Base URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Ensures cookies (tokens) are sent
  headers: { "Content-Type": "application/json" }
});

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("token/", { username, password });
    console.log("Login response:", response.data);

    const { access, refresh } = response.data;

    // ✅ Store tokens securely in localStorage
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return response.data;
  } catch (error: any) {
    console.error("Login API Error:", error);
    throw error.response?.data?.error || "Login failed";
  }
};
export const fetchMatches = async (username: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("❌ No access token found!");
      throw new Error("User not authenticated. Please log in.");
    }

    console.log("🔍 Fetching matches for:", username);

    const response = await axiosInstance.get("matchmaking/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("✅ Matchmaking Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Matchmaking API Error:", error.response?.data || error);
    throw error.response?.data?.error || "Failed to fetch matches";
  }
};
