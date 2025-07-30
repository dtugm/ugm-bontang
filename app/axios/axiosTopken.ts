import axios from "axios";

const runtimeConfig = useRuntimeConfig();

const axiosToken = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
axiosToken.interceptors.request.use((config) => {
  const token = useCookie("my_token").value;
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default axiosToken;
