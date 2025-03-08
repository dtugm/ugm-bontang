import axios from "axios";
const runtimeConfig = useRuntimeConfig();

const apiBase = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
if (runtimeConfig.public.API_BASE_KEY_NEW) {
  apiBase.defaults.headers.common[
    "Authorization"
  ] = `ApiKey ${runtimeConfig.public.API_BASE_KEY_NEW}`;
}
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
export class CustomFormData extends FormData {
  constructor() {
    super();
  }

  generateFormByObj(payload: { [key: string]: any }): void {
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        this.addForm(key, payload[key]);
      }
    }
  }

  addForm(fieldName: string, fieldData: any, nullAllowed = false): void {
    if (Array.isArray(fieldData)) {
      if (fieldData.length === 0) {
        fieldData = null;
      } else {
        const undefinedDataList = fieldData.filter(
          (data) => data === undefined
        );
        if (undefinedDataList.length === fieldData.length) {
          fieldData = null;
        }
      }
    }
    if (nullAllowed) {
      this.append(fieldName, fieldData);
    } else {
      if (fieldData !== null && fieldData !== "") {
        this.append(fieldName, fieldData);
      } else if (fieldData === 0) {
        this.append(fieldName, fieldData);
      }
    }
  }
}
export default apiBase;
