import { apiDeleteData, apiGetData, apiPostData, apiPutData } from "../helper";
const mainPath = "/vectors";

export default {
  get_all_vectors: async (payload?: any) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  upload_vector: async (payload?: any) => {
    return apiPostData(`${mainPath}`, payload);
  },
  edit_vector: async (id: string, payload?: any) => {
    return apiPutData(`${mainPath}/${id}`, payload);
  },
  delete_vector: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`);
  },
};
