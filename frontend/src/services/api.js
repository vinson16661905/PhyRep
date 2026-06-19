import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
export const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
export const requestTex = async (payload) => {
    const { data } = await apiClient.post("/generate-tex", payload);
    return data;
};
