import axios from "axios";

const runtimeConfig = useRuntimeConfig();

const axiosBearer = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosBearer.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosBearer;
