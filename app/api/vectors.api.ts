import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  objectToFormData,
} from "../helper";
const mainPath = "/vectors";

export default {
  get_all_vectors: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  upload_vector: async (payload?: any) => {
    const formData = objectToFormData(payload);
    return apiPostData(`${mainPath}`, formData, {
      "Content-Type": "multipart/form-data",
    });
  },
  edit_vector: async (id: string, payload?: any) => {
    return apiPutData(`${mainPath}/${id}`, payload);
  },
  delete_vector: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`);
  },
};
