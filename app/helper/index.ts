import axios from "axios";
const runtimeConfig = useRuntimeConfig();
import { useToast } from "vue-toastification";
const apiBase = axios.create({
  baseURL: runtimeConfig.public.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
if (runtimeConfig.public.API_BASE_KEY_NEW) {
  apiBase.defaults.headers.common[
    "Authorization"
  ] = `ApiKey ${runtimeConfig.public.API_BASE_KEY_NEW}`;
}

apiBase.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiPostData = async (url: string, data: any, headers = {}) => {
  try {
    const response: any = await apiBase.post(url, data, {
      headers: { ...apiBase.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
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

export const apiPutData = async (url: string, data: any, headers = {}) => {
  try {
    const response = await apiBase.put(url, data, {
      headers: { ...apiBase.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// API DELETE
export const apiDeleteData = async (url: string, headers = {}) => {
  try {
    const response = await apiBase.delete(url, {
      headers: { ...apiBase.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
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
export async function actionWrapper<T extends IResponseAPI>(
  callback: () => Promise<T>,
  messageSuccess: string = "Success",
  messageFail: string = "Failed"
) {
  const $toast = useToast();
  try {
    const resp = await callback();
    if (resp.status && resp.status == "error") {
      $toast.error(resp.msg || messageFail);
    } else {
      $toast.success(resp?.msg || messageSuccess);
    }

    return resp;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.msg) {
      $toast.error(err.response.data.msg || messageFail);
      throw err;
    } else if (err.msg) {
      $toast.error(err.msg || messageFail);
      throw err;
    } else {
      $toast.error(messageFail); // Fallback if no specific error message is provided
      throw err;
    }
  }
}
export class FormInput implements IFormInput {
  type?:
    | "autocomplete"
    | "checkbox"
    | "combobox"
    | "datepicker"
    | "daterange"
    | "file"
    | "file_image"
    | "password"
    | "select"
    | "text"
    | "number"
    | "textarea"
    | "usergroup"
    | "usergroupaccess"
    | "provider"
    | "project_phase"
    | "icon"
    | "parent_menu"
    | "richtexteditor"
    | "filebox"
    | "milestone"
    | "file_image_v2"
    | "file_v2"
    | "kontraktor"
    | "radio"
    | "siteRealId"
    | undefined = "text";

  label!: string;
  placeholder?: string | undefined;
  rules?: any[] | undefined;
  disabled?: boolean | undefined;
  readonly?: boolean | undefined;
  items?: any[] | undefined;
  itemValue?: string | undefined;
  itemTitle?: string | undefined;
  hide?: boolean | undefined;
  cols?: number | undefined = 12;
  sm?: number | undefined;
  md?: number | undefined;
  lg?: number | undefined;
  hint?: string | undefined;
  persistentHint?: boolean | undefined;
  preview_img?: string | undefined;
  isFilter?: boolean | undefined;
  multiple?: boolean | undefined;
  clearable?: boolean | undefined;
  hideDetails?: boolean | undefined;
  loading?: boolean | undefined;
  accept?: string;
  onClick?: any;
  onSearch?: any;
  falseValue?: any | undefined;
  trueValue?: any | undefined;
  tooltip?: string | undefined;
  isMultiple?: boolean | undefined;
  canSelectAll?: boolean | undefined;

  constructor(args: IFormInput) {
    Object.assign(this, args);
  }
}
