import axios from "axios";
const runtimeConfig = useRuntimeConfig();

const apiBase = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
if (runtimeConfig.public.API_KEY) {
  apiBase.defaults.headers.common[
    "Authorization"
  ] = `ApiKey ${runtimeConfig.public.API_KEY}`;
}
apiBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiPostData = async (url: string, data: any, config = {}) => {
  try {
    const response = await apiBase.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error("API Post Error:", error);
    throw error;
  }
};
export const apiGetData = async (url: string, params = {}, config = {}) => {
  try {
    const response: IResponseAPI = await apiBase.get(url, {
      params,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Get Error:", error?.response?.data || error.message);
    throw error;
  }
};

export const apiPutData = async (url: string, data: any, config = {}) => {
  try {
    const response = await apiBase.put(url, data, config);
    return response.data;
  } catch (error: any) {
    console.error("API PUT Error:", error?.response?.data || error.message);
    throw error;
  }
};
export const apiDeleteData = async (url: string, config = {}) => {
  try {
    const response = await apiBase.delete(url, config);
    return response.data;
  } catch (error: any) {
    console.error("API DELETE Error:", error?.response?.data || error.message);
    throw error;
  }
};

// Helper untuk PATCH request
export const apiPatchData = async (url: any, data: any, config = {}) => {
  try {
    const response = await apiBase.patch(url, data, config);
    return response.data;
  } catch (error: any) {
    console.error("API PATCH Error:", error?.response?.data || error.message);
    throw error;
  }
};

export default apiBase;
