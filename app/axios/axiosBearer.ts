import axios, { type AxiosRequestConfig } from "axios";

const runtimeConfig = useRuntimeConfig();

const axiosBearer = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
});

axiosBearer.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
export const apiGetData = <T = any>(
  url: string,
  queryParams?: Record<string, any>
) =>
  axiosBearer
    .get<T>(url, {
      params: queryParams,
    })
    .then((res) => res.data);
export const apiGetRaw = <T = any>(url: string, config = {}) =>
  axiosBearer.get<T>(url, config).then((res) => res.data);

export const apiPostData = <T = any>(url: string, data?: any, config = {}) =>
  axiosBearer.post<T>(url, data, config).then((res) => res.data);

export const apiUploadWithStructuredPayload = async <T = any>(
  url: string,
  payload: {
    data: Record<string, any>;
    images: File | File[];
  },
  config: AxiosRequestConfig = {}
) => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  } else {
    formData.append("images", payload.images);
  }

  const res = await axiosBearer.post<T>(url, formData, config);
  return res.data;
};
export const apiUpdateWithStructuredPayload = async <T = any>(
  url: string,
  payload: {
    data: Record<string, any>;
    images: File | File[];
  },
  config: AxiosRequestConfig = {}
) => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  } else {
    formData.append("images", payload.images);
  }

  const res = await axiosBearer.put<T>(url, formData, config);
  return res.data;
};

export const apiPutData = <T = any>(url: string, data?: any, config = {}) =>
  axiosBearer.put<T>(url, data, config).then((res) => res.data);

export const apiDeleteData = <T = any>(url: string, config = {}) =>
  axiosBearer.delete<T>(url, config).then((res) => res.data);

export const buildPath = (
  path: string,
  params: Record<string, string | number>
): string => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`{${key}}`, encodeURIComponent(String(value)));
  }, path);
};

export default axiosBearer;
