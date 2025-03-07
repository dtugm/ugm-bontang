import axios from "axios";
const runtimeConfig = useRuntimeConfig();

const apiBase = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiBase.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export const apiPostData = async (url: string, data: any, config = {}) => {
  try {
    const response = await apiBase.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("API Post Error:", error);
    throw error;
  }
};

export default apiBase;
